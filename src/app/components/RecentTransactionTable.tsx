import React from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import { ArrowRight, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { TRANSACTIONS } from '@/data/mockData';
import type { PaymentMethod } from '@/types';

function PaymentIcon({ method }: { method: PaymentMethod }) {
  if (method === 'Cash') return <Banknote size={14} className="text-muted-foreground" />;
  if (method === 'Card') return <CreditCard size={14} className="text-muted-foreground" />;
  return <Smartphone size={14} className="text-muted-foreground" />;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${ampm}`;
}

export default function RecentTransactionsTable() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-base font-600 text-foreground">Recent Transactions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Last {TRANSACTIONS.length} transactions today</p>
        </div>
        <Link
          href="/reports"
          className="flex items-center gap-1.5 text-xs font-600 text-primary hover:opacity-75 transition-opacity"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-5 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Transaction #</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Time</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Cashier</th>
              <th className="text-center px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Items</th>
              <th className="text-right px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Total</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Payment</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TRANSACTIONS.map((txn) => (
              <tr key={txn.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-5 py-3.5">
                  <span className="font-500 text-foreground text-xs font-mono">{txn.transactionNumber}</span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs">{formatTime(txn.date)}</td>
                <td className="px-4 py-3.5 text-foreground text-sm font-500">{txn.cashier}</td>
                <td className="px-4 py-3.5 text-center text-foreground text-sm tabular-nums">{txn.items}</td>
                <td className="px-4 py-3.5 text-right font-600 tabular-nums text-foreground">${txn.total.toFixed(2)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <PaymentIcon method={txn.paymentMethod} />
                    <span className="text-xs text-muted-foreground">{txn.paymentMethod}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={txn.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}