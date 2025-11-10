"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import { usePortfolioContext } from "@/lib/contexts/portfolio-context";

export function RecentTransactions() {
  const { activePortfolio } = usePortfolioContext();
  const { data: allAccounts = [] } = useAccounts();
  const { data: allTransactions = [], isLoading } = useTransactions();

  // Filter transactions by active portfolio
  const portfolioTransactions = useMemo(() => {
    if (!activePortfolio) return allTransactions;
    
    const portfolioAccountIds = new Set(
      allAccounts
        .filter(account => account.portfolioId === activePortfolio.id)
        .map(account => account.id)
    );
    
    return allTransactions.filter(t => portfolioAccountIds.has(t.accountId));
  }, [allTransactions, allAccounts, activePortfolio]);

  // Get the 5 most recent transactions
  const transactions = portfolioTransactions.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-muted-foreground">No transactions found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  transaction.type === 'income'
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium leading-none">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.accountName || "Unknown"} • {transaction.category || "Uncategorized"} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "text-sm font-medium",
                transaction.type === 'income' ? "text-green-600" : "text-red-600"
              )}
            >
              {transaction.type === 'income'
                ? `+$${transaction.amount.toFixed(2)}`
                : `-$${transaction.amount.toFixed(2)}`}
            </div>
          </div>
        ))}
      </div>
      <Link href="/transactions">
        <Button variant="outline" className="w-full">
          View all transactions
        </Button>
      </Link>
    </div>
  );
}
