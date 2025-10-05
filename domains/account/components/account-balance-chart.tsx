"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountType } from "@/domains/account/types";

export function AccountBalanceChart() {
  const { data: accounts, isLoading } = useAccounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  if (!accounts?.length) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No accounts to display</p>
          <p className="text-sm mt-2">Add an account to see your balance overview</p>
        </div>
      </div>
    );
  }

  // Create chart data from current accounts
  const chartData = accounts.map((account) => ({
    name: account.name,
    balance: account.balance,
    type: account.type,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        <Legend />
        <Bar
          dataKey="balance"
          name="Balance"
          fill="var(--chart-1)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
