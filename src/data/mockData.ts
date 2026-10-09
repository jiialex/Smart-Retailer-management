import type { Product, Transaction, StockAlert, Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'cat-001', name: 'Beverages', color: '#2563EB' },
  { id: 'cat-002', name: 'Snacks', color: '#EA580C' },
  { id: 'cat-003', name: 'Dairy', color: '#16A34A' },
  { id: 'cat-004', name: 'Bakery', color: '#D97706' },
  { id: 'cat-005', name: 'Personal Care', color: '#7C3AED' },
  { id: 'cat-006', name: 'Household', color: '#0891B2' },
  { id: 'cat-007', name: 'Frozen', color: '#0284C7' },
  { id: 'cat-008', name: 'Produce', color: '#15803D' },
];

export const PRODUCTS: Product[] = [
  { id: 'prod-001', sku: 'BEV-001', name: 'Sparkling Water 500ml', categoryId: 'cat-001', categoryName: 'Beverages', costPrice: 0.65, sellPrice: 1.49, quantity: 240, reorderLevel: 50, status: 'Active' },
  { id: 'prod-002', sku: 'BEV-002', name: 'Orange Juice 1L', categoryId: 'cat-001', categoryName: 'Beverages', costPrice: 1.20, sellPrice: 2.99, quantity: 18, reorderLevel: 30, status: 'Low Stock' },
  { id: 'prod-003', sku: 'SNK-001', name: 'Sea Salt Chips 150g', categoryId: 'cat-002', categoryName: 'Snacks', costPrice: 0.90, sellPrice: 2.49, quantity: 95, reorderLevel: 40, status: 'Active' },
  { id: 'prod-004', sku: 'SNK-002', name: 'Dark Chocolate Bar 85g', categoryId: 'cat-002', categoryName: 'Snacks', costPrice: 1.10, sellPrice: 3.29, quantity: 0, reorderLevel: 25, status: 'Out of Stock' },
  { id: 'prod-005', sku: 'DAI-001', name: 'Whole Milk 2L', categoryId: 'cat-003', categoryName: 'Dairy', costPrice: 1.40, sellPrice: 3.19, quantity: 44, reorderLevel: 60, status: 'Low Stock' },
  { id: 'prod-006', sku: 'DAI-002', name: 'Greek Yogurt 500g', categoryId: 'cat-003', categoryName: 'Dairy', costPrice: 1.60, sellPrice: 3.79, quantity: 62, reorderLevel: 30, status: 'Active' },
  { id: 'prod-007', sku: 'BAK-001', name: 'Sourdough Loaf 800g', categoryId: 'cat-004', categoryName: 'Bakery', costPrice: 1.80, sellPrice: 4.49, quantity: 22, reorderLevel: 15, status: 'Active' },
  { id: 'prod-008', sku: 'BAK-002', name: 'Croissant 6-Pack', categoryId: 'cat-004', categoryName: 'Bakery', costPrice: 2.20, sellPrice: 5.49, quantity: 8, reorderLevel: 10, status: 'Low Stock' },
  { id: 'prod-009', sku: 'PC-001', name: 'Shampoo 400ml', categoryId: 'cat-005', categoryName: 'Personal Care', costPrice: 2.50, sellPrice: 6.99, quantity: 78, reorderLevel: 20, status: 'Active' },
  { id: 'prod-010', sku: 'PC-002', name: 'Toothpaste 125g', categoryId: 'cat-005', categoryName: 'Personal Care', costPrice: 1.00, sellPrice: 2.89, quantity: 112, reorderLevel: 35, status: 'Active' },
  { id: 'prod-011', sku: 'HH-001', name: 'Dish Soap 500ml', categoryId: 'cat-006', categoryName: 'Household', costPrice: 0.80, sellPrice: 2.29, quantity: 5, reorderLevel: 25, status: 'Low Stock' },
  { id: 'prod-012', sku: 'HH-002', name: 'All-Purpose Cleaner 750ml', categoryId: 'cat-006', categoryName: 'Household', costPrice: 1.20, sellPrice: 3.49, quantity: 33, reorderLevel: 20, status: 'Active' },
  { id: 'prod-013', sku: 'FRZ-001', name: 'Frozen Pizza Margherita', categoryId: 'cat-007', categoryName: 'Frozen', costPrice: 2.80, sellPrice: 6.49, quantity: 29, reorderLevel: 15, status: 'Active' },
  { id: 'prod-014', sku: 'PRD-001', name: 'Organic Bananas 1kg', categoryId: 'cat-008', categoryName: 'Produce', costPrice: 0.60, sellPrice: 1.69, quantity: 150, reorderLevel: 40, status: 'Active' },
  { id: 'prod-015', sku: 'BEV-003', name: 'Cold Brew Coffee 330ml', categoryId: 'cat-001', categoryName: 'Beverages', costPrice: 1.50, sellPrice: 3.99, quantity: 0, reorderLevel: 20, status: 'Discontinued' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 'txn-001', transactionNumber: 'TXN-20261009-0041', date: '2026-10-09T07:02:11', cashier: 'Marcus Okafor', items: 4, subtotal: 12.46, tax: 1.00, discount: 0, total: 13.46, paymentMethod: 'Card', status: 'Completed' },
  { id: 'txn-002', transactionNumber: 'TXN-20261009-0040', date: '2026-10-09T06:58:33', cashier: 'Priya Nair', items: 2, subtotal: 6.18, tax: 0.49, discount: 0.50, total: 6.17, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'txn-003', transactionNumber: 'TXN-20261009-0039', date: '2026-10-09T06:51:07', cashier: 'Marcus Okafor', items: 7, subtotal: 28.73, tax: 2.30, discount: 2.87, total: 28.16, paymentMethod: 'Mobile Pay', status: 'Completed' },
  { id: 'txn-004', transactionNumber: 'TXN-20261009-0038', date: '2026-10-09T06:44:22', cashier: 'Priya Nair', items: 1, subtotal: 3.99, tax: 0.32, discount: 0, total: 4.31, paymentMethod: 'Card', status: 'Completed' },
  { id: 'txn-005', transactionNumber: 'TXN-20261009-0037', date: '2026-10-09T06:38:55', cashier: 'Lena Hoffmann', items: 3, subtotal: 9.17, tax: 0.73, discount: 0, total: 9.90, paymentMethod: 'Cash', status: 'Refunded' },
  { id: 'txn-006', transactionNumber: 'TXN-20261009-0036', date: '2026-10-09T06:31:10', cashier: 'Marcus Okafor', items: 5, subtotal: 17.84, tax: 1.43, discount: 1.78, total: 17.49, paymentMethod: 'Card', status: 'Completed' },
  { id: 'txn-007', transactionNumber: 'TXN-20261009-0035', date: '2026-10-09T06:22:44', cashier: 'Priya Nair', items: 2, subtotal: 5.48, tax: 0.44, discount: 0, total: 5.92, paymentMethod: 'Mobile Pay', status: 'Completed' },
  { id: 'txn-008', transactionNumber: 'TXN-20261009-0034', date: '2026-10-09T06:15:03', cashier: 'Lena Hoffmann', items: 6, subtotal: 22.31, tax: 1.78, discount: 0, total: 24.09, paymentMethod: 'Card', status: 'Voided' },
];

