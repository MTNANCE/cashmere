import type { Transaction, TransactionFilters, CreateTransactionData } from '../types';
import type { TransactionRecord } from '@/types/pocketbase-types';
import { PBCollections } from '@/types/pocketbase-types';
import type PocketBase from 'pocketbase';

// Convert PocketBase record to our Transaction type
function recordToTransaction(record: TransactionRecord, accountName?: string): Transaction {
  return {
    id: record.id,
    accountId: record.account,
    accountName,
    amount: record.amount,
    description: record.description,
    category: record.category,
    date: record.date,
    type: record.type,
    created: record.created,
    updated: record.updated,
  };
}

// Convert our Transaction type to PocketBase record data
function transactionToRecordData(transaction: CreateTransactionData) {
  return {
    account: transaction.accountId,
    amount: transaction.amount,
    description: transaction.description,
    category: transaction.category,
    date: transaction.date,
    type: transaction.type,
  };
}

export const transactionService = {
  // Get all transactions with optional filters
  async getTransactions(pb: PocketBase, filters?: TransactionFilters): Promise<Transaction[]> {
    try {
      // Build filter query with expand to get account info
      const records = await pb.collection(PBCollections.TRANSACTIONS).getFullList<TransactionRecord>({
        sort: '-date',
        expand: 'account',
      });
      
      // Apply filters client-side
      let filteredRecords = records;
      
      if (filters?.accountId) {
        filteredRecords = filteredRecords.filter(r => r.account === filters.accountId);
      }
      
      if (filters?.type) {
        filteredRecords = filteredRecords.filter(r => r.type === filters.type);
      }
      
      if (filters?.category) {
        const category = filters.category;
        filteredRecords = filteredRecords.filter(r => r.category?.includes(category));
      }
      
      if (filters?.startDate) {
        const startDate = filters.startDate;
        filteredRecords = filteredRecords.filter(r => r.date >= startDate);
      }
      
      if (filters?.endDate) {
        const endDate = filters.endDate;
        filteredRecords = filteredRecords.filter(r => r.date <= endDate);
      }
      
      if (filters?.minAmount !== undefined) {
        const minAmount = filters.minAmount;
        filteredRecords = filteredRecords.filter(r => r.amount >= minAmount);
      }
      
      if (filters?.maxAmount !== undefined) {
        const maxAmount = filters.maxAmount;
        filteredRecords = filteredRecords.filter(r => r.amount <= maxAmount);
      }
      
      return filteredRecords.map(record => {
        // Extract account name from expanded relation
        const accountName = record.expand?.account?.name;
        return recordToTransaction(record, accountName);
      });
    } catch (error) {
      console.error('Error fetching transactions from PocketBase:', error);
      throw error;
    }
  },

  // Get single transaction by ID
  async getTransaction(pb: PocketBase, id: string): Promise<Transaction | null> {
    try {
      const record = await pb.collection(PBCollections.TRANSACTIONS).getOne<TransactionRecord>(id, {
        expand: 'account',
      });
      const accountName = record.expand?.account?.name;
      return recordToTransaction(record, accountName);
    } catch (error) {
      console.error('Error fetching transaction from PocketBase:', error);
      return null;
    }
  },

  // Create new transaction
  async createTransaction(pb: PocketBase, transactionData: CreateTransactionData): Promise<Transaction> {
    try {
      const recordData = transactionToRecordData(transactionData);
      
      const record = await pb.collection(PBCollections.TRANSACTIONS).create<TransactionRecord>(recordData, {
        expand: 'account',
      });
      
      const accountName = record.expand?.account?.name;
      return recordToTransaction(record, accountName);
    } catch (error) {
      console.error('Error creating transaction in PocketBase:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('PocketBase error details:', JSON.stringify(error.response, null, 2));
      }
      throw error;
    }
  },

  // Update existing transaction
  async updateTransaction(pb: PocketBase, id: string, updates: Partial<CreateTransactionData>): Promise<Transaction | null> {
    try {
      const recordData = transactionToRecordData(updates as CreateTransactionData);
      const record = await pb.collection(PBCollections.TRANSACTIONS).update<TransactionRecord>(id, recordData, {
        expand: 'account',
      });
      const accountName = record.expand?.account?.name;
      return recordToTransaction(record, accountName);
    } catch (error) {
      console.error('Error updating transaction in PocketBase:', error);
      return null;
    }
  },

  // Delete transaction
  async deleteTransaction(pb: PocketBase, id: string): Promise<boolean> {
    try {
      await pb.collection(PBCollections.TRANSACTIONS).delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting transaction from PocketBase:', error);
      return false;
    }
  },
};

