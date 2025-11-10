# Cashmere

A modern personal finance management application with portfolio-based account organization.

## Features

- 📊 **Portfolio Management**: Organize accounts into portfolios (Personal, Business, etc.)
- 💰 **Account Tracking**: Manage bank accounts and credit cards
- 📝 **Transaction Management**: Track income and expenses with categories
- 📈 **Dashboard Analytics**: Real-time financial overview with charts
- 🔄 **Portfolio Switching**: Quick switching between different portfolios
- 🎯 **Filtering**: Filter transactions by account, category, and date

## Quick Start with Docker

The easiest way to get started is using Docker Compose (everything is containerized, no manual setup needed):

1. **Start the application:**
   ```bash
   docker compose up --build
   ```

   This will:
   - Build and start PocketBase on `http://localhost:8119`
   - Start Next.js app on `http://localhost:3000`
   - **Automatically seed the database on first run!**
   - Create Docker volumes for data persistence

2. **Login with demo credentials:**
   - Email: `demo@cashmere.app`
   - Password: `demodemo`

That's it! On first run, the database is automatically populated with:
- 2 portfolios (Personal & Business)
- 4 accounts across portfolios
- 35+ realistic transactions

**To reseed the database:**
```bash
# Option 1: Remove all data and start fresh
docker compose down -v  # Removes volumes
docker compose up --build

# Option 2: Just trigger reseed (keeps other data)
docker exec cashmere_pocketbase rm /pb/pb_data/.seeded
docker compose restart pocketbase

# Option 3: Manual trigger
curl -X POST http://localhost:8119/api/seed
```

## Local Development

For faster development, run PocketBase in Docker and Next.js locally:

```bash
# Terminal 1: Start PocketBase
docker compose up pocketbase

# Terminal 2: Start Next.js
pnpm install
echo "NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8119" > .env.local
pnpm dev
```

Visit `http://localhost:3000` and login with demo credentials.

## Architecture

### Tech Stack

- **Frontend**: Next.js 15 (React 19) with TypeScript
- **Backend**: PocketBase (SQLite)
- **State Management**: TanStack Query (React Query)
- **Styling**: TailwindCSS + shadcn/ui
- **Charts**: Recharts

### Database Schema

**Collections:**

1. **portfolios**
   - name, description
   - Relations: belongs to user

2. **accounts**
   - name, type (bank/credit), institution, balance
   - credit_limit, available_credit (for credit cards)
   - Relations: belongs to user and portfolio

3. **transactions**
   - amount, description, category, date, type (income/expense)
   - Relations: belongs to account

### Project Structure

```
cashmere/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── accounts/          # Accounts page
│   └── transactions/      # Transactions page
├── components/            # Shared UI components
│   ├── ui/               # Base UI components (shadcn)
│   └── layout/           # Layout components
├── domains/               # Domain-specific code
│   ├── account/          # Account domain
│   ├── portfolio/        # Portfolio domain
│   └── transaction/      # Transaction domain
├── hooks/                 # React hooks
├── lib/                   # Utility libraries
│   └── contexts/         # React contexts
└── pocketbase/           # PocketBase files
    ├── pb_migrations/    # Database migrations
    └── pb_hooks/         # Server-side hooks (seed script)
```

## Development

### Adding a New Account

1. Select your active portfolio from the sidebar switcher
2. Go to Accounts page
3. Click "Add Account"
4. Fill in account details (automatically assigned to active portfolio)

### Adding a Transaction

1. Select your active portfolio
2. Go to Transactions or Dashboard
3. Click "Add Transaction"
4. Select account (filtered by active portfolio)
5. Enter transaction details

### Switching Portfolios

Use the portfolio switcher in the sidebar to switch between portfolios. All views (dashboard, accounts, transactions) will automatically filter to show only data from the active portfolio.

## Data Management

### Resetting Data

```bash
# Complete wipe and reseed
docker compose down -v
docker compose up --build

# Just reseed (keeps other data)
docker exec cashmere_pocketbase rm /pb/pb_data/.seeded
docker compose restart pocketbase
```

### Custom Seed Data

Edit `pocketbase/pb_hooks/seed.pb.js` to customize the seed data.

## Troubleshooting

**PocketBase won't start:**
- Check logs: `docker compose logs pocketbase`
- Rebuild: `docker compose up --build --force-recreate`

**Database not seeding:**
- Check logs: `docker compose logs pocketbase`
- Clean start: `docker compose down -v && docker compose up --build`

**"Failed to fetch" errors:**
- Ensure PocketBase is running: `curl http://localhost:8119/api/health`
- Check `NEXT_PUBLIC_POCKETBASE_URL` in `.env.local`
