import type { Account } from '@/types/account.types';
import { AccountType } from '@/types/account.types';

export const accounts: Account[] = [
  {
    id: "acc-001",
    name: "Checking Account",
    type: AccountType.BANK,
    institution: "Bank of America",
    balance: 3580.25,
    lastUpdated: "2023-08-01T12:00:00Z"
  },
  {
    id: "acc-002",
    name: "Savings Account",
    type: AccountType.BANK,
    institution: "Bank of America",
    balance: 8500.00,
    lastUpdated: "2023-08-01T12:00:00Z"
  },
  {
    id: "acc-003",
    name: "Credit Card",
    type: AccountType.CREDIT,
    institution: "Chase",
    balance: -1250.75,
    creditLimit: 5000.00,
    availableCredit: 3749.25,
    lastUpdated: "2023-08-01T12:00:00Z"
  },
  {
    id: "acc-004",
    name: "Rewards Credit Card",
    type: AccountType.CREDIT,
    institution: "American Express",
    balance: -450.33,
    creditLimit: 10000.00,
    availableCredit: 9549.67,
    lastUpdated: "2023-08-01T12:00:00Z"
  }
]; 