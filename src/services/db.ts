import * as SQLite from 'expo-sqlite';
import type { Product } from '@/data/seed';

/**
 * Lab 05 — SQLite persistence layer (offline-first).
 *
 * Uses the synchronous API (`openDatabaseSync` / `execSync` / `runSync`) so the
 * whole data layer is callable without awaiting, which keeps the screen code in
 * `useEffect` simple. The connection is opened once at module scope and reused.
 */
export const db = SQLite.openDatabaseSync('pos_inventory.db');

/** Threshold shared by the "Low stock" chip and the Dashboard stat. */
export const LOW_STOCK_THRESHOLD = 10;

/** Rows inserted on first launch — the items from the original Lab 04 array. */
const SEED_PRODUCTS: Omit<ProductRow, 'id'>[] = [
  { name: 'Rice 25kg', category: 'Grocery', price: 1150, stock: 42 },
  { name: 'Cooking Oil 1L', category: 'Grocery', price: 95, stock: 18 },
  { name: 'Sugar 1kg', category: 'Grocery', price: 72, stock: 6 },
  { name: 'Canned Sardines', category: 'Canned', price: 28, stock: 120 },
  { name: 'Instant Noodles', category: 'Canned', price: 14, stock: 3 },
  { name: 'Bottled Water', category: 'Drinks', price: 20, stock: 65 },
];

/** A row exactly as stored in the `products` table. */
export type ProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

/** Input accepted by {@link addProduct}. */
export type NewProduct = {
  name: string;
  category: string;
  price: number | string;
  stock: number | string;
};

/* ------------------------------------------------------------------ *
 * Presentation metadata
 *
 * The lab schema is limited to id/name/category/price/stock, but the Lab 04
 * UI also renders a supplier, an icon, and a short POS tile label. Those are
 * presentation concerns, so they live in lookup maps rather than becoming
 * extra columns.
 * ------------------------------------------------------------------ */

const ICON_BY_NAME: Record<string, string> = {
  'rice 25kg': 'image-filter-hdr',
  'cooking oil 1l': 'bottle-tonic',
  'sugar 1kg': 'cup',
  'canned sardines': 'food-apple',
  'instant noodles': 'noodles',
  'bottled water': 'cup-water',
};

const SUPPLIER_BY_NAME: Record<string, string> = {
  'rice 25kg': 'AgriMart Co.',
  'cooking oil 1l': 'Golden Harvest',
  'sugar 1kg': 'SweetCane Inc.',
  'canned sardines': 'OceanPack',
  'instant noodles': 'QuickBite',
  'bottled water': 'PureFlow',
};

const TILE_LABEL_BY_NAME: Record<string, string> = {
  'canned sardines': 'Sardines',
  'instant noodles': 'Noodles',
  'bottled water': 'Water',
  'cooking oil 1l': 'Cooking Oil',
};

const DEFAULT_ICON = 'package-variant-closed';
const DEFAULT_SUPPLIER = 'Unassigned';

/** Widens a database row into the shape the existing screens expect. */
function toProduct(row: ProductRow): Product {
  const key = row.name.trim().toLowerCase();
  return {
    id: String(row.id),
    name: row.name,
    tileName: TILE_LABEL_BY_NAME[key] ?? row.name,
    price: row.price,
    stock: row.stock,
    supplier: SUPPLIER_BY_NAME[key] ?? DEFAULT_SUPPLIER,
    category: row.category,
    icon: ICON_BY_NAME[key] ?? DEFAULT_ICON,
  };
}

/* ------------------------------------------------------------------ *
 * Initialisation
 * ------------------------------------------------------------------ */

let initialised = false;

/**
 * Enables WAL, creates the schema with indexes, and seeds sample inventory.
 *
 * Guarded so it is safe to call from more than one mount: every statement uses
 * `IF NOT EXISTS`, and the seed only runs while the table is empty, so repeated
 * launches never duplicate rows.
 */
