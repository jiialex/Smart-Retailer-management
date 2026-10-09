"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  ReceiptText,
  AlertTriangle,
} from "lucide-react";

const hourly = [
  { h: "8am", sales: 120 },
  { h: "10am", sales: 340 },
  { h: "12pm", sales: 610 },
  { h: "2pm", sales: 480 },
  { h: "4pm", sales: 720 },
  { h: "6pm", sales: 905 },
  { h: "8pm", sales: 300 },
];

const recent = [
  { id: "#1042", who: "Walk-in", items: 4, total: "$38.50" },
  { id: "#1041", who: "Hanna M.", items: 9, total: "$112.00" },
  { id: "#1040", who: "Walk-in", items: 1, total: "$9.75" },
  { id: "#1039", who: "Samuel K.", items: 6, total: "$64.20" },
];

const lowStock = [
  { name: "Whole Milk 1L", left: 2, level: "critical" },
  { name: "Cooking Oil 2L", left: 3, level: "critical" },
  { name: "Brown Bread", left: 6, level: "low" },
  { name: "Sugar 1kg", left: 7, level: "low" },
  { name: "Rice 5kg", left: 8, level: "low" },
];

function Trend({ value, up }: { value: string; up: boolean }) {
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <p className={`mt-3 flex items-center gap-1.5 text-sm ${up ? "text-green-600" : "text-red-600"}`}>
      <Icon size={15} /> {value} vs yesterday
    </p>
  );
}

export default function DashboardContent() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const longDate =
    now?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) ?? "";
  const shortDate =
    now?.toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? "";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-500">
            {longDate} · Store #001 — Downtown
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-600">
            Today: {shortDate}
          </span>
          <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-3xl bg-[#1c3660] p-7 text-white sm:col-span-2">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-300">
              Today&apos;s Revenue
            </p>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <DollarSign size={26} />
            </div>
          </div>
          <p className="mt-2 text-5xl font-bold tracking-tight">$3,475.60</p>
          <div className="mt-6 flex justify-between text-sm text-slate-200">
            <span>Target: $4,000</span>
            <span className="font-semibold">87%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/15">
            <div className="h-2 w-[87%] rounded-full bg-blue-500" />
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-green-400">
            <TrendingUp size={15} /> +12.4% vs yesterday
          </p>
        </div>

        {/* Gross profit */}
        <div className="flex flex-col justify-end rounded-3xl border bg-white p-6">
          <div className="mb-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <TrendingUp size={22} />
          </div>
          <p className="mt-10 text-sm font-medium uppercase tracking-wide text-slate-500">
            Gross Profit
          </p>
          <p className="mt-1 text-3xl font-semibold">$1,421.80</p>
          <Trend value="+8.7%" up />
        </div>

        {/* Units sold */}
        <div className="flex flex-col justify-end rounded-3xl border bg-white p-6">
          <div className="mb-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShoppingBag size={22} />
          </div>
          <p className="mt-10 text-sm font-medium uppercase tracking-wide text-slate-500">
            Units Sold
          </p>
          <p className="mt-1 text-3xl font-semibold">847</p>
          <Trend value="+5.2%" up />
        </div>

        {/* Avg transaction */}
        <div className="flex flex-col justify-end rounded-3xl border bg-white p-6">
          <div className="mb-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <ReceiptText size={22} />
          </div>
          <p className="mt-10 text-sm font-medium uppercase tracking-wide text-slate-500">
            Avg. Transaction
          </p>
          <p className="mt-1 text-3xl font-semibold">$14.22</p>
          <Trend value="-3.1%" up={false} />
        </div>

        {/* Stock alerts */}
        <div className="flex flex-col justify-end rounded-3xl border border-red-200 bg-red-50/60 p-6">
          <div className="mb-auto flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={22} />
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
              Alert
            </span>
          </div>
          <p className="mt-10 text-sm font-medium uppercase tracking-wide text-slate-500">
            Stock Alerts
          </p>
          <p className="mt-1 text-3xl font-semibold">5 SKUs</p>
          <p className="mt-3 text-sm text-red-600">2 critical · 3 low</p>
        </div>

        {/* Sales chart */}
        <div className="rounded-3xl border bg-white p-6 sm:col-span-2">
          <h2 className="mb-4 font-semibold">Sales today</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6">
          <h2 className="mb-3 font-semibold">Recent transactions</h2>
          <ul className="divide-y">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  <span className="font-medium">{r.id}</span> · {r.who}
                  <span className="ml-2 text-slate-400">{r.items} items</span>
                </span>
                <span className="font-semibold">{r.total}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <h2 className="mb-3 font-semibold">Low stock</h2>
          <ul className="divide-y">
            {lowStock.map((s) => (
              <li key={s.name} className="flex items-center justify-between py-3 text-sm">
                <span>{s.name}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    s.level === "critical"
                      ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {s.left} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
