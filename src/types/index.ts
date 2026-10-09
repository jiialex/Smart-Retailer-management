export type ProductStatus = 'Active' | 'Low Stock' | 'Out of Stock' | 'Discontinued';
export type TransactionStatus = 'Completed' | 'Pending' | 'Refunded' | 'Voided';
export type PaymentMethod = 'Cash' | 'Card' | 'Mobile Pay';
export type UserRole = 'Manager' | 'Cashier' | 'Admin';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  categoryName: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  reorderLevel: number;
  status: ProductStatus;
  barcode?: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  sellPrice: number;
  quantity: number;
  maxQuantity: number;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  date: string;
  cashier: string;
  items: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
}

export interface StockAlert {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  severity: 'warning' | 'critical';
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  prefix?: string;
  suffix?: string;
  isHero?: boolean;
  trend: 'up' | 'down' | 'neutral';
  positive: boolean;
}