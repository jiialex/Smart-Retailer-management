'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import type { Product } from '@/types';
import InventoryFilterBar from './InventoryFilterBar';
import InventoryTable from './InventoryTable';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function InventoryContent() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<keyof Product>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    const initialSearch = new URLSearchParams(window.location.search).get('search');
    if (initialSearch) setSearch(initialSearch);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'all') list = list.filter((p) => p.categoryId === categoryFilter);
    if (statusFilter !== 'all') list = list.filter((p) => p.status === statusFilter);
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      if (typeof av === 'number' && typeof bv === 'number')
        return sortDir === 'asc' ? av - bv : bv - av;
      return 0;
    });
    return list;
  }, [products, search, categoryFilter, statusFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (key: keyof Product) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleSave = (data: Omit<Product, 'id'>) => {
    if (editProduct) {
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, ...data } : p));
      toast.success(`${data.name} updated successfully`);
      setEditProduct(null);
    } else {
      const newProd: Product = { ...data, id: `prod-${Date.now()}` };
      setProducts((prev) => [newProd, ...prev]);
      toast.success(`${data.name} added to inventory`);
      setAddModalOpen(false);
    }
  };

  const handleDelete = (product: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast.success(`${product.name} removed from inventory`);
    setDeleteProduct(null);
  };

  const handleBulkDelete = () => {
    const names = products.filter((p) => selectedIds.has(p.id)).map((p) => p.name);
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    toast.success(`${names.length} product${names.length > 1 ? 's' : ''} deleted`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paged.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((p) => p.id)));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-600 text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {products.length} products · {products.filter((p) => p.status === 'Low Stock').length} low stock · {products.filter((p) => p.status === 'Out of Stock').length} out of stock
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info('Export started — CSV will download shortly')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-500 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Download size={15} />
            Export
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-600 rounded-lg hover:brightness-90 transition-colors active:scale-95"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <InventoryFilterBar
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        categoryFilter={categoryFilter}
        onCategoryFilter={(v) => { setCategoryFilter(v); setPage(1); }}
        statusFilter={statusFilter}
        onStatusFilter={(v) => { setStatusFilter(v); setPage(1); }}
        categories={CATEGORIES}
      />

      {/* Table */}
      <InventoryTable
        products={paged}
        allFiltered={filtered}
        selectedIds={selectedIds}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEdit={(p) => setEditProduct(p)}
        onDelete={(p) => setDeleteProduct(p)}
        page={page}
        pageCount={pageCount}
        total={filtered.length}
        perPage={PER_PAGE}
        onPageChange={setPage}
        onBulkDelete={handleBulkDelete}
      />

      {/* Add/Edit modal */}
      <ProductFormModal
        open={addModalOpen || !!editProduct}
        onClose={() => { setAddModalOpen(false); setEditProduct(null); }}
        product={editProduct}
        categories={CATEGORIES}
        onSave={handleSave}
      />

      {/* Delete confirm */}
      <DeleteConfirmModal
        open={!!deleteProduct}
        product={deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={() => deleteProduct && handleDelete(deleteProduct)}
      />
    </div>
  );
}