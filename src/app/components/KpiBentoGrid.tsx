import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  ReceiptText,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface KpiCardData {
  id: string;
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  isHero?: boolean;
  subValue?: string;
  alertState?: boolean;
  progressValue?: number;
  progressMax?: number;
}

const KPI_DATA: KpiCardData[] = [
  {
    id: 'kpi-revenue',
    label: "Today's Revenue",
    value: '$3,475.60',
    change: '+12.4% vs yesterday',
    changePositive: true,
    icon: DollarSign,
    iconBg: 'bg-blue-50',
    iconColor: 'text-primary',
    isHero: true,
    subValue: 'Target: $4,000',
    progressValue: 3475.60,
    progressMax: 4000,
  },
  {
    id: 'kpi-profit',
    label: 'Gross Profit',
    value: '$1,421.80',
    change: '+8.7% vs yesterday',
    changePositive: true,
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-accent',
  },
  {
    id: 'kpi-units',
    label: 'Units Sold',
    value: '847',
    change: '+5.2% vs yesterday',
    changePositive: true,
    icon: ShoppingBag,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'kpi-avg-txn',
    label: 'Avg. Transaction',
    value: '$14.22',
    change: '-3.1% vs yesterday',
    changePositive: false,
    icon: ReceiptText,
    iconBg: 'bg-orange-50',
    iconColor: 'text-warning',
  },
  {
    id: 'kpi-alerts',
    label: 'Stock Alerts',
    value: '5 SKUs',
    change: '2 critical · 3 low',
    changePositive: false,
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-danger',
    alertState: true,
  },
];

function HeroCard({ data }: { data: KpiCardData }) {
  const CardIcon = data.icon;
  const pct = data.progressValue && data.progressMax
    ? Math.min(100, Math.round((data.progressValue / data.progressMax) * 100))
    : 0;

  return (
    <div className="col-span-1 md:col-span-2 bg-navy rounded-xl p-6 flex flex-col justify-between min-h-[148px] card-hover shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-500 tracking-wide uppercase text-white/60 mb-1">{data.label}</p>
          <p className="text-hero-metric text-white">{data.value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center`}>
          <CardIcon size={20} className="text-white" />
        </div>
      </div>
      <div className="mt-4">
        {data.progressValue !== undefined && data.progressMax !== undefined && (
          <>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/60">{data.subValue}</span>
              <span className="text-xs font-600 text-white">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <TrendingUp size={13} className="text-green-400" />
          <span className="text-xs text-green-400 font-500">{data.change}</span>
        </div>
      </div>
    </div>
  );
}

function RegularCard({ data }: { data: KpiCardData }) {
  const CardIcon = data.icon;
  return (
    <div className={`bg-card rounded-xl p-5 flex flex-col justify-between min-h-[148px] card-hover shadow-card border ${data.alertState ? 'border-red-200 bg-red-50/30' : 'border-border'}`}>
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg ${data.iconBg} flex items-center justify-center`}>
          <CardIcon size={18} className={data.iconColor} />
        </div>
        {data.alertState && (
          <span className="text-[10px] font-600 bg-red-100 text-danger rounded-full px-2 py-0.5">Alert</span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[11px] font-500 tracking-wide uppercase text-muted-foreground mb-1">{data.label}</p>
        <p className="text-2xl font-700 tabular-nums text-foreground">{data.value}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {data.changePositive
            ? <TrendingUp size={12} className="text-accent" />
            : <TrendingDown size={12} className={data.alertState ? 'text-danger' : 'text-warning'} />
          }
          <span className={`text-[11px] font-500 ${data.changePositive ? 'text-accent' : data.alertState ? 'text-danger' : 'text-warning'}`}>
            {data.change}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function KpiBentoGrid() {
  const [hero, ...rest] = KPI_DATA;
  return (
    // 4-col grid: hero spans 2, then 3 regular cards — row 1: hero+2, row 2: 2+1 span
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      <HeroCard data={hero} />
      {rest.map((d) => (
        <RegularCard key={d.id} data={d} />
      ))}
    </div>
  );
}