import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '@/data/seed';
import {
  addProduct,
  changeStock,
  countLowStock,
  deleteProduct,
  getProducts,
  getProductsByFilter,
  initDatabase,
  parseId,
  type InventoryFilter,
  type NewProduct,
} from '@/services/db';

type ProductsValue = {
  products: Product[];
  lowStockCount: number;
  loading: boolean;
  error: string | null;
  search: string;
  filter: InventoryFilter;
  setSearch: (value: string) => void;
  setFilter: (value: InventoryFilter) => void;
  /** Re-reads using the current search term and chip filter. */
  loadData: () => void;
  addProduct: (input: NewProduct) => void;
  deleteProduct: (id: string) => void;
  changeStock: (id: string, delta: number) => void;
};

const ProductsContext = createContext<ProductsValue | null>(null);

/**
 * Owns the inventory list for the whole app.
 *
 * Every read and write goes through `@/services/db`, so no screen touches SQL
 * directly. One-time setup (WAL, schema, indexes, auto-seed) happens at module
 * import, before the first query.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InventoryFilter>('All');

  initDatabase();

  const commit = useCallback((rows: Product[], low: number) => {
    setProducts(rows);
    setLowStockCount(low);
    setError(null);
    setLoading(false);
  }, []);

  const fail = useCallback((err: unknown) => {
    setError(err instanceof Error ? err.message : 'Failed to load products');
    setLoading(false);
  }, []);

  /**
   * Reads the current result set. Called on mount and after every mutation, so
   * the list always reflects what SQLite actually holds.
   */
  const loadData = useCallback(() => {
    try {
      // Search and the chip filter combine: SQL narrows by term, then category.
      const bySearch = search.trim().length > 0 ? getProducts(search) : null;
      const rows =
        bySearch && filter !== 'All'
          ? bySearch.filter((p) =>
              filter === 'Low stock' ? p.stock <= 10 : p.category === filter,
            )
          : filter !== 'All'
            ? getProductsByFilter(filter)
            : bySearch ?? getProducts();

      commit(rows, countLowStock());
    } catch (err) {
      fail(err);
    }
  }, [search, filter, commit, fail]);

  // Runs after the first paint, then whenever the term or filter changes.
  useEffect(() => {
    const handle = setTimeout(loadData, 0);
    return () => clearTimeout(handle);
  }, [loadData]);

  const value = useMemo<ProductsValue>(
    () => ({
      products,
      lowStockCount,
      loading,
      error,
      search,
      filter,
      setSearch,
      setFilter,
      loadData,
      addProduct: (input) => {
        addProduct(input);
        loadData();
      },
      deleteProduct: (id) => {
        deleteProduct(parseId(id));
        loadData();
      },
      changeStock: (id, delta) => {
        changeStock(parseId(id), delta);
        loadData();
      },
    }),
    [products, lowStockCount, loading, error, search, filter, loadData],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider');
  return ctx;
}

export type { InventoryFilter, NewProduct } from '@/services/db';
