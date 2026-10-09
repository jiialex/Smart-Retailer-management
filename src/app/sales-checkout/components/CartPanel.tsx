'use client';
import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart, Loader2, CreditCard, Banknote, Smartphone, X } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import type { CartItem, PaymentMethod } from '@/types';
import Icon from '@/components/ui/AppIcon';


interface Props {
  cart: CartItem[];
  subtotal: number;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  discountAmount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashTendered: number;
  change: number;
  processing: boolean;
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onDiscountTypeChange: (t: 'percent' | 'fixed') => void;
  onDiscountValueChange: (v: number) => void;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  onCashTenderedChange: (v: number) => void;
  onProcessSale: () => void;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: 'Card', label: 'Card', icon: CreditCard },
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'Mobile Pay', label: 'Mobile', icon: Smartphone },
];

export default function CartPanel({
  cart, subtotal, discountType, discountValue, discountAmount, tax, total,
  paymentMethod, cashTendered, change, processing,
  onUpdateQty, onRemoveItem, onClearCart,
  onDiscountTypeChange, onDiscountValueChange,
  onPaymentMethodChange, onCashTenderedChange, onProcessSale,
}: Props) {
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="bg-card rounded-xl border border-border shadow-card flex flex-col max-h-[calc(100vh-200px)] sticky top-6">
      {/* Cart header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-primary" />
          <h2 className="text-base font-600 text-foreground">Cart</h2>
          {itemCount > 0 && (
            <span className="text-xs font-700 bg-primary text-white rounded-full px-2 py-0.5 tabular-nums">{itemCount}</span>
          )}
        </div>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-muted-foreground hover:text-danger transition-colors flex items-center gap-1"
            aria-label="Clear cart"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {cart.length === 0 ? (
          <EmptyState type="cart" />
        ) : (
          cart.map((item) => (
            <div key={`cart-item-${item.productId}`} className="px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-500 text-foreground leading-snug truncate">{item.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{item.sku}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">${item.sellPrice.toFixed(2)} each</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="p-1 rounded text-muted-foreground hover:text-danger hover:bg-red-50 transition-colors flex-shrink-0 mt-0.5"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2.5">
                {/* Quantity control */}
                <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-600 text-foreground tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxQuantity}
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                {/* Line total */}
                <span className="text-sm font-700 tabular-nums text-foreground">
                  ${(item.sellPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Discount + totals + payment */}
      {cart.length > 0 && (
        <div className="border-t border-border flex-shrink-0">
          {/* Discount section */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-600 text-muted-foreground mb-2 uppercase tracking-wide">Discount</p>
            <div className="flex items-center gap-2">
              {/* Toggle type */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => { onDiscountTypeChange('percent'); onDiscountValueChange(0); }}
                  className={`px-2.5 py-1.5 text-xs font-600 transition-colors ${discountType === 'percent' ? 'bg-primary text-white' : 'bg-card text-muted-foreground hover:bg-muted'}`}
                >
                  %
                </button>
                <button
                  onClick={() => { onDiscountTypeChange('fixed'); onDiscountValueChange(0); }}
                  className={`px-2.5 py-1.5 text-xs font-600 transition-colors ${discountType === 'fixed' ? 'bg-primary text-white' : 'bg-card text-muted-foreground hover:bg-muted'}`}
                >
                  $
                </button>
              </div>
              <input
                type="number"
                min="0"
                max={discountType === 'percent' ? 100 : subtotal}
                step={discountType === 'percent' ? 1 : 0.01}
                value={discountValue || ''}
                onChange={(e) => onDiscountValueChange(Number(e.target.value))}
                placeholder={discountType === 'percent' ? '0%' : '0.00'}
                className="flex-1 text-sm text-foreground bg-muted border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                aria-label="Discount value"
              />
              {discountAmount > 0 && (
                <span className="text-xs font-600 text-accent tabular-nums whitespace-nowrap">-${discountAmount.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="px-4 py-3 space-y-2 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-500 tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-accent">Discount {discountType === 'percent' ? `(${discountValue}%)` : ''}</span>
                <span className="font-500 text-accent tabular-nums">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="font-500 tabular-nums">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-700 pt-1.5 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-600 text-muted-foreground mb-2 uppercase tracking-wide">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={`pm-${id}`}
                  onClick={() => onPaymentMethodChange(id)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-xs font-600 transition-all duration-150
                    ${paymentMethod === id
                      ? 'border-primary bg-primary/5 text-primary' :'border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50'
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Cash tendered */}
            {paymentMethod === 'Cash' && (
              <div className="mt-3 space-y-2">
                <div>
                  <label className="text-xs font-600 text-foreground block mb-1" htmlFor="cash-tendered">Cash Tendered</label>
                  <input
                    id="cash-tendered"
                    type="number"
                    min={total}
                    step="0.01"
                    value={cashTendered || ''}
                    onChange={(e) => onCashTenderedChange(Number(e.target.value))}
                    placeholder={`Min: $${total.toFixed(2)}`}
                    className="w-full text-sm text-foreground bg-muted border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                  />
                </div>
                {cashTendered >= total && (
                  <div className="flex justify-between text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="font-600 text-accent">Change Due</span>
                    <span className="font-700 text-accent tabular-nums">${change.toFixed(2)}</span>
                  </div>
                )}
                {cashTendered > 0 && cashTendered < total && (
                  <p className="text-xs text-danger">Short by ${(total - cashTendered).toFixed(2)}</p>
                )}
                {/* Quick cash buttons */}
                <div className="flex gap-2 flex-wrap">
                  {[Math.ceil(total), Math.ceil(total / 5) * 5 + 5, 50, 100].filter((v, i, a) => a.indexOf(v) === i && v >= total).slice(0, 4).map((v) => (
                    <button
                      key={`cash-quick-${v}`}
                      onClick={() => onCashTenderedChange(v)}
                      className="text-xs font-600 px-2.5 py-1 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors tabular-nums"
                    >
                      ${v}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Process button */}
          <div className="px-4 py-4">
            <button
              onClick={onProcessSale}
              disabled={processing || (paymentMethod === 'Cash' && cashTendered < total)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-sm font-700 rounded-xl hover:bg-blue-700 transition-all duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-card-md"
            >
              {processing ? (
                <><Loader2 size={16} className="animate-spin" /> Processing…</>
              ) : (
                <>Process Sale · ${total.toFixed(2)}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}