export function initDatabase(): void {
  if (initialised) return;
  initialised = true;

  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_name ON products (name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
    CREATE INDEX IF NOT EXISTS idx_products_stock ON products (stock);
  `);

  const countRow = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM products',
  );

  if ((countRow?.count ?? 0) > 0) return;

  const placeholders = SEED_PRODUCTS.map(() => '(?, ?, ?, ?)').join(', ');
  const values = SEED_PRODUCTS.flatMap((p) => [p.name, p.category, p.price, p.stock]);

  db.runSync(
    `INSERT INTO products (name, category, price, stock) VALUES ${placeholders}`,
    values,
  );
}

/* ------------------------------------------------------------------ *
 * Queries — every user-supplied value is bound, never interpolated
 * ------------------------------------------------------------------ */

/**
 * Escapes the LIKE metacharacters so a literal `%` or `_` typed by the user is
 * treated as text. Paired with `ESCAPE '\'` in the query below.
 */
function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Reads products, newest insert first, optionally narrowed by a search term.
 *
 * Both branches share the same `ORDER BY id DESC` so the list never reshuffles
 * as the user types. The term is always bound as a parameter.
 */
export function getProducts(search = ''): Product[] {
  const term = search.trim();

  if (term.length === 0) {
    return db
      .getAllSync<ProductRow>(
        'SELECT id, name, category, price, stock FROM products ORDER BY id DESC',
      )
      .map(toProduct);
  }

  const pattern = `%${escapeLike(term)}%`;
  const rows = db.getAllSync<ProductRow>(
    "SELECT id, name, category, price, stock FROM products WHERE name LIKE ? ESCAPE '\\' ORDER BY id DESC",
    pattern,
  );
  return rows.map(toProduct);
}

/**
 * Reads products for a chip filter, still newest-first.
 *
 * `Low stock` has no matching column so it becomes a range test; the other
 * chips deliberately reuse the stored `category` values.
 */
export function getProductsByFilter(filter: InventoryFilter): Product[] {
  if (filter === 'All') return getProducts();

  if (filter === 'Low stock') {
    return db
      .getAllSync<ProductRow>(
        'SELECT id, name, category, price, stock FROM products WHERE stock <= ? ORDER BY id DESC',
        LOW_STOCK_THRESHOLD,
      )
      .map(toProduct);
  }

  return db
    .getAllSync<ProductRow>(
      'SELECT id, name, category, price, stock FROM products WHERE category = ? ORDER BY id DESC',
      filter,
    )
    .map(toProduct);
}

export type InventoryFilter = 'All' | 'Low stock' | 'Grocery' | 'Drinks';

/** Counts products at or below the low-stock threshold. */
export function countLowStock(): number {
  const row = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM products WHERE stock <= ?',
    LOW_STOCK_THRESHOLD,
  );
  return row?.count ?? 0;
}

/**
 * Inserts a product. Validation happens here as a second line of defence, so an
 * invalid row can never reach the table even if a caller skips the form checks.
 */
export function addProduct(input: NewProduct): number {
  const name = String(input.name).trim();
  const category = String(input.category).trim();
  const price = typeof input.price === 'number' ? input.price : parseFloat(String(input.price));
  const stock = typeof input.stock === 'number' ? input.stock : parseInt(String(input.stock), 10);

  if (name.length === 0) throw new Error('Product name is required');
  if (category.length === 0) throw new Error('Category is required');
  if (Number.isNaN(price) || price <= 0) throw new Error('Price must be a number greater than 0');
  if (Number.isNaN(stock) || stock < 0) throw new Error('Stock must be zero or a positive number');

  return db.runSync(
    'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)',
    name,
    category,
    price,
    stock,
  ).lastInsertRowId;
}

export function deleteProduct(id: number | string): number {
  return db.runSync('DELETE FROM products WHERE id = ?', id).changes;
}

/**
 * Bonus — adjusts stock by a relative amount.
 *
 * `MAX(0, ...)` in SQL is the real guard: clamping only in JavaScript would
 * still let a negative value through any other code path.
 */
export function changeStock(id: number | string, delta: number): number {
  db.runSync('UPDATE products SET stock = MAX(0, stock + ?) WHERE id = ?', delta, id);

  const row = db.getFirstSync<{ stock: number }>(
    'SELECT stock FROM products WHERE id = ?',
    id,
  );
  return row?.stock ?? 0;
}

export function parseId(id: string): number {
  const parsed = Number.parseInt(id, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}
