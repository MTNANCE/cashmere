# Cashmere

Personal finance management app.

## Setup

1. Create `.env.local`:
   ```env
   NEXT_PUBLIC_POCKETBASE_URL=https://cmpd.libanbn.com
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up PocketBase collections in Admin UI at `https://cmpd.libanbn.com/_/`

4. Start dev server:
   ```bash
   pnpm dev
   ```

## Stack

- Next.js 15
- PocketBase
- TanStack Query
- TailwindCSS
