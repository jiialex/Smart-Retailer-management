'use client';
import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';


interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export default function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-4 sm:px-6 gap-4 flex-shrink-0 z-30">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
        <Search size={15} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search products, SKUs, transactions…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          // Backend: wire to global search API endpoint
        />
        <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] font-500 text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </div>

      <div className="flex-1 sm:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Last updated */}
        <span className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live · Updated just now
        </span>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-card" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-card-md z-50 modal-panel overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-600 text-foreground">Notifications</p>
              </div>
              <ul className="divide-y divide-border max-h-72 overflow-y-auto">
                {[
                  { id: 'notif-001', text: 'Dark Chocolate Bar is out of stock', time: '2 min ago', type: 'critical' },
                  { id: 'notif-002', text: 'Dish Soap 500ml critically low (5 units)', time: '8 min ago', type: 'critical' },
                  { id: 'notif-003', text: 'Orange Juice 1L below reorder level', time: '14 min ago', type: 'warning' },
                  { id: 'notif-004', text: 'Transaction TXN-0037 refunded', time: '32 min ago', type: 'info' },
                ].map((n) => (
                  <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'critical' ? 'bg-danger' : n.type === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground leading-snug">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User avatar */}
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-700 text-white flex-shrink-0">
            MO
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-600 text-foreground leading-none">Marcus Okafor</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Store Manager</p>
          </div>
          <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
        </button>
      </div>
    </header>
  );
}