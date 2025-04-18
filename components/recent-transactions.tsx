import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    id: "t1",
    description: "Grocery Store",
    amount: -85.25,
    date: "Today",
    category: "Food",
  },
  {
    id: "t2",
    description: "Salary",
    amount: 4750.0,
    date: "Yesterday",
    category: "Income",
  },
  {
    id: "t3",
    description: "Electric Bill",
    amount: -120.5,
    date: "Apr 1",
    category: "Utilities",
  },
  {
    id: "t4",
    description: "Restaurant",
    amount: -45.8,
    date: "Mar 30",
    category: "Food",
  },
  {
    id: "t5",
    description: "Gas Station",
    amount: -38.25,
    date: "Mar 29",
    category: "Transportation",
  },
];

export function RecentTransactions() {
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
                  {transaction.category} • {transaction.date}
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
      <Button variant="outline" className="w-full">
        View all transactions
      </Button>
    </div>
  );
}
