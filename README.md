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

## TBC
docker build --no-cache -t cashmere-pocketbase -f pocketbase.Dockerfile .
docker run --name cashmere_pocketbase -p 127.0.0.1:8119:8119 cashmere-pocketbase