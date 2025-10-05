"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountType } from "@/domains/account/types";

export function AccountSummary() {
  const { data: accounts, isLoading } = useAccounts();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
          <Card key={id}>
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!accounts?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No accounts found. Add your first account to get started!
      </div>
    );
  }

  // Calculate total assets (only positive balances)
  const totalAssets = accounts.reduce((sum, account) => {
    return account.type === AccountType.BANK ? sum + account.balance : sum;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{account.name}</CardTitle>
            <CardDescription>{account.institution}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${account.balance.toFixed(2)}
            </div>
            {account.type === AccountType.CREDIT && account.creditLimit && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Credit Used</span>
                  <span>
                    {Math.round((account.balance / account.creditLimit) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(account.balance / account.creditLimit) * 100}
                  className="h-2"
                />
              </div>
            )}
            {account.type === AccountType.BANK && totalAssets > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>% of Assets</span>
                  <span>
                    {Math.round((account.balance / totalAssets) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(account.balance / totalAssets) * 100}
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
