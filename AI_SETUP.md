# Gemini AI Trial Setup

The SmartRetail AI assistant uses Google's Gemini API from a Next.js server route. The API key is read server-side and is never sent to the browser.

1. Create a fresh Gemini API key in Google AI Studio.
2. Put the key in `.env.local` in the project root:

   ```env
   GEMINI_API_KEY=your_key_here
   ```

3. Restart the dev server with `npm run dev`.
4. Sign in and use the sparkle button in the bottom-right corner.

Keep the actual key only in `.env.local`, not in this guide or any source file. `.env.local` is ignored by Git.

The assistant is read-only. It can discuss the sample product catalog, stock alerts, and transaction data, but cannot change inventory or process sales. The app currently uses demo data; connect a real store database before relying on recommendations for business decisions.
