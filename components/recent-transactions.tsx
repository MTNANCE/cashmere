"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/domains/transaction/types";

export function RecentTransactions() {
  const { data: allTransactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      return data.transactions;
    },
  });

  // Get the 5 most recent transactions
  const transactions = allTransactions.slice(0, 5);

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
                  transaction.amount > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {transaction.amount > 0 ? (
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
                  {transaction.category || "Uncategorized"} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "text-sm font-medium",
                transaction.amount > 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {transaction.amount > 0
                ? `+$${transaction.amount.toFixed(2)}`
                : `-$${Math.abs(transaction.amount).toFixed(2)}`}
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
