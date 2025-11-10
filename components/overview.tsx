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
import { useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import { usePortfolioContext } from "@/lib/contexts/portfolio-context";

export function Overview() {
  const { activePortfolio } = usePortfolioContext();
  const { data: allAccounts = [] } = useAccounts();
  const { data: allTransactions = [] } = useTransactions();

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

  // Aggregate transactions by month (last 6 months)
  const data = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const months: Array<{ name: string; income: number; expenses: number }> = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const month = date.getMonth();

      const monthTransactions = portfolioTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        name: monthName,
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
      });
    }

    return months;
  }, [portfolioTransactions]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="income"
          name="Income"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          name="Expenses"
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
