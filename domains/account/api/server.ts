import type { Account, AccountFilters } from '../types';
import type { AccountRecord } from '@/types/pocketbase-types';
import { PBCollections } from '@/types/pocketbase-types';
import type PocketBase from 'pocketbase';

// Convert PocketBase record to our Account type
function recordToAccount(record: AccountRecord): Account {
  return {
    id: record.id,
    name: record.name,
    type: record.type,
    institution: record.institution,
    balance: record.balance,
    creditLimit: record.credit_limit,
    availableCredit: record.available_credit,
    lastUpdated: record.updated,
  };
}

// Convert our Account type to PocketBase record data
function accountToRecordData(account: Omit<Account, 'id' | 'lastUpdated'>) {
  return {
    name: account.name,
    type: account.type,
    institution: account.institution,
    balance: account.balance,
    credit_limit: account.creditLimit,
    available_credit: account.availableCredit,
  };
}

// Build PocketBase filter string from AccountFilters
function buildFilterString(filters?: AccountFilters): string {
  if (!filters) return '';
  
  const filterParts: string[] = [];
  
  if (filters.type) {
    filterParts.push(`type = "${filters.type}"`);
  }
  
  if (filters.institution) {
    filterParts.push(`institution ~ "${filters.institution}"`);
  }
  
  if (filters.minBalance !== undefined) {
    filterParts.push(`balance >= ${filters.minBalance}`);
  }
  
  if (filters.maxBalance !== undefined) {
    filterParts.push(`balance <= ${filters.maxBalance}`);
  }
  
  return filterParts.join(' && ');
}

export const accountService = {
  // Get all accounts with optional filters
  async getAccounts(pb: PocketBase, filters?: AccountFilters): Promise<Account[]> {
    try {
      const records = await pb.collection(PBCollections.ACCOUNTS).getFullList<AccountRecord>();
      
      // Apply filters client-side
      let filteredRecords = records;
      if (filters?.type) {
        filteredRecords = filteredRecords.filter(r => r.type === filters.type);
      }
      if (filters?.institution) {
        const institution = filters.institution;
        filteredRecords = filteredRecords.filter(r => r.institution.includes(institution));
      }
      if (filters?.minBalance !== undefined) {
        const minBalance = filters.minBalance;
        filteredRecords = filteredRecords.filter(r => r.balance >= minBalance);
      }
      if (filters?.maxBalance !== undefined) {
        const maxBalance = filters.maxBalance;
        filteredRecords = filteredRecords.filter(r => r.balance <= maxBalance);
      }
      
      return filteredRecords.map(recordToAccount);
    } catch (error) {
      console.error('Error fetching accounts from PocketBase:', error);
      throw error;
    }
  },

  // Get single account by ID
  async getAccount(pb: PocketBase, id: string): Promise<Account | null> {
    try {
      const record = await pb.collection(PBCollections.ACCOUNTS).getOne<AccountRecord>(id);
      return recordToAccount(record);
    } catch (error) {
      console.error('Error fetching account from PocketBase:', error);
      return null;
    }
  },

  // Create new account
  async createAccount(pb: PocketBase, accountData: Omit<Account, 'id' | 'lastUpdated'>): Promise<Account> {
    try {
      const recordData = {
        ...accountToRecordData(accountData),
        user: pb.authStore.record?.id, // Add authenticated user's ID
      };
      const record = await pb.collection(PBCollections.ACCOUNTS).create<AccountRecord>(recordData);
      return recordToAccount(record);
    } catch (error) {
      console.error('Error creating account in PocketBase:', error);
      throw error;
    }
  },

  // Update existing account
  async updateAccount(pb: PocketBase, id: string, updates: Partial<Account>): Promise<Account | null> {
    try {
      const recordData = accountToRecordData(updates as Omit<Account, 'id' | 'lastUpdated'>);
      const record = await pb.collection(PBCollections.ACCOUNTS).update<AccountRecord>(id, recordData);
      return recordToAccount(record);
    } catch (error) {
      console.error('Error updating account in PocketBase:', error);
      return null;
    }
  },

  // Delete account
  async deleteAccount(pb: PocketBase, id: string): Promise<boolean> {
    try {
      await pb.collection(PBCollections.ACCOUNTS).delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting account from PocketBase:', error);
      return false;
    }
  },
};