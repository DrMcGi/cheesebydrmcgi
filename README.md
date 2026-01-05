# Cheese by Dr McGi

Initial scaffold for a Next.js (App Router) project with TypeScript + Tailwind.

## Features included
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase integration (Google OAuth login)
- Paystack checkout + webhook stubs
- Currency scaffolding (default **ZAR**, multi-currency-ready)
- Landing page foundation: **"Enter the Dairy"**

## Getting started

### 1) Install
```bash
pnpm i
# or: npm i / yarn
```

### 2) Environment variables
Create a `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
PAYSTACK_SECRET_KEY=...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=...
PAYSTACK_WEBHOOK_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `SUPABASE_SERVICE_ROLE_KEY` is only used server-side. Never expose it to the client.

### 3) Supabase Google OAuth
In Supabase dashboard:
- Enable Google provider
- Add redirect URL(s):
  - `http://localhost:3000/auth/callback`
  - Your production `https://<domain>/auth/callback`

### 4) Run
```bash
pnpm dev
```

## Routes
- `/` landing
- `/login` sign-in
- `/auth/callback` OAuth callback
- `/api/paystack/initialize` Paystack transaction initialization (stub)
- `/api/paystack/webhook` Paystack webhook receiver (stub)

## Notes
This is an initial scaffold intended to be extended with real product/catalog, checkout, and fulfillment logic.
