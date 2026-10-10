'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  Clock3,
  Mail,
  MapPin,
  Package,
  Plus,
  Search,
  X,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { CATEGORIES, PRODUCTS } from '@/data/mockData';

type SupplierStatus = 'Active' | 'Review' | 'On hold';
type Manufacturer = {
  id: string;
  name: string;
  country: string;
  contact: string;
  email: string;
  phone: string;
  categoryIds: string[];
  skus: string[];
  leadDays: number;
  status: SupplierStatus;
  lastDelivery: string;
};

type NewManufacturer = Pick<Manufacturer, 'name' | 'country' | 'contact' | 'email' | 'phone' | 'leadDays' | 'categoryIds'>;

const INITIAL_MANUFACTURERS: Manufacturer[] = [
  { id: 'SUP-001', name: 'Clearwater Beverage Co.', country: 'Canada', contact: 'Nora Blake', email: 'nora@clearwater.example', phone: '+1 416 555 0142', categoryIds: ['cat-001'], skus: ['BEV-001', 'BEV-002'], leadDays: 4, status: 'Active', lastDelivery: 'Oct 8, 2026' },
  { id: 'SUP-002', name: 'Meadow Dairy Cooperative', country: 'United States', contact: 'Evan Brooks', email: 'orders@meadowdairy.example', phone: '+1 608 555 0193', categoryIds: ['cat-003'], skus: ['DAI-001', 'DAI-002'], leadDays: 2, status: 'Active', lastDelivery: 'Oct 9, 2026' },
  { id: 'SUP-003', name: 'Cacao Ridge Confectionery', country: 'United States', contact: 'Maya Chen', email: 'supply@cacaoridge.example', phone: '+1 503 555 0110', categoryIds: ['cat-002'], skus: ['SNK-001', 'SNK-002'], leadDays: 6, status: 'Review', lastDelivery: 'Oct 3, 2026' },
  { id: 'SUP-004', name: 'Northstar Personal Care', country: 'United States', contact: 'Ravi Shah', email: 'partners@northstar.example', phone: '+1 201 555 0168', categoryIds: ['cat-005'], skus: ['PC-001', 'PC-002'], leadDays: 7, status: 'Active', lastDelivery: 'Oct 6, 2026' },
  { id: 'SUP-005', name: 'Harbor Home Supply', country: 'United States', contact: 'Lena Ortiz', email: 'orders@harborhome.example', phone: '+1 312 555 0126', categoryIds: ['cat-006'], skus: ['HH-001', 'HH-002'], leadDays: 5, status: 'On hold', lastDelivery: 'Sep 28, 2026' },
  { id: 'SUP-006', name: 'Sun Orchard Foods', country: 'United States', contact: 'Oliver Price', email: 'sales@sunorchard.example', phone: '+1 559 555 0184', categoryIds: ['cat-001', 'cat-008'], skus: ['BEV-002', 'PRD-001'], leadDays: 3, status: 'Review', lastDelivery: 'Oct 7, 2026' },
];

const EMPTY_DRAFT: NewManufacturer = {
  name: '',
  country: '',
  contact: '',
  email: '',
  phone: '',
  leadDays: 5,
  categoryIds: ['cat-001'],
};

