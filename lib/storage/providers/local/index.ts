import type { IDataSource } from "../../types";
import { LocalAccountStorage } from "./accounts";

export function createLocalProvider(): IDataSource {
  const accountStorage = new LocalAccountStorage();
  return {
    // Account operations
    getAccounts: accountStorage.getAccounts.bind(accountStorage),
    getAccount: accountStorage.getAccount.bind(accountStorage),
    createAccount: accountStorage.createAccount.bind(accountStorage),
    updateAccount: accountStorage.updateAccount.bind(accountStorage),
    deleteAccount: accountStorage.deleteAccount.bind(accountStorage),
  };
}
