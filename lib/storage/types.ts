import type { Account } from "@/types/account.types";

import { AccountType } from "@/types/account.types";

export interface AccountFilters {
  type?: AccountType;
  institution?: string;
  minBalance?: number;
  maxBalance?: number;
}

export interface IDataSource {
  // Account operations
  getAccounts(filters?: AccountFilters): Promise<Account[]>;
  getAccount(id: string): Promise<Account | null>;
  createAccount(account: Omit<Account, "id" | "lastUpdated">): Promise<Account>;
  updateAccount(id: string, updates: Partial<Account>): Promise<Account | null>;
  deleteAccount(id: string): Promise<boolean>;
}

export enum DataSourceType {
  LOCAL = "local",
}

export interface DataSourceConfig {
  type: DataSourceType;
  // Reserved for future provider configurations
}
