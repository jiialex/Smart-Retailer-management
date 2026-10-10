import { NextResponse } from 'next/server';
import { HOURLY_SALES, PRODUCTS, STOCK_ALERTS, TOP_PRODUCTS, TRANSACTIONS } from '@/data/mockData';

export const runtime = 'nodejs';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
};

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY = 12;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini is not configured yet. Add GEMINI_API_KEY to .env.local and restart the dev server.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || !('messages' in body) || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: 'A conversation is required.' }, { status: 400 });
  }

  const messages = (body.messages as unknown[])
    .slice(-MAX_HISTORY)
    .filter((item): item is { role: string; content: string } =>
      typeof item === 'object' && item !== null && 'role' in item && 'content' in item &&
      typeof item.role === 'string' && typeof item.content === 'string',
    )
    .map((item): ChatMessage | null => {
      const content = item.content.trim();
      if (!content || content.length > MAX_MESSAGE_LENGTH) return null;
      if (item.role === 'user') return { role: 'user', content };
      if (item.role === 'assistant') return { role: 'assistant', content };
      return null;
    })
    .filter((item): item is ChatMessage => item !== null);

  if (!messages.length || !messages.some((message) => message.role === 'user')) {
    return NextResponse.json({ error: 'Enter a question to get started.' }, { status: 400 });
  }

  const pagePath = 'pagePath' in body && typeof body.pagePath === 'string'
    ? body.pagePath.slice(0, 160)
    : '/';
  const productContext = PRODUCTS.map((product) => ({
    sku: product.sku,
    name: product.name,
    category: product.categoryName,
    stock: product.quantity,
    reorderAt: product.reorderLevel,
    status: product.status,
    sellPrice: product.sellPrice,
  }));
  const transactionContext = TRANSACTIONS.map((transaction) => ({
    number: transaction.transactionNumber,
    date: transaction.date,
    cashier: transaction.cashier,
    items: transaction.items,
    total: transaction.total,
    payment: transaction.paymentMethod,
    status: transaction.status,
  }));

  const systemInstruction = [
    'You are SmartRetail AI, an advisory assistant for a small retail store.',
    'Answer using the provided store data. Be concise, practical, and state when the sample data is insufficient.',
    'Never claim that you changed inventory, processed a sale, verified a live supplier, or performed an external action.',
    'Give recommendations only. Ask a clarifying question when needed, and show calculations when discussing totals or reorder quantities.',
    `The user is currently viewing ${pagePath}. Tailor the answer to that page when relevant.`,
    `Current product catalog and stock: ${JSON.stringify(productContext)}`,
    `Stock alerts: ${JSON.stringify(STOCK_ALERTS)}`,
    `Recent sample transactions: ${JSON.stringify(transactionContext)}`,
    `Top product sales sample: ${JSON.stringify(TOP_PRODUCTS)}`,
    `Hourly sales sample: ${JSON.stringify(HOURLY_SALES)}`,
  ].join('\n\n');

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: messages.map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
          })),
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
        }),
        signal: AbortSignal.timeout(30000),
      },
    );
    const result = await response.json() as GeminiResponse;

    if (!response.ok) {
      const status = response.status === 429 ? 429 : 502;
      return NextResponse.json(
        { error: response.status === 429 ? 'Gemini is busy. Wait a moment and try again.' : result.error?.message ?? 'Gemini could not answer right now.' },
        { status },
      );
    }

    const answer = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!answer) {
      return NextResponse.json({ error: 'Gemini returned an empty response. Please rephrase your question.' }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: 'Could not reach Gemini. Check your connection and try again.' }, { status: 502 });
  }
}