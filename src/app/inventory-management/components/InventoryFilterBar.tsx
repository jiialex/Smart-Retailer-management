import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { Category } from '@/types';
import type { ProductStatus } from '@/types';

const STATUS_OPTIONS: ProductStatus[] = ['Active', 'Low Stock', 'Out of Stock', 'Discontinued'];

interface Props {
  search: string;
  onSearch: (v: string) => void;
  categoryFilter: string;
  onCategoryFilter: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  categories: Category[];
}

export default function InventoryFilterBar({ search, onSearch, categoryFilter, onCategoryFilter, statusFilter, onStatusFilter, categories }: Props) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card px-4 py-3 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-xs">
        <Search size={15} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by name, SKU…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          aria-label="Search products"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-muted-foreground" />

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilter(e.target.value)}
          className="text-sm text-foreground bg-muted border-0 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={`cat-opt-${c.id}`} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value)}
          className="text-sm text-foreground bg-muted border-0 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={`status-opt-${s}`} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}