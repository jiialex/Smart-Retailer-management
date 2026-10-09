'use client';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { Product } from '@/types';

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ open, product, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // Backend: DELETE /api/products/:id
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    onConfirm();
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Product" size="sm">
      <div className="px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <div>
            <p className="text-sm font-600 text-foreground">Remove &quot;{product?.name}&quot;?</p>
            <p className="text-sm text-muted-foreground mt-1.5">
              This will permanently remove <span className="font-600 text-foreground">{product?.name}</span> (SKU: <span className="font-mono text-xs">{product?.sku}</span>) from your inventory. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-500 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-danger text-white text-sm font-600 rounded-lg hover:bg-red-700 transition-colors active:scale-95 disabled:opacity-70 min-w-[120px] justify-center"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : 'Delete Product'}
        </button>
      </div>
    </Modal>
  );
}