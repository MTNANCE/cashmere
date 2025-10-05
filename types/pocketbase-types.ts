/**
 * PocketBase Collection Types
 * These match the schema in your PocketBase instance
 */

import type { RecordModel } from 'pocketbase';
import type { AccountType } from '@/domains/account/types';

// Base record with PocketBase fields
export interface BaseRecord extends RecordModel {
  id: string;
  created: string;
  updated: string;
}

// Account record from PocketBase
export interface AccountRecord extends BaseRecord {
  name: string;
  type: AccountType;
  institution: string;
  balance: number;
  credit_limit?: number;
  available_credit?: number;
  user: string; // ID reference to user
}

// Transaction record from PocketBase (for future use)
export interface TransactionRecord extends BaseRecord {
  account: string; // ID reference to account
  amount: number;
  description: string;
  category?: string;
  date: string;
  type: 'income' | 'expense';
}

// Collection names with type safety
export enum PBCollections {
  ACCOUNTS = 'accounts',
  TRANSACTIONS = 'transactions',
}

