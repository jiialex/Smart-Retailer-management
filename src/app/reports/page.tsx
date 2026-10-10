'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowDownToLine, CalendarDays, ReceiptText, RotateCcw, TrendingUp } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { HOURLY_SALES, TOP_PRODUCTS, TRANSACTIONS } from '@/data/mockData';
import type { PaymentMethod, Transaction } from '@/types';

const RANGE_OPTIONS = [1, 7, 30] as const;
type RangeDays = (typeof RANGE_OPTIONS)[number];

const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const latestTransactionTime = Math.max(...TRANSACTIONS.map((transaction) => Date.parse(transaction.date)));
const latestTransactionDate = new Date(latestTransactionTime);

function exportTransactions(transactions: Transaction[]) {
  const columns: (keyof Transaction)[] = [
    'transactionNumber',
    'date',
    'cashier',
    'items',
    'subtotal',
    'tax',
    'discount',
    'total',
    'paymentMethod',
    'status',
  ];
  const lines = [
    columns.join(','),
    ...transactions.map((transaction) =>
      columns.map((column) => `"${String(transaction[column]).replaceAll('"', '""')}"`).join(','),
    ),
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'smartretail-transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [rangeDays, setRangeDays] = useState<RangeDays>(7);
  const [transactionSearch, setTransactionSearch] = useState('');

  useEffect(() => {
    const initialSearch = new URLSearchParams(window.location.search).get('search');
    if (initialSearch) setTransactionSearch(initialSearch);
  }, []);

  const filteredTransactions = useMemo(() => {
    const start = new Date(latestTransactionDate);
    start.setDate(start.getDate() - (rangeDays - 1));
    start.setHours(0, 0, 0, 0);
    const normalizedSearch = transactionSearch.trim().toLowerCase();
    return TRANSACTIONS.filter((transaction) => {
      const inRange = Date.parse(transaction.date) >= start.getTime();
      const matchesSearch = !normalizedSearch || transaction.transactionNumber.toLowerCase().includes(normalizedSearch);
      return inRange && matchesSearch;
    });
  }, [rangeDays, transactionSearch]);

  const completedTransactions = filteredTransactions.filter((transaction) => transaction.status === 'Completed');
  const grossSales = completedTransactions.reduce((total, transaction) => total + transaction.total, 0);
  const completedItems = completedTransactions.reduce((total, transaction) => total + transaction.items, 0);
  const averageSale = completedTransactions.length ? grossSales / completedTransactions.length : 0;
  const paymentMethods: PaymentMethod[] = ['Card', 'Cash', 'Mobile Pay'];
  const paymentBreakdown = paymentMethods.map((method) => ({
    method,
    count: completedTransactions.filter((transaction) => transaction.paymentMethod === method).length,
  }));
  const dateLabel = latestTransactionDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="mt-1 text-sm text-slate-500">Sales performance and transaction activity</p>
          </div>
          <button
            onClick={() => exportTransactions(filteredTransactions)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-90"
          >
            <ArrowDownToLine size={16} />
            Export CSV
          </button>
        </div>

        <section className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1" aria-label="Report date range">
            {RANGE_OPTIONS.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                aria-pressed={rangeDays === days}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  rangeDays === days ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {days === 1 ? 'Latest day' : `Last ${days} days`}
              </button>
            ))}
          </div>
          <p className="inline-flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={14} /> Sample data through {dateLabel}
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Sales summary">
          <Metric label="Gross sales" value={money(grossSales)} icon={<TrendingUp size={18} />} tone="blue" />
          <Metric label="Completed sales" value={completedTransactions.length.toString()} icon={<ReceiptText size={18} />} tone="green" />
          <Metric label="Items sold" value={completedItems.toString()} icon={<CalendarDays size={18} />} tone="orange" />
          <Metric label="Refunds" value={filteredTransactions.filter((transaction) => transaction.status === 'Refunded').length.toString()} icon={<RotateCcw size={18} />} tone="red" />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Hourly revenue</h2>
                <p className="mt-1 text-xs text-slate-500">Trading-day sales pattern</p>
              </div>
              <span className="rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary">{money(grossSales)} total</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_SALES}>
                  <defs>
                    <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#232F3E" stopOpacity={0.14} />
                      <stop offset="95%" stopColor="#232F3E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e8edf4" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => money(Number(value))} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#232F3E" strokeWidth={2.5} fill="url(#reportRevenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Payment mix</h2>
            <p className="mt-1 text-xs text-slate-500">Completed transactions</p>
            <div className="mt-5 space-y-5">
              {paymentBreakdown.map(({ method, count }) => {
                const share = completedTransactions.length ? Math.round((count / completedTransactions.length) * 100) : 0;
                return (
                  <div key={method}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{method}</span>
                      <span className="font-medium text-slate-900">{count} <span className="font-normal text-slate-400">({share}%)</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-7 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">Average transaction</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{money(averageSale)}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Top products</h2>
              <p className="mt-1 text-xs text-slate-500">Ranked by reported revenue</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr><th className="px-5 py-3 font-medium">Product</th><th className="px-4 py-3 text-right font-medium">Units</th><th className="px-5 py-3 text-right font-medium">Revenue</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...TOP_PRODUCTS].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((product) => (
                    <tr key={product.name}>
                      <td className="px-5 py-3 font-medium text-slate-800">{product.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-500">{product.units}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-800">{money(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Recent transactions</h2>
              <p className="mt-1 text-xs text-slate-500">{filteredTransactions.length} records in selected range</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr><th className="px-5 py-3 font-medium">Transaction</th><th className="px-4 py-3 font-medium">Payment</th><th className="px-5 py-3 text-right font-medium">Total</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{transaction.transactionNumber}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{transaction.cashier}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{transaction.paymentMethod}</td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-800">{money(transaction.total)}</td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-slate-500">No transactions in this period.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function Metric({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: 'blue' | 'green' | 'orange' | 'red' }) {
  const tones = {
    blue: 'bg-primary/5 text-primary',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}
