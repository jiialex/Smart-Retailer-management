import React from 'react';
import AppLayout from '@/components/AppLayout';
import CheckoutContent from './components/CheckoutContent';

export default function SalesCheckoutPage() {
  return (
    <AppLayout currentPath="/sales-checkout">
      <CheckoutContent />
    </AppLayout>
  );
}
