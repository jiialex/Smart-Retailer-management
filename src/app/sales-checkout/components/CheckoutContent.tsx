'use client';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { PRODUCTS } from '@/data/mockData';
import type { CartItem, PaymentMethod, Product } from '@/types';
import ProductSearchPanel from './ProductSearchPanel';
import CartPanel from './CartPanel';
import ReceiptModal from './ReceiptModal';

export interface CompletedSale {
  transactionNumber: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashTendered?: number;
  change?: number;
  cashier: string;
  timestamp: string;
}

const TAX_RATE = 0.08;

export default function CheckoutContent({ cashierName = 'Marcus Okafor' }: { cashierName?: string }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [completedSale, setCompletedSale] = useState<CompletedSale | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const activeProducts = useMemo(
    () => PRODUCTS.filter((p) => p.status !== 'Discontinued' && p.status !== 'Out of Stock'),
    []
  );

  const subtotal = cart.reduce((sum, item) => sum + item.sellPrice * item.quantity, 0);
  const discountAmount = discountType === 'percent'
    ? subtotal * (discountValue / 100)
    : Math.min(discountValue, subtotal);
  const taxable = subtotal - discountAmount;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax;
  const change = paymentMethod === 'Cash' ? Math.max(0, cashTendered - total) : 0;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= existing.maxQuantity) {
          toast.warning(`Only ${existing.maxQuantity} units of ${product.name} available`);
          return prev;
        }
        return prev.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        sellPrice: product.sellPrice,
        quantity: 1,
        maxQuantity: product.quantity,
      }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setCart((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: Math.min(qty, i.maxQuantity) } : i));
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
    setCashTendered(0);
    setPaymentMethod('Card');
  };

  const processSale = async () => {
    if (cart.length === 0) {
      toast.error('Add at least one product to the cart before processing');
      return;
    }
    if (paymentMethod === 'Cash' && cashTendered < total) {
      toast.error(`Cash tendered ($${cashTendered.toFixed(2)}) is less than total ($${total.toFixed(2)})`);
      return;
    }
    setProcessing(true);
    // Backend: POST /api/transactions — submit sale, update inventory
    await new Promise((r) => setTimeout(r, 800));

    const sale: CompletedSale = {
      transactionNumber: `TXN-20261009-${String(Math.floor(42 + cart.length)).padStart(4, '0')}`,
      items: [...cart],
      subtotal,
      discountAmount,
      tax,
      total,
      paymentMethod,
      cashTendered: paymentMethod === 'Cash' ? cashTendered : undefined,
      change: paymentMethod === 'Cash' ? change : undefined,
      cashier: cashierName,
      timestamp: new Date().toISOString(),
    };

    setProcessing(false);
    setCompletedSale(sale);
    setReceiptOpen(true);
    toast.success(`Sale of $${total.toFixed(2)} processed successfully`);
    clearCart();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-600 text-foreground">Sales Checkout</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Cashier: {cashierName} · Register #1</p>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-3 gap-5 items-start">
        {/* Left: product search — 3/5 on lg, 2/3 on xl */}
        <div className="lg:col-span-3 xl:col-span-2 2xl:col-span-2">
          <ProductSearchPanel products={activeProducts} onAddToCart={addToCart} cart={cart} />
        </div>

        {/* Right: cart panel — 2/5 on lg, 1/3 on xl */}
        <div className="lg:col-span-2 xl:col-span-1 2xl:col-span-1">
          <CartPanel
            cart={cart}
            subtotal={subtotal}
            discountType={discountType}
            discountValue={discountValue}
            discountAmount={discountAmount}
            tax={tax}
            total={total}
            paymentMethod={paymentMethod}
            cashTendered={cashTendered}
            change={change}
            processing={processing}
            onUpdateQty={updateQty}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onDiscountTypeChange={setDiscountType}
            onDiscountValueChange={setDiscountValue}
            onPaymentMethodChange={setPaymentMethod}
            onCashTenderedChange={setCashTendered}
            onProcessSale={processSale}
          />
        </div>
      </div>

      {/* Receipt modal */}
      {completedSale && (
        <ReceiptModal
          open={receiptOpen}
          onClose={() => { setReceiptOpen(false); setCompletedSale(null); }}
          sale={completedSale}
        />
      )}
    </div>
  );
}