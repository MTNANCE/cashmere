export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName?: string; // Populated from account relation
  amount: number;
  description: string;
  category?: string;
  date: string;
  type: TransactionType;
  created: string;
  updated: string;
}

export interface TransactionFilters {
  accountId?: string;
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateTransactionData {
  accountId: string;
  amount: number;
  description: string;
  category?: string;
  date: string;
  type: TransactionType;
}

