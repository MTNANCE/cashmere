export enum AccountType {
  BANK = 'bank',
  CREDIT = 'credit'
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  institution: string;
  balance: number;
  creditLimit?: number; // Only for credit accounts
  availableCredit?: number; // Only for credit accounts
  portfolioId: string;
  lastUpdated: string;
}

export interface AccountFilters {
  type?: AccountType;
  institution?: string;
  minBalance?: number;
  maxBalance?: number;
  portfolioId?: string;
}