const STATUS_STYLES: Record<SupplierStatus, string> = {
  Active: 'bg-green-50 text-green-700 ring-green-200',
  Review: 'bg-amber-50 text-amber-700 ring-amber-200',
  'On hold': 'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function ManufacturerPage() {
  const [manufacturers, setManufacturers] = useState(INITIAL_MANUFACTURERS);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState<NewManufacturer>(EMPTY_DRAFT);

  const filteredManufacturers = useMemo(() => manufacturers.filter((manufacturer) => {
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || [manufacturer.name, manufacturer.country, manufacturer.contact, ...manufacturer.skus]
      .some((value) => value.toLowerCase().includes(search));
    const matchesCategory = categoryFilter === 'all' || manufacturer.categoryIds.includes(categoryFilter);
    const matchesStatus = statusFilter === 'all' || manufacturer.status === statusFilter;
    return matchesQuery && matchesCategory && matchesStatus;
  }), [manufacturers, query, categoryFilter, statusFilter]);

  const selectedManufacturer = manufacturers.find((manufacturer) => manufacturer.id === selectedId) ?? null;
  const activeCount = manufacturers.filter((manufacturer) => manufacturer.status === 'Active').length;
  const reviewCount = manufacturers.filter((manufacturer) => manufacturer.status === 'Review').length;
  const averageLeadDays = manufacturers.length
    ? Math.round(manufacturers.reduce((total, manufacturer) => total + manufacturer.leadDays, 0) / manufacturers.length)
    : 0;

  const updateDraft = (key: keyof NewManufacturer, value: string | number | string[]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const addManufacturer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const categories = draft.categoryIds.length ? draft.categoryIds : ['cat-001'];
    const newManufacturer: Manufacturer = {
      ...draft,
      id: `SUP-${String(Date.now()).slice(-6)}`,
      categoryIds: categories,
      skus: [],
      status: 'Active',
      lastDelivery: 'No deliveries yet',
    };
    setManufacturers((current) => [newManufacturer, ...current]);
    setSelectedId(newManufacturer.id);
    setAddOpen(false);
    setDraft(EMPTY_DRAFT);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manufacturer directory</h1>
            <p className="mt-1 text-sm text-slate-500">Supplier contacts, product coverage, and delivery status</p>
          </div>
          <button type="button" onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-90">
            <Plus size={16} /> Add manufacturer
          </button>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Supplier summary">
          <Summary label="Manufacturers" value={manufacturers.length.toString()} icon={<Building2 size={18} />} />
          <Summary label="Active suppliers" value={activeCount.toString()} icon={<Check size={18} />} />
          <Summary label="Average lead time" value={`${averageLeadDays} days`} icon={<Clock3 size={18} />} />
        </section>

        {reviewCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <Clock3 size={16} /> {reviewCount} supplier{reviewCount === 1 ? '' : 's'} need a profile or certificate review.
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search supplier, contact, or SKU" aria-label="Search manufacturers" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter manufacturers by category" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary">
                <option value="all">All categories</option>
                {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter manufacturers by status" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary">
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Review">Review</option>
                <option value="On hold">On hold</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Manufacturer</th>
                  <th className="px-4 py-3 font-medium">Categories</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 text-right font-medium">Lead time</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredManufacturers.map((manufacturer) => (
                  <tr key={manufacturer.id} className={selectedId === manufacturer.id ? 'bg-primary/5' : ''}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800">{manufacturer.name}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400"><MapPin size={12} />{manufacturer.country}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{manufacturer.categoryIds.map((id) => CATEGORIES.find((category) => category.id === id)?.name).filter(Boolean).join(', ')}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{manufacturer.contact}</p>
                      <a href={`mailto:${manufacturer.email}`} className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"><Mail size={12} />{manufacturer.email}</a>
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-slate-600">{manufacturer.leadDays} days</td>
                    <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[manufacturer.status]}`}>{manufacturer.status}</span></td>
                    <td className="px-5 py-3.5 text-right">
                      <button type="button" onClick={() => setSelectedId(selectedId === manufacturer.id ? null : manufacturer.id)} className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5">
                        {selectedId === manufacturer.id ? 'Close' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredManufacturers.length && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">No manufacturers match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {selectedManufacturer && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Supplier profile · {selectedManufacturer.id}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{selectedManufacturer.name}</h2>
              </div>
              <a href={`mailto:${selectedManufacturer.email}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary/40 hover:text-primary"><Mail size={15} /> Contact supplier</a>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
              <ProfileField label="Primary contact" value={selectedManufacturer.contact} />
              <ProfileField label="Email and phone" value={`${selectedManufacturer.email} · ${selectedManufacturer.phone || 'No phone on file'}`} />
              <ProfileField label="Last delivery" value={selectedManufacturer.lastDelivery} />
            </div>
            <div className="mt-5 border-t border-slate-100 pt-5">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"><Package size={15} /> Supplied products</h3>
              {selectedManufacturer.skus.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedManufacturer.skus.map((sku) => {
                    const product = PRODUCTS.find((item) => item.sku === sku);
                    return <span key={sku} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">{sku}{product ? ` · ${product.name}` : ''}</span>;
                  })}
                </div>
              ) : <p className="mt-2 text-sm text-slate-500">No inventory items linked yet.</p>}
            </div>
          </section>
        )}

        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setAddOpen(false); }}>
            <form onSubmit={addManufacturer} className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-xl" role="dialog" aria-modal="true" aria-labelledby="add-manufacturer-title">
              <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 id="add-manufacturer-title" className="font-semibold text-slate-900">Add manufacturer</h2>
                  <p className="mt-1 text-xs text-slate-500">Create a supplier profile in this session.</p>
                </div>
                <button type="button" onClick={() => setAddOpen(false)} aria-label="Close form" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
                <Field label="Manufacturer name" required value={draft.name} onChange={(value) => updateDraft('name', value)} />
                <Field label="Country" required value={draft.country} onChange={(value) => updateDraft('country', value)} />
                <Field label="Contact name" required value={draft.contact} onChange={(value) => updateDraft('contact', value)} />
                <Field label="Email" type="email" required value={draft.email} onChange={(value) => updateDraft('email', value)} />
                <Field label="Phone" value={draft.phone} onChange={(value) => updateDraft('phone', value)} />
                <label className="block text-sm font-medium text-slate-700">
                  Lead time (days)
                  <input type="number" min={1} max={90} required value={draft.leadDays} onChange={(event) => updateDraft('leadDays', Number(event.target.value))} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  Product category
                  <select value={draft.categoryIds[0] ?? 'cat-001'} onChange={(event) => updateDraft('categoryIds', [event.target.value])} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary">
                    {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
                <button type="button" onClick={() => setAddOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-90">Save manufacturer</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Summary({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
    </label>
  );
}
