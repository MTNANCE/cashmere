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
  lastUpdated: string;
}
