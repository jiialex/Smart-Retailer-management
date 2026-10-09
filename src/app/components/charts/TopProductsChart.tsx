'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TOP_PRODUCTS } from '@/data/mockData';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-md px-3 py-2">
      <p className="text-xs font-600 text-foreground">{label}</p>
      <p className="text-sm font-700 text-primary tabular-nums">${payload[0].value.toFixed(2)}</p>
    </div>
  );
}

const BAR_COLORS = [
  'var(--primary)', '#3B82F6', '#60A5FA', '#93C5FD',
  'var(--accent)', '#22C55E', '#4ADE80', '#86EFAC',
];

export default function TopProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={TOP_PRODUCTS} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
          {TOP_PRODUCTS.map((_, index) => (
            <Cell key={`cell-top-${index + 1}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}