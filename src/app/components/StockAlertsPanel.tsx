import React from 'react';
import Link from 'next/link';
import { AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { STOCK_ALERTS } from '@/data/mockData';

export default function StockAlertsPanel() {
  const critical = STOCK_ALERTS?.filter((a) => a?.severity === 'critical');
  const warnings = STOCK_ALERTS?.filter((a) => a?.severity === 'warning');

  return (
    <div className="bg-card rounded-xl border border-border shadow-card h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-base font-600 text-foreground">Stock Alerts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{STOCK_ALERTS?.length} SKUs need attention</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-600 bg-red-50 text-danger border border-red-200 rounded-full px-2 py-0.5">{critical?.length} critical</span>
          <span className="text-[11px] font-600 bg-amber-50 text-warning border border-amber-200 rounded-full px-2 py-0.5">{warnings?.length} low</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {STOCK_ALERTS?.map((alert) => {
          const pct = Math.round((alert?.quantity / alert?.reorderLevel) * 100);
          return (
            <div
              key={`alert-${alert?.productId}`}
              className={`px-5 py-3.5 hover:bg-muted/40 transition-colors ${alert?.severity === 'critical' ? 'critical-stock-row' : 'low-stock-row'}`}
            >
              <div className="flex items-start gap-3">
                {alert?.severity === 'critical'
                  ? <AlertCircle size={16} className="text-danger mt-0.5 flex-shrink-0" />
                  : <AlertTriangle size={16} className="text-warning mt-0.5 flex-shrink-0" />
                }
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-500 text-foreground truncate">{alert?.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{alert?.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-600 ${alert?.severity === 'critical' ? 'text-danger' : 'text-warning'}`}>
                      {alert?.quantity === 0 ? 'Out of stock' : `${alert?.quantity} left`}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Reorder at {alert?.reorderLevel}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${alert?.severity === 'critical' ? 'bg-danger' : 'bg-warning'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-border">
        <Link
          href="/inventory-management"
          className="flex items-center gap-1.5 text-xs font-600 text-primary hover:text-blue-700 transition-colors"
        >
          View all inventory <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}