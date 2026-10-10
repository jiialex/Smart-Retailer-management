'use client';

import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { PRODUCTS } from '@/data/mockData';
import type { Product } from '@/types';

type VerificationStatus = 'Verified' | 'Review required' | 'Flagged' | 'Unregistered' | 'Not found';
type RegistryRecord = {
  status: Exclude<VerificationStatus, 'Unregistered' | 'Not found'>;
  manufacturer: string;
  origin: string;
  batch: string;
  manufactured: string;
  expires: string;
  note: string;
};
type LookupResult = {
  query: string;
  product: Product | null;
  record: RegistryRecord | null;
  status: VerificationStatus;
  checkedAt: string;
};

const REGISTRY: Record<string, RegistryRecord> = {
  'BEV-001': {
    status: 'Verified',
    manufacturer: 'Clearwater Beverage Co.',
    origin: 'Ontario, Canada',
    batch: 'CW-2609-1184',
    manufactured: 'Sep 18, 2026',
    expires: 'Sep 18, 2027',
    note: 'Batch and supplier certificate match the registered product record.',
  },
  'DAI-002': {
    status: 'Verified',
    manufacturer: 'Meadow Dairy Cooperative',
    origin: 'Wisconsin, USA',
    batch: 'MD-2610-0442',
    manufactured: 'Oct 2, 2026',
    expires: 'Nov 1, 2026',
    note: 'Supplier certificate and lot details match the registered record.',
  },
  'PC-001': {
    status: 'Verified',
    manufacturer: 'Northstar Personal Care',
    origin: 'New Jersey, USA',
    batch: 'NS-2608-7102',
    manufactured: 'Aug 12, 2026',
    expires: 'Aug 12, 2028',
    note: 'Manufacturer, batch, and product identifiers match.',
  },
  'BEV-002': {
    status: 'Review required',
    manufacturer: 'Sun Orchard Foods',
    origin: 'California, USA',
    batch: 'SO-2609-3321',
    manufactured: 'Sep 4, 2026',
    expires: 'Mar 4, 2027',
    note: 'Supplier certificate is awaiting renewal. Review before the next purchase order.',
  },
  'SNK-002': {
    status: 'Flagged',
    manufacturer: 'Cacao Ridge Confectionery',
    origin: 'Oregon, USA',
    batch: 'CR-2607-9066',
    manufactured: 'Jul 22, 2026',
    expires: 'Jan 22, 2027',
    note: 'Batch identifier does not match the registered supplier shipment. Hold for review.',
  },
};

const STATUS_STYLES: Record<VerificationStatus, string> = {
  Verified: 'bg-green-50 text-green-700 ring-green-200',
  'Review required': 'bg-amber-50 text-amber-700 ring-amber-200',
  Flagged: 'bg-red-50 text-red-700 ring-red-200',
  Unregistered: 'bg-slate-100 text-slate-700 ring-slate-200',
  'Not found': 'bg-slate-100 text-slate-700 ring-slate-200',
};

export default function AuthenticityPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [recentChecks, setRecentChecks] = useState<LookupResult[]>([]);

  const verify = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const lowerValue = normalized.toLowerCase();
    const product = PRODUCTS.find((item) =>
      item.sku.toLowerCase() === lowerValue ||
      item.barcode?.toLowerCase() === lowerValue ||
      item.name.toLowerCase() === lowerValue,
    ) ?? null;
    const record = product ? REGISTRY[product.sku] ?? null : null;
    const status: VerificationStatus = !product
      ? 'Not found'
      : !record
        ? 'Unregistered'
        : record.status;
    const check: LookupResult = {
      query: normalized,
      product,
      record,
      status,
      checkedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setResult(check);
    setRecentChecks((checks) => [check, ...checks.filter((item) => item.query !== normalized)].slice(0, 5));
    setQuery(normalized);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verify(query);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Authenticity</h1>
          <p className="mt-1 text-sm text-slate-500">Check a product against its sample provenance record</p>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-slate-800">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
          <p>Demo registry with local sample records. Verification results are illustrative and are not a live supplier or blockchain check.</p>
        </div>

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Search size={19} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Verify an item</h2>
                <p className="mt-0.5 text-xs text-slate-500">Enter a product name, SKU, or barcode</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="authenticity-query">Product name, SKU, or barcode</label>
              <input
                id="authenticity-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. BEV-001"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-90">
                Verify product <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs text-slate-500">Try a sample:</span>
              {['BEV-001', 'BEV-002', 'SNK-002'].map((sku) => (
                <button key={sku} type="button" onClick={() => verify(sku)} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-primary/40 hover:text-primary">
                  {sku}
                </button>
              ))}
            </div>

            {result ? <VerificationResult result={result} /> : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center">
                <ShieldQuestion size={26} className="mx-auto text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-700">No item checked yet</p>
                <p className="mt-1 text-xs text-slate-500">A verification result will appear here.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">Recent checks</h2>
                <p className="mt-1 text-xs text-slate-500">This session only</p>
              </div>
              <Clock3 size={17} className="text-slate-400" />
            </div>
            {recentChecks.length ? (
              <ul className="divide-y divide-slate-100">
                {recentChecks.map((check) => (
                  <li key={`${check.query}-${check.checkedAt}`}>
                    <button type="button" onClick={() => verify(check.query)} className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-slate-50">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-800">{check.product?.name ?? check.query}</span>
                        <span className="mt-0.5 block text-xs text-slate-400">{check.product?.sku ?? 'Unknown code'} · {check.checkedAt}</span>
                      </span>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[check.status]}`}>{check.status}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-8 text-center text-sm text-slate-500">Your completed checks will appear here.</p>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function VerificationResult({ result }: { result: LookupResult }) {
  const StatusIcon = result.status === 'Verified'
    ? BadgeCheck
    : result.status === 'Flagged'
      ? ShieldAlert
      : ShieldQuestion;
  const title = result.product?.name ?? `No product found for “${result.query}”`;

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <StatusIcon size={22} className={result.status === 'Verified' ? 'text-green-600' : result.status === 'Flagged' ? 'text-red-600' : 'text-amber-600'} />
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {result.product && <p className="mt-0.5 text-xs text-slate-500">{result.product.sku} · {result.product.categoryName}</p>}
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[result.status]}`}>{result.status}</span>
      </div>

      {result.record ? (
        <>
          <p className={`mt-4 rounded-lg px-3 py-2.5 text-sm ${result.status === 'Verified' ? 'bg-green-50 text-green-800' : result.status === 'Flagged' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'}`}>
            {result.record.note}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <Detail label="Manufacturer" value={result.record.manufacturer} />
            <Detail label="Origin" value={result.record.origin} />
            <Detail label="Batch" value={result.record.batch} />
            <Detail label="Manufactured" value={result.record.manufactured} />
            <Detail label="Expiry" value={result.record.expires} />
            <Detail label="Checked" value={result.checkedAt} />
          </dl>
        </>
      ) : (
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-600">
          {result.product
            ? 'This product exists in inventory, but no sample provenance record is available.'
            : 'Check the product code and try again. This code does not match an item in the sample catalog.'}
        </p>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 break-words font-medium text-slate-800">{value}</dd>
    </div>
  );
}
