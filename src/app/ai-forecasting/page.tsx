'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, AlertTriangle, ArrowUpRight, Check, PackagePlus } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { CATEGORIES, PRODUCTS } from '@/data/mockData';
import type { Product } from '@/types';

const DAILY_DEMAND: Record<string, number> = {
  'BEV-001': 32,
  'BEV-002': 6,
  'SNK-001': 12,
  'SNK-002': 4,
  'DAI-001': 12,
  'DAI-002': 9,
  'BAK-001': 4,
  'BAK-002': 5,
  'PC-001': 6,
  'PC-002': 10,
  'HH-001': 4,
  'HH-002': 5,
  'FRZ-001': 3,
  'PRD-001': 20,
  'BEV-003': 2,
};

const HORIZONS = [7, 14, 30] as const;
type Horizon = (typeof HORIZONS)[number];
type ForecastRow = Product & {
  dailyDemand: number;
  projectedDemand: number;
  coverDays: number;
  recommendedOrder: number;
};

const wholeNumber = new Intl.NumberFormat('en-US');

export default function AIForecastingPage() {
  const [horizon, setHorizon] = useState<Horizon>(7);
  const [categoryId, setCategoryId] = useState('all');
  const [riskOnly, setRiskOnly] = useState(false);
  const [orderPlan, setOrderPlan] = useState<Record<string, number>>({});

  const forecasts = useMemo(() => PRODUCTS
    .filter((product) => product.status !== 'Discontinued')
    .map((product): ForecastRow => {
      const dailyDemand = DAILY_DEMAND[product.sku] ?? 1;
      return {
        ...product,
        dailyDemand,
        projectedDemand: dailyDemand * horizon,
        coverDays: Math.floor(product.quantity / dailyDemand),
        recommendedOrder: Math.max(0, dailyDemand * (horizon + 7) - product.quantity),
      };
    }), [horizon]);

  const visibleForecasts = forecasts
    .filter((product) => categoryId === 'all' || product.categoryId === categoryId)
    .filter((product) => !riskOnly || product.coverDays <= horizon)
    .sort((a, b) => a.coverDays - b.coverDays);
  const atRiskCount = forecasts.filter((product) => product.coverDays <= horizon).length;
  const projectedUnits = forecasts.reduce((sum, product) => sum + product.projectedDemand, 0);
  const plannedUnits = Object.values(orderPlan).reduce((sum, quantity) => sum + quantity, 0);

  const chartData = Array.from({ length: horizon }, (_, index) => {
    const dailyUnits = forecasts.reduce((sum, product) => sum + product.dailyDemand, 0);
    const variation = 1 + Math.sin(index * 0.72) * 0.08;
    return {
      day: `Day ${index + 1}`,
      demand: Math.round(dailyUnits * variation),
    };
  });

  const addToPlan = (product: ForecastRow) => {
    if (product.recommendedOrder === 0) {
      toast.info(`${product.name} has enough projected stock`);
      return;
    }
    setOrderPlan((current) => ({ ...current, [product.sku]: product.recommendedOrder }));
    toast.success(`${product.name} added to the reorder plan`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Forecasting</h1>
            <p className="mt-1 text-sm text-slate-500">Projected demand and inventory risk by product</p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1" aria-label="Forecast horizon">
            {HORIZONS.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setHorizon(days)}
                aria-pressed={horizon === days}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  horizon === days ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-slate-800">
          <Activity size={17} className="shrink-0 text-primary" />
          <span>Demo forecast based on sample sales velocity. Review recommendations before ordering.</span>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Metric label={`Projected units · ${horizon} days`} value={wholeNumber.format(projectedUnits)} icon={<Activity size={18} />} />
          <Metric label="Products at stockout risk" value={atRiskCount.toString()} icon={<AlertTriangle size={18} />} warning />
          <Metric label="Units in reorder plan" value={wholeNumber.format(plannedUnits)} icon={<PackagePlus size={18} />} />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">Expected daily demand</h2>
                <p className="mt-1 text-xs text-slate-500">Store-wide projection for the selected horizon</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <ArrowUpRight size={13} /> Trend model
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e8edf4" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" interval={Math.max(0, Math.floor(horizon / 7) - 1)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`${value} units`, 'Expected demand']} />
                  <Area type="monotone" dataKey="demand" stroke="#16a34a" strokeWidth={2.5} fill="url(#forecastFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Reorder plan</h2>
                <p className="mt-1 text-xs text-slate-500">Suggested quantities include 7 days of safety stock</p>
              </div>
              <PackagePlus size={19} className="text-slate-400" />
            </div>
            {Object.keys(orderPlan).length ? (
              <div className="mt-5 space-y-3">
                {Object.entries(orderPlan).map(([sku, quantity]) => {
                  const product = PRODUCTS.find((item) => item.sku === sku);
                  if (!product) return null;
                  return (
                    <div key={sku} className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-400">{sku}</p>
                      </div>
                      <span className="shrink-0 font-semibold text-slate-700">{quantity} units</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm font-medium text-slate-700">No products added yet</p>
                <p className="mt-1 text-xs text-slate-500">Add a recommendation from the table below.</p>
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Product outlook</h2>
              <p className="mt-1 text-xs text-slate-500">Stock cover and recommended reorder quantity</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                aria-label="Filter forecast by category"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={riskOnly} onChange={(event) => setRiskOnly(event.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
                At risk only
              </label>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 text-right font-medium">On hand</th>
                  <th className="px-4 py-3 text-right font-medium">Forecast demand</th>
                  <th className="px-4 py-3 text-right font-medium">Stock cover</th>
                  <th className="px-4 py-3 font-medium">Risk</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleForecasts.map((product) => {
                  const atRisk = product.coverDays <= horizon;
                  const alreadyAdded = orderPlan[product.sku] !== undefined;
                  return (
                    <tr key={product.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{product.sku} · {product.categoryName}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">{product.quantity}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">{wholeNumber.format(product.projectedDemand)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">{product.coverDays} days</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${atRisk ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                          {atRisk ? 'At risk' : 'Covered'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => addToPlan(product)}
                          disabled={alreadyAdded || product.recommendedOrder === 0}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-primary/40 hover:text-primary disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          {alreadyAdded ? <Check size={14} /> : <PackagePlus size={14} />}
                          {alreadyAdded ? `Added · ${orderPlan[product.sku]}` : product.recommendedOrder === 0 ? 'No order' : 'Add to plan'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!visibleForecasts.length && <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No products match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function Metric({ label, value, icon, warning = false }: { label: string; value: string; icon: React.ReactNode; warning?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${warning ? 'bg-orange-50 text-orange-700' : 'bg-primary/5 text-primary'}`}>{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}
