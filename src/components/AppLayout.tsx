"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
  Factory,
  ChevronLeft,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  Store,
} from "lucide-react";

const groups = [
  {
    label: "Operations",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/inventory-management", label: "Inventory", icon: Package, badge: 5 },
      { href: "/sales-checkout", label: "Sales Checkout", icon: ShoppingCart },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/ai-forecasting", label: "AI Forecasting", icon: BrainCircuit },
      { href: "/authenticity", label: "Authenticity", icon: ShieldCheck },
    ],
  },
  {
    label: "Administration",
    items: [{ href: "/manufacturer", label: "Manufacturer", icon: Factory }],
  },
];

type AppLayoutProps = {
  children: React.ReactNode;
  title?: string;
  currentPath?: string;
};

export default function AppLayout({ children, currentPath }: AppLayoutProps) {
  const pathname = usePathname();
  const current = currentPath && currentPath !== "/" ? currentPath : pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col bg-[#1c3660] text-slate-200 transition-all duration-200 lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-72"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-24 items-center gap-3 px-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-[#1c3660]">
            <Store size={24} />
          </div>
          <span className={`text-xl font-bold text-white ${collapsed ? "lg:hidden" : ""}`}>
            SmartRetail
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {groups.map((g) => (
            <div key={g.label} className="mb-5">
              <p
                className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                {g.label}
              </p>
              <div className="space-y-1">
                {g.items.map(({ href, label, icon: Icon, badge }) => {
                  const active = current === href || current.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      title={label}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      } ${collapsed ? "lg:justify-center" : ""}`}
                    >
                      <Icon size={20} className="shrink-0" />
                      <span className={`flex-1 ${collapsed ? "lg:hidden" : ""}`}>{label}</span>
                      {badge && (
                        <span
                          className={`rounded-full bg-orange-600 px-2 py-0.5 text-xs font-semibold text-white ${
                            collapsed ? "lg:hidden" : ""
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`hidden w-full items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-slate-300 hover:bg-white/10 lg:flex ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <ChevronLeft size={20} className={collapsed ? "rotate-180" : ""} />
            <span className={collapsed ? "hidden" : ""}>Collapse</span>
          </button>
          <button
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-slate-300 hover:bg-white/10 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            <span className={collapsed ? "lg:hidden" : ""}>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className={`transition-all duration-200 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b bg-white px-4 lg:px-8">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex h-12 w-full max-w-xl items-center gap-3 rounded-xl bg-slate-100 px-4 text-slate-500">
            <Search size={18} />
            <input
              placeholder="Search products, SKUs, transactions..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500 focus:ring-0 border-0"
            />
            <kbd className="hidden rounded-md bg-white px-2 py-0.5 text-xs text-slate-500 sm:block">
              ⌘K
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-5">
            <div className="hidden items-center gap-2 text-sm text-slate-600 md:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Live · Updated just now
            </div>
            <button className="relative text-slate-600" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                MO
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold">Marcus Okafor</p>
                <p className="text-xs text-slate-500">Store Manager</p>
              </div>
              <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

