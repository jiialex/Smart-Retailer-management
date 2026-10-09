import React from 'react';
import { Package, ShoppingCart, FileText } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type EmptyStateType = 'products' | 'transactions' | 'search' | 'cart';

const CONFIGS = {
  products: {
    icon: Package,
    heading: 'No products yet',
    description: 'Add your first product to start tracking inventory and processing sales.',
    cta: 'Add Product',
  },
  transactions: {
    icon: FileText,
    heading: 'No transactions found',
    description: 'Transactions will appear here once sales are processed through the checkout.',
    cta: 'Go to Checkout',
  },
  search: {
    icon: Package,
    heading: 'No products match your search',
    description: 'Try a different product name, SKU, or category filter.',
    cta: undefined,
  },
  cart: {
    icon: ShoppingCart,
    heading: 'Cart is empty',
    description: 'Search for products above and click to add them to the cart.',
    cta: undefined,
  },
};

interface EmptyStateProps {
  type: EmptyStateType;
  onCta?: () => void;
}

export default function EmptyState({ type, onCta }: EmptyStateProps) {
  const config = CONFIGS[type];
  const Icon = config.icon;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon size={26} className="text-muted-foreground" />
      </div>
      <h3 className="text-base font-600 text-foreground mb-1.5">{config.heading}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{config.description}</p>
      {config.cta && onCta && (
        <button
          onClick={onCta}
          className="mt-5 px-4 py-2 bg-primary text-white text-sm font-600 rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
        >
          {config.cta}
        </button>
      )}
    </div>
  );
}