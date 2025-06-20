import type { Account } from "@/types/account.types";
import type { AccountFilters } from "../../types";
import { accounts as defaultAccounts } from "@/data/accounts";

export class LocalAccountStorage {
  private accounts: Account[];

  constructor() {
    this.accounts = [...defaultAccounts];
  }

  async getAccounts(filters?: AccountFilters): Promise<Account[]> {
    let filteredAccounts = [...this.accounts];

    if (filters) {
      if (filters.type) {
        filteredAccounts = filteredAccounts.filter(
          (account) => account.type === filters.type
        );
      }

      if (filters.institution) {
        filteredAccounts = filteredAccounts.filter((account) =>
          account.institution
            .toLowerCase()
            .includes(filters.institution?.toLowerCase() || "")
        );
      }

      if (filters.minBalance !== undefined) {
        filteredAccounts = filteredAccounts.filter(
          (account) => account.balance >= (filters.minBalance ?? 0)
        );
      }

      if (filters.maxBalance !== undefined) {
        filteredAccounts = filteredAccounts.filter(
          (account) =>
            account.balance <= (filters.maxBalance ?? Number.MAX_VALUE)
        );
      }
    }

    return filteredAccounts;
  }

  async getAccount(id: string): Promise<Account | null> {
    const account = this.accounts.find((acc) => acc.id === id);
    return account || null;
  }

  async createAccount(
    accountData: Omit<Account, "id" | "lastUpdated">
  ): Promise<Account> {
    const newAccount: Account = {
      ...accountData,
      id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString(),
    };

    this.accounts.push(newAccount);
    return newAccount;
  }

  async updateAccount(
    id: string,
    updates: Partial<Account>
  ): Promise<Account | null> {
    const index = this.accounts.findIndex((acc) => acc.id === id);

    if (index === -1) {
      return null;
    }

    this.accounts[index] = {
      ...this.accounts[index],
      ...updates,
      id, // Ensure ID doesn't change
      lastUpdated: new Date().toISOString(),
    };

    return this.accounts[index];
  }

  async deleteAccount(id: string): Promise<boolean> {
    const index = this.accounts.findIndex((acc) => acc.id === id);

    if (index === -1) {
      return false;
    }

    this.accounts.splice(index, 1);
    return true;
  }
}
