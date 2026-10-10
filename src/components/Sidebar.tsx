'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Brain,
  ShieldCheck,
  Factory,
  LogOut,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';


interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard, group: 'main' },
  { id: 'nav-inventory', label: 'Inventory', href: '/inventory-management', icon: Package, badge: 5, group: 'main' },
  { id: 'nav-checkout', label: 'Sales Checkout', href: '/sales-checkout', icon: ShoppingCart, group: 'main' },
  { id: 'nav-reports', label: 'Reports', href: '/reports', icon: BarChart3, group: 'analytics' },
  { id: 'nav-forecast', label: 'AI Forecasting', href: '/ai-forecasting', icon: Brain, group: 'analytics' },
  { id: 'nav-verify', label: 'Authenticity', href: '/authenticity', icon: ShieldCheck, group: 'analytics' },
  { id: 'nav-manufacturer', label: 'Manufacturer', href: '/manufacturer', icon: Factory, group: 'admin' },
];

const GROUP_LABELS: Record<string, string> = {
  main: 'Operations',
  analytics: 'Analytics',
  admin: 'Administration',
};

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
  currentPath: string;
}

export default function Sidebar({ collapsed, mobileOpen, onMobileClose, onToggleCollapse, currentPath }: SidebarProps) {
  const groups = ['main', 'analytics', 'admin'];
  const handleSignOut = () => toast.info('Sign out is not configured for this demo.');

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-navy border-r border-border/20 sidebar-transition flex-shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/10 h-16 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-2'}`}>
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-bold text-base text-white tracking-tight truncate">SmartRetail</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
          {groups.map((group) => {
            const items = NAV_ITEMS.filter((n) => n.group === group);
            return (
              <div key={`group-${group}`}>
                {!collapsed && (
                  <p className="text-[10px] font-600 tracking-widest uppercase text-white/40 px-2 mb-1">
                    {GROUP_LABELS[group]}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-500 transition-all duration-150 group relative
                            ${active
                              ? 'bg-white/10 text-white ring-1 ring-inset ring-white/10' :'text-white/70 hover:bg-white/10 hover:text-white'
                            }
                            ${collapsed ? 'justify-center' : ''}
                          `}
                        >
                          <Icon size={18} className="flex-shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {!collapsed && item.badge && item.badge > 0 && (
                            <span className="ml-auto text-[10px] font-700 bg-warning text-white rounded-full px-1.5 py-0.5 leading-none">
                              {item.badge}
                            </span>
                          )}
                          {collapsed && item.badge && item.badge > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-warning" />
                          )}
                          {/* Tooltip for collapsed */}
                          {collapsed && (
                            <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-2 space-y-1">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="text-sm font-500">Collapse</span></>}
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150">
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-navy sidebar-transition lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <span className="font-bold text-base text-white">SmartRetail</span>
          </div>
          <button onClick={onMobileClose} className="text-white/60 hover:text-white p-1" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
          {groups.map((group) => {
            const items = NAV_ITEMS.filter((n) => n.group === group);
            return (
              <div key={`mobile-group-${group}`}>
                <p className="text-[10px] font-600 tracking-widest uppercase text-white/40 px-2 mb-1">
                  {GROUP_LABELS[group]}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={`mobile-${item.id}`}>
                        <Link
                          href={item.href}
                          onClick={onMobileClose}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-500 transition-all duration-150
                            ${active ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                          {item.badge && item.badge > 0 && (
                            <span className="ml-auto text-[10px] font-700 bg-warning text-white rounded-full px-1.5 py-0.5 leading-none">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-2">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}