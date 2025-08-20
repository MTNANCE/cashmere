import type { Account, AccountFilters, AccountType } from '../types';
import { accounts as defaultAccounts } from '../data/accounts';



// Simple in-memory storage - just for demo/development
const runtimeAccounts: Account[] = [...defaultAccounts];

// Apply filters to accounts
function applyFilters(accounts: Account[], filters?: AccountFilters): Account[] {
  if (!filters) return accounts;
  
  return accounts.filter(account => {
    if (filters.type && account.type !== filters.type) return false;
    if (filters.institution && !account.institution.toLowerCase().includes(filters.institution.toLowerCase())) return false;
    if (filters.minBalance !== undefined && account.balance < filters.minBalance) return false;
    if (filters.maxBalance !== undefined && account.balance > filters.maxBalance) return false;
    return true;
  });
}

export const accountService = {
  // Get all accounts with optional filters
  getAccounts(filters?: AccountFilters): Account[] {
    return applyFilters(runtimeAccounts, filters);
  },

  // Get single account by ID
  getAccount(id: string): Account | null {
    return runtimeAccounts.find(account => account.id === id) || null;
  },

  // Create new account
  createAccount(accountData: Omit<Account, 'id' | 'lastUpdated'>): Account {
    const newAccount: Account = {
      ...accountData,
      id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString(),
    };
    
    runtimeAccounts.push(newAccount);
    return newAccount;
  },

  // Update existing account
  updateAccount(id: string, updates: Partial<Account>): Account | null {
    const index = runtimeAccounts.findIndex(account => account.id === id);
    
    if (index === -1) {
      return null;
    }
    
    runtimeAccounts[index] = {
      ...runtimeAccounts[index],
      ...updates,
      id, // Ensure ID doesn't change
      lastUpdated: new Date().toISOString(),
    };
    
    return runtimeAccounts[index];
  },

  // Delete account
  deleteAccount(id: string): boolean {
    const index = runtimeAccounts.findIndex(account => account.id === id);
    
    if (index === -1) {
      return false;
    }
    
    runtimeAccounts.splice(index, 1);
    return true;
  },
};