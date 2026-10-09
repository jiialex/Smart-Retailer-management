'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

const HourlySalesChart = dynamic(() => import('./charts/HourlySalesChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-60 w-full" />,
});

const TopProductsChart = dynamic(() => import('./charts/TopProductsChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-56 w-full" />,
});

export default function SalesChartSection() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-600 text-foreground">Hourly Sales Today</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Revenue by hour · Oct 9, 2026</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />Revenue</span>
          </div>
        </div>
        <HourlySalesChart />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-600 text-foreground">Top Products by Revenue</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Today's top 8 sellers</p>
          </div>
        </div>
        <TopProductsChart />
      </div>
    </div>
  );
}