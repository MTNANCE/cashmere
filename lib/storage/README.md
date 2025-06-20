# Storage Architecture

This directory contains a modular storage architecture for your account data, currently supporting local in-memory storage.

## Current Provider

### 🏠 Local In-Memory Storage
- **Storage**: In-memory using imported TypeScript data
- **Description**: Simple in-memory storage that starts with data from `data/accounts.ts`
- **Use case**: Perfect for local development and prototyping
- **Setup**: No configuration needed - works automatically!

## Quick Start

Simply use the app - it automatically loads your default data from `data/accounts.ts` and keeps it in memory during the session.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Routes    │    │     Storage     │    │ In-Memory Data  │
│                 │    │   Providers     │    │                 │
│ /api/accounts   │───▶│                 │───▶│ data/accounts   │
│ /api/accounts/  │    │ LocalProvider   │    │     .ts         │
│      [id]       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Storage Factory │
                       │                 │
                       │ providers/      │
                       │   local/        │
                       │     accounts.ts │
                       │     index.ts    │
                       └─────────────────┘
```

## File Structure

```
lib/storage/
├── providers/
│   └── local/
│       ├── accounts.ts      # LocalAccountStorage class
│       ├── transactions.ts  # Future: LocalTransactionStorage
│       └── index.ts         # createLocalProvider() function
├── types.ts                 # Shared interfaces (IDataSource, etc.)
├── factory.ts               # DataSourceFactory + singleton
├── index.ts                 # Main exports
└── README.md               # This file
```

## Key Benefits

✅ **Organized by Provider**: Each provider has its own folder  
✅ **Separated by Entity**: accounts.ts, transactions.ts, etc.  
✅ **Small Focused Files**: Each file has a single responsibility  
✅ **Type-safe**: Full TypeScript support with proper interfaces  
✅ **Extensible**: Easy to add new providers and entities  
✅ **Clean**: Provider function directly composes storage methods (no proxy functions!)  

## Adding New Entities

1. Create `providers/local/transactions.ts` with `LocalTransactionStorage`
2. Add to `providers/local/index.ts`:
   ```typescript
   const transactionStorage = new LocalTransactionStorage();
   return {
     // ... account methods
     getTransactions: transactionStorage.getTransactions.bind(transactionStorage),
   };
   ```
3. Add transaction methods to `IDataSource` interface
4. Done! No proxy functions needed

## Adding New Providers

1. Create `providers/pocketbase/` folder
2. Create `accounts.ts`, `transactions.ts`, `index.ts` in that folder
3. Add to factory's `createDataSource` function
4. Add new provider type to `DataSourceType` enum

The interface-based architecture ensures your API routes work unchanged with any provider! 