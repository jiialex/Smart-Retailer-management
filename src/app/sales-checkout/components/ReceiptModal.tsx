'use client';
import React from 'react';
import Modal from '@/components/ui/Modal';
import { CheckCircle, Printer, CreditCard, Banknote, Smartphone } from 'lucide-react';
import type { CompletedSale } from './CheckoutContent';

interface Props {
  open: boolean;
  onClose: () => void;
  sale: CompletedSale;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${date} · ${h % 12 || 12}:${m} ${ampm}`;
}

const PM_ICONS = { Card: CreditCard, Cash: Banknote, 'Mobile Pay': Smartphone };

export default function ReceiptModal({ open, onClose, sale }: Props) {
  const PMIcon = PM_ICONS[sale.paymentMethod];

  return (
    <Modal open={open} onClose={onClose} title="Transaction Receipt" size="sm">
      <div className="receipt-slide">
        {/* Success header */}
        <div className="flex flex-col items-center py-6 px-6 bg-green-50 border-b border-green-100">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
            <CheckCircle size={24} className="text-white" />
          </div>
          <p className="text-base font-700 text-accent">Sale Complete</p>
          <p className="text-xs text-muted-foreground mt-1">{formatDateTime(sale.timestamp)}</p>
        </div>

        {/* Transaction details */}
        <div className="px-6 py-4 border-b border-border space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Transaction #</span>
            <span className="font-mono font-600 text-foreground text-[11px]">{sale.transactionNumber}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cashier</span>
            <span className="font-500 text-foreground">{sale.cashier}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Payment</span>
            <span className="flex items-center gap-1 font-500 text-foreground">
              <PMIcon size={12} /> {sale.paymentMethod}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-[11px] font-600 uppercase tracking-wide text-muted-foreground mb-3">Items</p>
          <div className="space-y-2">
            {sale.items.map((item) => (
              <div key={`receipt-item-${item.productId}`} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.quantity} × ${item.sellPrice.toFixed(2)}</p>
                </div>
                <span className="text-sm font-600 tabular-nums text-foreground flex-shrink-0">
                  ${(item.sellPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-b border-border space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">${sale.subtotal.toFixed(2)}</span>
          </div>
          {sale.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-accent">Discount</span>
              <span className="text-accent tabular-nums font-500">-${sale.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span className="tabular-nums">${sale.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-700 pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary tabular-nums">${sale.total.toFixed(2)}</span>
          </div>
          {sale.paymentMethod === 'Cash' && sale.cashTendered !== undefined && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cash Tendered</span>
                <span className="tabular-nums">${sale.cashTendered.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-700 text-accent">
                <span>Change Due</span>
                <span className="tabular-nums">${(sale.change ?? 0).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm font-600 text-muted-foreground hover:bg-muted transition-colors"
          >
            <Printer size={15} /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-primary text-white text-sm font-600 rounded-lg hover:brightness-90 transition-colors active:scale-95"
          >
            New Sale
          </button>
        </div>
      </div>
    </Modal>
  );
}