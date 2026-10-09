/**
 * Mock data mirroring the "Lab4" Figma file.
 *
 * Bar heights and colours were measured from a 2x render of the Reports frame
 * (the Figma node x-positions for the bars are laid out out of order, so the
 * rendered geometry is the reliable source).
 */

export type Product = {
  id: string;
  name: string;
  /** Short label used on the POS grid. */
  tileName: string;
  price: number;
  stock: number;
  supplier: string;
  category: string;
  icon: string;
};

/** Dashboard hero stat strip. */
export const heroStats = [
  { icon: 'alert-circle-outline', value: '8 items', label: 'Low Stock', tint: '#FFE4E6', tone: 'rose' },
  { icon: 'truck-outline', value: '14 active', label: 'Suppliers', tint: '#DCFCE7', tone: 'blue' },
  { icon: 'cart-outline', value: '38 today', label: 'Orders', tint: '#FEF3C7', tone: 'amber' },
] as const;

/** Dashboard sparkline bars (height, colour). */
export const sparkBars = [
  { h: 14, tone: 'indigoSoft' },
  { h: 24, tone: 'indigoSoft' },
  { h: 18, tone: 'indigoSoft' },
  { h: 30, tone: 'greenSoft' },
  { h: 26, tone: 'indigoSoft' },
  { h: 38, tone: 'greenSoft' },
  { h: 30, tone: 'indigoSoft' },
] as const;

export const quickActions = [
  { label: 'New Sale', icon: 'cart-outline', route: '/pos', tone: 'indigo' },
  { label: 'Add Stock', icon: 'package-variant-closed', route: '/inventory', tone: 'greenBright' },
  { label: 'Suppliers', icon: 'truck-outline', route: '/inventory', tone: 'blue' },
  { label: 'Reports', icon: 'chart-bar', route: '/reports', tone: 'amber' },
] as const;

/**
 * Product rows now live in SQLite (`pos_inventory.db`) and are read through
 * `@/services/products`.
 *
 * The `Product` type above remains the UI-facing shape that service widens each
 * database row into — it carries `supplier` / `icon` / `tileName`, which are
 * presentation concerns and deliberately not database columns.
 */
export const transactions = [
  { id: 'INV-1024', meta: 'Cash • 2 min ago', amount: 1250, icon: 'cash' },
  { id: 'INV-1023', meta: 'GCash • 18 min ago', amount: 860, icon: 'target' },
  { id: 'INV-1022', meta: 'Card • 1 hr ago', amount: 2300, icon: 'credit-card' },
] as const;

export const inventoryFilters = ['All', 'Low stock', 'Grocery', 'Drinks'] as const;

export const reportRanges = ['Day', 'Week', 'Month'] as const;

/** Weekly sales bars — heights measured from the 2x Figma render. */
export const weeklySales = [
  { day: 'Mon', h: 114, color: 'greenMid' },
  { day: 'Tue', h: 60, color: 'greenFaint' },
  { day: 'Wed', h: 92, color: 'greenMid' },
  { day: 'Thu', h: 70, color: 'greenPale' },
  { day: 'Fri', h: 84, color: 'greenPale' },
  { day: 'Sat', h: 120, color: 'greenPeak' },
  { day: 'Sun', h: 100, color: 'greenMid' },
] as const;

export const summaryTiles = [
  {
    label: 'Total Sales',
    value: '₱58,320',
    delta: '+12%',
    icon: 'trending-up',
    iconTint: '#DCFCE7',
    iconColor: '#4F46E5',
    pillTint: '#DCFCE7',
    deltaColor: '#16A34A',
  },
  {
    label: 'Transactions',
    value: '142',
    delta: '+8%',
    icon: 'cart-outline',
    iconTint: '#DCFCE7',
    iconColor: '#0284C7',
    pillTint: '#DCFCE7',
    deltaColor: '#0284C7',
  },
  {
    label: 'Top Product',
    value: 'Rice 25kg',
    delta: '38 sold',
    icon: 'image-filter-hdr',
    iconTint: '#DCFCE7',
    iconColor: '#16A34A',
    pillTint: '#DCFCE7',
    deltaColor: '#16A34A',
  },
  {
    label: 'Top Supplier',
    value: 'AgriMart',
    delta: '₱18.2k',
    icon: 'truck-outline',
    iconTint: '#FEF3C7',
    iconColor: '#F59E0B',
    pillTint: '#FEF3C7',
    deltaColor: '#F59E0B',
  },
] as const;

export const paymentMethods = [
  { id: 'cash', label: 'Cash', hint: 'Pay with cash', icon: 'cash' },
  { id: 'card', label: 'Card', hint: 'Debit / Credit', icon: 'credit-card-outline' },
  { id: 'gcash', label: 'GCash', hint: 'E-wallet', icon: 'cellphone' },
] as const;

export const ORDER_REF = '#INV-1025';
