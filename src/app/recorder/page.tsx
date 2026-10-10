'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Store } from 'lucide-react';
import { clearSession, getCurrentSession, type AuthSession } from '@/lib/auth';
import CheckoutContent from '@/app/sales-checkout/components/CheckoutContent';
import AIAssistant from '@/components/AIAssistant';

export default function RecorderPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const currentSession = getCurrentSession();
    if (!currentSession) {
      router.replace('/recorder/login');
    } else if (currentSession.role !== 'Recorder') {
      router.replace('/');
    } else {
      setSession(currentSession);
    }
    setAuthReady(true);
  }, [router]);

  const signOut = () => {
    clearSession();
    router.replace('/recorder/login');
  };

  if (!authReady || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50" aria-busy="true">
        <p className="text-sm text-slate-500">Opening recorder workspace…</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white"><Store size={19} /></span>
          <div>
            <p className="text-sm font-semibold text-slate-900">SmartRetail</p>
            <p className="text-xs text-slate-500">Recorder workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">{session.name}</p>
            <p className="text-xs text-slate-500">Recorder</p>
          </div>
          <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        <CheckoutContent cashierName={session.name} />
      </main>
      <AIAssistant />
    </div>
  );
}