'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, LoaderCircle, Send, Sparkles, X } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = [
  'Which items need reordering first?',
  'Summarize recent sales.',
  'What products are driving revenue?',
];

export default function AIAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open, sending, error]);

  const sendMessage = async (suggestedText?: string) => {
    const content = (suggestedText ?? draft).trim();
    if (!content || sending) return;

    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages);
    setDraft('');
    setError('');
    setSending(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, pagePath: pathname }),
      });
      const result = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(result.error || 'Gemini could not answer right now.');
      if (!result.answer) throw new Error('Gemini returned an empty response. Please try again.');
      setMessages((current) => [...current, { role: 'assistant', content: result.answer! }]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to contact Gemini. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="SmartRetail AI assistant"
          className="fixed bottom-20 right-4 z-50 flex max-h-[min(40rem,calc(100dvh-7rem))] w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-[#232F3E] px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10"><Sparkles size={18} /></span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">SmartRetail AI</h2>
                <p className="text-xs text-slate-300">Gemini · recommendations only</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close AI assistant" className="rounded-md p-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {!messages.length && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Bot size={17} className="text-primary" /> Ask about your store</div>
                <p className="mt-2 text-xs leading-5 text-slate-500">I can analyze the current sample catalog, stock alerts, sales, and transactions. Recommendations do not change store data.</p>
                <div className="mt-4 flex flex-col gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} type="button" disabled={sending} onClick={() => { void sendMessage(suggestion); }} className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-50">
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[88%] whitespace-pre-wrap break-words rounded-xl px-3 py-2.5 text-sm leading-5 ${message.role === 'user' ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>
                  {message.content}
                </p>
              </div>
            ))}

            {sending && (
              <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin" /> Gemini is thinking…</div>
            )}
            {error && (
              <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">{error}</div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={(event) => { event.preventDefault(); void sendMessage(); }} className="flex items-end gap-2 border-t border-slate-100 bg-white p-3">
            <label className="sr-only" htmlFor="retail-ai-question">Ask SmartRetail AI</label>
            <textarea
              id="retail-ai-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder="Ask about stock or sales…"
              className="max-h-28 min-h-10 flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button type="submit" disabled={!draft.trim() || sending} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-40">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={open ? 'Close SmartRetail AI' : 'Ask SmartRetail AI'}
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
      </button>
    </>
  );
}