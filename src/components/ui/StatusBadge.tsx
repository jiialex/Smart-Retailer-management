import React from 'react';
import type { ProductStatus, TransactionStatus } from '@/types';

type BadgeStatus = ProductStatus | TransactionStatus | 'warning' | 'critical' | 'info';

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-green-50 text-green-700 border border-green-200',
  'Low Stock': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Out of Stock': 'bg-red-50 text-red-700 border border-red-200',
  Discontinued: 'bg-slate-100 text-slate-500 border border-slate-200',
  Completed: 'bg-green-50 text-green-700 border border-green-200',
  Pending: 'bg-blue-50 text-blue-700 border border-blue-200',
  Refunded: 'bg-orange-50 text-orange-700 border border-orange-200',
  Voided: 'bg-slate-100 text-slate-500 border border-slate-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  critical: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
};

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border border-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full font-500 ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${styles}`}
    >
      {status}
    </span>
  );
}