import React from 'react';
import KpiBentoGrid from './KpiBentoGrid';
import SalesChartSection from './SalesChartSection';
import StockAlertsPanel from './StockAlertsPanel';

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-600 text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Friday, October 9, 2026 · Store #001 — Downtown</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg font-500">Today: Oct 9</span>
          <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-600 hover:bg-blue-700 transition-colors active:scale-95">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <KpiBentoGrid />

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 2xl:col-span-2 space-y-6">
          <SalesChartSection />
        </div>
        <div className="xl:col-span-1 2xl:col-span-1">
          <StockAlertsPanel />
        </div>
      </div>
    </div>
  );
}