'use client';
import React from 'react';
import { ChevronUp, ChevronDown, Edit2, Trash2, RefreshCw, ChevronsUpDown } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  allFiltered: Product[];
  selectedIds: Set<string>;
  sortKey: keyof Product;
  sortDir: 'asc' | 'desc';
  onSort: (key: keyof Product) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  page: number;
  pageCount: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
  onBulkDelete: () => void;
}

function SortIcon({ col, sortKey, sortDir }: { col: keyof Product; sortKey: keyof Product; sortDir: 'asc' | 'desc' }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-muted-foreground/50" />;
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-primary" />
    : <ChevronDown size={13} className="text-primary" />;
}

const COLUMNS: { key: keyof Product; label: string; align?: string }[] = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product Name' },
  { key: 'categoryName', label: 'Category' },
  { key: 'costPrice', label: 'Cost', align: 'right' },
  { key: 'sellPrice', label: 'Sell Price', align: 'right' },
  { key: 'quantity', label: 'Qty on Hand', align: 'right' },
  { key: 'reorderLevel', label: 'Reorder At', align: 'right' },
  { key: 'status', label: 'Status' },
];

export default function InventoryTable({
  products, allFiltered, selectedIds, sortKey, sortDir, onSort,
  onToggleSelect, onToggleSelectAll, onEdit, onDelete,
  page, pageCount, total, perPage, onPageChange, onBulkDelete,
}: Props) {
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const rowClass = (p: Product) => {
    if (p.status === 'Out of Stock') return 'critical-stock-row';
    if (p.status === 'Low Stock') return 'low-stock-row';
    return '';
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/5 border-b border-primary/20 px-5 py-3 flex items-center gap-4 bulk-bar-slide">
          <span className="text-sm font-600 text-primary">{selectedIds.size} selected</span>
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-1.5 text-sm font-600 text-danger hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={14} /> Delete Selected
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 text-sm font-600 text-warning hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw size={14} /> Mark for Reorder
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                  aria-label="Select all products"
                />
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={`th-${col.key}`}
                  className={`px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground cursor-pointer hover:text-foreground select-none ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  onClick={() => onSort(col.key)}
                >
                  <span className="flex items-center gap-1 justify-start">
                    {col.label}
                    <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <EmptyState type="search" />
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-muted/30 transition-colors group ${rowClass(product)}`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => onToggleSelect(product.id)}
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                      aria-label={`Select ${product.name}`}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-500 text-foreground">{product.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{product.categoryName}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">${product.costPrice.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums font-600 text-foreground">${product.sellPrice.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    <span className={`font-600 ${product.quantity === 0 ? 'text-danger' : product.quantity <= product.reorderLevel ? 'text-warning' : 'text-foreground'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">{product.reorderLevel}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(product)}
                        title={`Edit ${product.name}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-primary transition-colors"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        title={`Delete ${product.name} — this cannot be undone`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-danger transition-colors"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing {start}–{end} of {total} products
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={page === 1}
              className="px-2 py-1.5 text-xs rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              «
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-2.5 py-1.5 text-xs rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={`page-${p}`}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 text-xs rounded-lg font-500 transition-colors ${p === page ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === pageCount}
              className="px-2.5 py-1.5 text-xs rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
            <button
              onClick={() => onPageChange(pageCount)}
              disabled={page === pageCount}
              className="px-2 py-1.5 text-xs rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}