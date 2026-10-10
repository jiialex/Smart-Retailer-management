'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import type { Product, Category, ProductStatus } from '@/types';
import { Loader2 } from 'lucide-react';

interface FormValues {
  sku: string;
  name: string;
  categoryId: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  reorderLevel: number;
  status: ProductStatus;
  barcode?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (data: Omit<Product, 'id'>) => void;
}

const STATUS_OPTIONS: ProductStatus[] = ['Active', 'Low Stock', 'Out of Stock', 'Discontinued'];

export default function ProductFormModal({ open, onClose, product, categories, onSave }: Props) {
  const [saving, setSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: product
      ? { ...product }
      : { sku: '', name: '', categoryId: categories[0]?.id || '', costPrice: 0, sellPrice: 0, quantity: 0, reorderLevel: 20, status: 'Active', barcode: '' },
  });

  useEffect(() => {
    if (open) {
      reset(product
        ? { ...product }
        : { sku: '', name: '', categoryId: categories[0]?.id || '', costPrice: 0, sellPrice: 0, quantity: 0, reorderLevel: 20, status: 'Active', barcode: '' }
      );
    }
  }, [open, product, categories, reset]);

  const selectedCategoryId = watch('categoryId');

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    // Backend: POST /api/products or PUT /api/products/:id
    await new Promise((r) => setTimeout(r, 600));
    const cat = categories.find((c) => c.id === values.categoryId);
    onSave({
      ...values,
      categoryName: cat?.name || '',
      costPrice: Number(values.costPrice),
      sellPrice: Number(values.sellPrice),
      quantity: Number(values.quantity),
      reorderLevel: Number(values.reorderLevel),
    });
    setSaving(false);
  };

  const labelClass = 'block text-xs font-600 text-foreground mb-1';
  const inputClass = 'w-full text-sm text-foreground bg-muted border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-muted-foreground';
  const errorClass = 'text-xs text-danger mt-1';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? `Edit — ${product.name}` : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="px-6 py-5 space-y-5">
          {/* Section: Basic Info */}
          <div>
            <h3 className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-3">Product Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="field-sku">SKU</label>
                <p className="text-[11px] text-muted-foreground mb-1">Unique stock-keeping unit identifier</p>
                <input
                  id="field-sku"
                  type="text"
                  placeholder="e.g. BEV-004"
                  className={inputClass}
                  {...register('sku', { required: 'SKU is required' })}
                />
                {errors.sku && <p className={errorClass} role="alert">{errors.sku.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="field-name">Product Name</label>
                <p className="text-[11px] text-muted-foreground mb-1">Full display name shown at checkout</p>
                <input
                  id="field-name"
                  type="text"
                  placeholder="e.g. Sparkling Water 500ml"
                  className={inputClass}
                  {...register('name', { required: 'Product name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                />
                {errors.name && <p className={errorClass} role="alert">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="field-category">Category</label>
                <p className="text-[11px] text-muted-foreground mb-1">Product classification for filtering</p>
                <select
                  id="field-category"
                  className={inputClass}
                  {...register('categoryId', { required: 'Category is required' })}
                >
                  {categories.map((c) => (
                    <option key={`form-cat-${c.id}`} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className={errorClass} role="alert">{errors.categoryId.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="field-barcode">Barcode (optional)</label>
                <p className="text-[11px] text-muted-foreground mb-1">EAN-13 or UPC barcode for scanning</p>
                <input
                  id="field-barcode"
                  type="text"
                  placeholder="e.g. 5901234123457"
                  className={inputClass}
                  {...register('barcode')}
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section: Pricing */}
          <div>
            <h3 className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-3">Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="field-cost">Cost Price (USD)</label>
                <p className="text-[11px] text-muted-foreground mb-1">Wholesale / supplier cost per unit</p>
                <input
                  id="field-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputClass}
                  {...register('costPrice', {
                    required: 'Cost price is required',
                    min: { value: 0, message: 'Must be 0 or more' },
                    valueAsNumber: true,
                  })}
                />
                {errors.costPrice && <p className={errorClass} role="alert">{errors.costPrice.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="field-sell">Sell Price (USD)</label>
                <p className="text-[11px] text-muted-foreground mb-1">Retail price charged to customers</p>
                <input
                  id="field-sell"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputClass}
                  {...register('sellPrice', {
                    required: 'Sell price is required',
                    min: { value: 0.01, message: 'Sell price must be greater than 0' },
                    valueAsNumber: true,
                  })}
                />
                {errors.sellPrice && <p className={errorClass} role="alert">{errors.sellPrice.message}</p>}
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section: Stock */}
          <div>
            <h3 className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-3">Stock Levels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass} htmlFor="field-qty">Quantity on Hand</label>
                <p className="text-[11px] text-muted-foreground mb-1">Current units in stock</p>
                <input
                  id="field-qty"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  className={inputClass}
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true,
                  })}
                />
                {errors.quantity && <p className={errorClass} role="alert">{errors.quantity.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="field-reorder">Reorder Level</label>
                <p className="text-[11px] text-muted-foreground mb-1">Alert threshold for restocking</p>
                <input
                  id="field-reorder"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="20"
                  className={inputClass}
                  {...register('reorderLevel', {
                    required: 'Reorder level is required',
                    min: { value: 1, message: 'Must be at least 1' },
                    valueAsNumber: true,
                  })}
                />
                {errors.reorderLevel && <p className={errorClass} role="alert">{errors.reorderLevel.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="field-status">Status</label>
                <p className="text-[11px] text-muted-foreground mb-1">Current product availability</p>
                <select
                  id="field-status"
                  className={inputClass}
                  {...register('status', { required: true })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={`form-status-${s}`} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-500 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-600 rounded-lg hover:brightness-90 transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[110px] justify-center"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" /> Saving…</>
            ) : (
              product ? 'Save Changes' : 'Add Product'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}