export const STOCK_ALERTS: StockAlert[] = [
  { productId: 'prod-004', sku: 'SNK-002', name: 'Dark Chocolate Bar 85g', quantity: 0, reorderLevel: 25, severity: 'critical' },
  { productId: 'prod-011', sku: 'HH-001', name: 'Dish Soap 500ml', quantity: 5, reorderLevel: 25, severity: 'critical' },
  { productId: 'prod-002', sku: 'BEV-002', name: 'Orange Juice 1L', quantity: 18, reorderLevel: 30, severity: 'warning' },
  { productId: 'prod-005', sku: 'DAI-001', name: 'Whole Milk 2L', quantity: 44, reorderLevel: 60, severity: 'warning' },
  { productId: 'prod-008', sku: 'BAK-002', name: 'Croissant 6-Pack', quantity: 8, reorderLevel: 10, severity: 'warning' },
];

export const HOURLY_SALES = [
  { hour: '6 AM', revenue: 48.20, transactions: 4 },
  { hour: '7 AM', revenue: 127.80, transactions: 11 },
  { hour: '8 AM', revenue: 312.40, transactions: 27 },
  { hour: '9 AM', revenue: 289.60, transactions: 24 },
  { hour: '10 AM', revenue: 198.30, transactions: 17 },
  { hour: '11 AM', revenue: 156.70, transactions: 13 },
  { hour: '12 PM', revenue: 421.90, transactions: 36 },
  { hour: '1 PM', revenue: 387.50, transactions: 33 },
  { hour: '2 PM', revenue: 244.10, transactions: 21 },
  { hour: '3 PM', revenue: 178.60, transactions: 15 },
  { hour: '4 PM', revenue: 203.40, transactions: 18 },
  { hour: '5 PM', revenue: 368.20, transactions: 31 },
  { hour: '6 PM', revenue: 441.70, transactions: 38 },
  { hour: '7 AM+', revenue: 97.30, transactions: 8 },
];

export const TOP_PRODUCTS = [
  { name: 'Sparkling Water', revenue: 358.40, units: 241 },
  { name: 'Organic Bananas', revenue: 253.50, units: 150 },
  { name: 'Greek Yogurt', revenue: 234.98, units: 62 },
  { name: 'Sea Salt Chips', revenue: 236.55, units: 95 },
  { name: 'Sourdough Loaf', revenue: 98.78, units: 22 },
  { name: 'Frozen Pizza', revenue: 188.21, units: 29 },
  { name: 'Shampoo 400ml', revenue: 545.22, units: 78 },
  { name: 'Toothpaste', revenue: 323.68, units: 112 },
];