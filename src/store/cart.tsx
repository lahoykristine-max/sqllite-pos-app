import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '@/data/seed';

export type CartLine = {
  product: Product;
  qty: number;
};

type CartValue = {
  lines: CartLine[];
  /** Number of distinct line items (what the design labels "3 items"). */
  count: number;
  /** Number of physical units. */
  units: number;
  total: number;
  add: (product: Product) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

/** Holds the active order so the POS and Payment tabs share one basket. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((product: Product) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const count = lines.length;
    const units = lines.reduce((sum, l) => sum + l.qty, 0);
    const total = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0);
    return { lines, count, units, total, add, clear };
  }, [lines, add, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}