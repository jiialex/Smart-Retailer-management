'use client';
import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';

import EmptyState from '@/components/ui/EmptyState';
import type { Product, CartItem } from '@/types';

interface Props {
  products: Product[];
  onAddToCart: (p: Product) => void;
  cart: CartItem[];
}

export default function ProductSearchPanel({ products, onAddToCart, cart }: Props) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    products.forEach((p) => {
      if (!seen.has(p.categoryId)) {
        seen.add(p.categoryId);
        result.push({ id: p.categoryId, name: p.categoryName });
      }
    });
    return result;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') list = list.filter((p) => p.categoryId === categoryFilter);
    return list;
  }, [products, query, categoryFilter]);

  const cartQty = (id: string) => cart.find((i) => i.productId === id)?.quantity ?? 0;

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Search header */}
      <div className="px-5 py-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by product name or SKU…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            aria-label="Search products for checkout"
          />
        </div>
        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-500 transition-colors ${categoryFilter === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={`chip-${c.id}`}
              onClick={() => setCategoryFilter(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-500 transition-colors ${categoryFilter === c.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="p-4 max-h-[calc(100vh-320px)] overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState type="search" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {filtered.map((product) => {
              const inCart = cartQty(product.id);
              const isLow = product.status === 'Low Stock';
              return (
                <button
                  key={`checkout-prod-${product.id}`}
                  onClick={() => onAddToCart(product)}
                  className={`relative text-left rounded-xl border p-3.5 transition-all duration-150 hover:shadow-card-md hover:border-primary/40 active:scale-95 group
                    ${inCart > 0 ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:bg-muted/20'}
                    ${isLow ? 'border-amber-200' : ''}
                  `}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {/* In-cart indicator */}
                  {inCart > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-700 flex items-center justify-center">
                      {inCart}
                    </span>
                  )}
                  <div className="mb-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg">
                      {product.categoryName === 'Beverages' ? '🥤' :
                       product.categoryName === 'Snacks' ? '🍿' :
                       product.categoryName === 'Dairy' ? '🥛' :
                       product.categoryName === 'Bakery' ? '🍞' :
                       product.categoryName === 'Personal Care' ? '🧴' :
                       product.categoryName === 'Household' ? '🧹' :
                       product.categoryName === 'Frozen' ? '🧊' : '🌿'}
                    </div>
                  </div>
                  <p className="text-sm font-600 text-foreground leading-snug line-clamp-2">{product.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{product.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-700 text-primary tabular-nums">${product.sellPrice.toFixed(2)}</span>
                    {isLow && (
                      <span className="text-[10px] font-500 text-warning bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5">
                        Low
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-muted-foreground">{product.quantity} in stock</span>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={12} className="text-primary" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">{filtered.length} products · Click a product to add to cart</p>
      </div>
    </div>
  );
}