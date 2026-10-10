"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ReceiptText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, STOCK_ALERTS, TRANSACTIONS } from "@/data/mockData";
import { clearSession, getCurrentSession, type AuthSession } from "@/lib/auth";
import AIAssistant from "@/components/AIAssistant";

const notificationItems = [
  ...STOCK_ALERTS.slice(0, 3).map((alert) => ({
    id: alert.productId,
    title: alert.quantity === 0 ? `${alert.name} is out of stock` : `${alert.name} is below reorder level`,
    detail: `${alert.quantity} units on hand · ${alert.sku}`,
    href: `/inventory-management?search=${encodeURIComponent(alert.sku)}`,
    tone: alert.severity === "critical" ? "bg-red-500" : "bg-amber-500",
  })),
  ...TRANSACTIONS.filter((transaction) => transaction.status === "Refunded").slice(0, 1).map((transaction) => ({
    id: transaction.id,
    title: `Transaction ${transaction.transactionNumber} refunded`,
    detail: `${transaction.cashier} · ${transaction.paymentMethod}`,
    href: `/reports?search=${encodeURIComponent(transaction.transactionNumber)}`,
    tone: "bg-primary",
  })),
];

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
  navigationMode?: "full" | "operations";
  compact?: boolean;
};

export default function AppLayout({ children, currentPath, navigationMode = "full", compact = false }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const current = currentPath && currentPath !== "/" ? currentPath : pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const visibleGroups = navigationMode === "operations" ? groups.slice(0, 1) : groups;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchingProducts = normalizedQuery
    ? PRODUCTS.filter((product) => `${product.name} ${product.sku} ${product.categoryName}`.toLowerCase().includes(normalizedQuery)).slice(0, 4)
    : [];
  const matchingTransactions = normalizedQuery
    ? TRANSACTIONS.filter((transaction) => `${transaction.transactionNumber} ${transaction.cashier} ${transaction.paymentMethod}`.toLowerCase().includes(normalizedQuery)).slice(0, 3)
    : [];

  useEffect(() => {
    const currentSession = getCurrentSession();
    setSession(currentSession);
    setAuthReady(true);
    if (!currentSession) router.replace('/login');
    else if (currentSession.role !== 'Store Manager') router.replace('/recorder');
  }, [router]);

  const goToSearchResult = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (matchingProducts[0]) {
      goToSearchResult(`/inventory-management?search=${encodeURIComponent(matchingProducts[0].sku)}`);
    } else if (matchingTransactions[0]) {
      goToSearchResult(`/reports?search=${encodeURIComponent(matchingTransactions[0].transactionNumber)}`);
    } else if (normalizedQuery) {
      toast.info("No matching products or transactions found.");
    }
  };

  const signOut = () => {
    clearSession();
    setSession(null);
    setProfileOpen(false);
    toast.success('You have signed out.');
    router.replace('/login');
  };

  if (!authReady || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50" aria-busy="true">
        <p className="text-sm text-slate-500">Checking your session…</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex ${compact ? "w-64" : "w-72"} transform flex-col bg-[#232F3E] text-slate-200 transition-all duration-200 lg:translate-x-0 ${
          collapsed ? "lg:w-20" : compact ? "lg:w-64" : "lg:w-72"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className={`flex items-center gap-3 ${compact ? "h-20 px-5" : "h-24 px-6"}`}>
          <div className={`flex shrink-0 items-center justify-center rounded-lg bg-white text-[#232F3E] ${compact ? "h-10 w-10" : "h-12 w-12"}`}>
            <Store size={compact ? 20 : 24} />
          </div>
          <span className={`${compact ? "text-lg" : "text-xl"} font-bold text-white ${collapsed ? "lg:hidden" : ""}`}>
            SmartRetail
          </span>
        </div>

        <nav className={`flex-1 overflow-y-auto ${compact ? "px-2 pb-3" : "px-3 pb-4"}`}>
          {visibleGroups.map((g) => (
            <div key={g.label} className={compact ? "mb-4" : "mb-5"}>
              <p
                className={`${compact ? "mb-1 px-2 text-[11px]" : "mb-2 px-3 text-xs"} font-semibold uppercase tracking-wider text-slate-400 ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                {g.label}
              </p>
              <div className={compact ? "space-y-0.5" : "space-y-1"}>
                {g.items.map(({ href, label, icon: Icon, badge }) => {
                  const active = current === href || current.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      title={label}
                      className={`flex items-center font-medium transition-colors ${compact ? "gap-2.5 rounded-lg px-2.5 py-2.5 text-sm" : "gap-3 rounded-xl px-3 py-3 text-[15px]"} ${
                        active
                          ? "bg-white/10 text-white ring-1 ring-inset ring-white/10"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      } ${collapsed ? "lg:justify-center" : ""}`}
                    >
                      <Icon size={compact ? 18 : 20} className="shrink-0" />
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

        <div className={`space-y-1 border-t border-white/10 ${compact ? "p-2" : "p-3"}`}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`hidden w-full items-center text-slate-300 hover:bg-white/10 lg:flex ${compact ? "gap-2.5 rounded-lg px-2.5 py-2.5 text-sm" : "gap-3 rounded-xl px-3 py-3 text-[15px]"} ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <ChevronLeft size={compact ? 18 : 20} className={collapsed ? "rotate-180" : ""} />
            <span className={collapsed ? "hidden" : ""}>Collapse</span>
          </button>
          <button
            onClick={signOut}
            className={`flex w-full items-center text-slate-300 hover:bg-white/10 ${compact ? "gap-2.5 rounded-lg px-2.5 py-2.5 text-sm" : "gap-3 rounded-xl px-3 py-3 text-[15px]"} ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <LogOut size={compact ? 18 : 20} />
            <span className={collapsed ? "lg:hidden" : ""}>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className={`transition-all duration-200 ${collapsed ? "lg:pl-20" : compact ? "lg:pl-64" : "lg:pl-72"}`}>
        <header className={`sticky top-0 z-20 flex items-center border-b bg-white px-4 ${compact ? "h-16 gap-3 lg:px-6" : "h-20 gap-4 lg:px-8"}`}>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={compact ? 20 : 22} />
          </button>

          <div className="relative w-full max-w-xl">
            <form onSubmit={submitSearch} className={`flex items-center rounded-xl bg-slate-100 text-slate-500 ${compact ? "h-10 gap-2.5 px-3 text-xs" : "h-12 gap-3 px-4 text-sm"}`}>
              <Search size={compact ? 16 : 18} />
              <input
                value={searchQuery}
                onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }}
                aria-label="Search products and transactions"
                aria-expanded={searchOpen && !!normalizedQuery}
                autoComplete="off"
                placeholder="Search products, SKUs, transactions..."
                className={`w-full border-0 bg-transparent outline-none placeholder:text-slate-500 focus:ring-0 ${compact ? "text-xs" : "text-sm"}`}
              />
              <kbd className={`hidden rounded-md bg-white px-2 py-0.5 text-slate-500 sm:block ${compact ? "text-[10px]" : "text-xs"}`}>
                ⌘K
              </kbd>
            </form>
            {searchOpen && normalizedQuery && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                {matchingProducts.map((product) => (
                  <button key={product.id} type="button" onClick={() => goToSearchResult(`/inventory-management?search=${encodeURIComponent(product.sku)}`)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50">
                    <Package size={17} className="shrink-0 text-slate-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">{product.name}</span>
                      <span className="block text-xs text-slate-500">{product.sku} · {product.categoryName}</span>
                    </span>
                    <span className="text-xs text-slate-400">Inventory</span>
                  </button>
                ))}
                {matchingTransactions.map((transaction) => (
                  <button key={transaction.id} type="button" onClick={() => goToSearchResult(`/reports?search=${encodeURIComponent(transaction.transactionNumber)}`)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50">
                    <ReceiptText size={17} className="shrink-0 text-slate-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">{transaction.transactionNumber}</span>
                      <span className="block text-xs text-slate-500">{transaction.cashier} · {transaction.paymentMethod}</span>
                    </span>
                    <span className="text-xs text-slate-400">Reports</span>
                  </button>
                ))}
                {!matchingProducts.length && !matchingTransactions.length && (
                  <p className="px-4 py-3 text-sm text-slate-500">No matching products or transactions.</p>
                )}
              </div>
            )}
          </div>

          <div className={`ml-auto flex items-center ${compact ? "gap-3" : "gap-5"}`}>
            <div className={`hidden items-center gap-2 text-slate-600 md:flex ${compact ? "text-xs" : "text-sm"}`}>
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Live · Updated just now
            </div>
            <div className="relative">
            <button
              onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); setHasUnreadNotifications(false); }}
              className="relative text-slate-600"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell size={compact ? 18 : 20} />
              {hasUnreadNotifications && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications" className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
                </div>
                <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                  {notificationItems.map((notification) => (
                    <li key={notification.id}>
                      <Link href={notification.href} onClick={() => setNotificationsOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-slate-50">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.tone}`} />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-slate-800">{notification.title}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">{notification.detail}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            </div>
            <div className="relative">
            <button
              onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false); }}
              aria-label="Open account menu"
              aria-expanded={profileOpen}
              className={`flex items-center rounded-lg px-2 py-1.5 transition-colors hover:bg-muted ${compact ? "gap-2" : "gap-3"}`}
            >
              <div className={`flex items-center justify-center rounded-full bg-primary font-semibold text-white ${compact ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm"}`}>
                {session.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className={`${compact ? "text-xs" : "text-sm"} font-semibold`}>{session.name}</p>
                <p className={`${compact ? "text-[11px]" : "text-xs"} text-slate-500`}>{session.role}</p>
              </div>
              <ChevronDown size={compact ? 14 : 16} className="hidden text-slate-400 sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900">{session.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{session.email}</p>
                </div>
                <Link href="/" onClick={() => setProfileOpen(false)} className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Go to dashboard</Link>
                <button onClick={signOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Sign out</button>
              </div>
            )}
            </div>
          </div>
        </header>

        <main className={`p-4 ${compact ? "lg:p-8" : "lg:p-10"}`}>{children}</main>
      </div>
      <AIAssistant />
    </div>
  );
}

