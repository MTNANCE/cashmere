"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { AccountSummary } from "@/domains/account/components";
import { BudgetProgress } from "@/components/budget-progress";
import { PageLayout } from "@/components/layout/page-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { usePortfolioContext } from "@/lib/contexts/portfolio-context";
import { useAccounts } from "@/hooks/use-accounts";
import { useTransactions } from "@/hooks/use-transactions";
import { useMemo } from "react";

export default function Page() {
  const { activePortfolio } = usePortfolioContext();
  const { data: allAccounts = [] } = useAccounts();
  const { data: allTransactions = [] } = useTransactions();

  // Filter accounts by active portfolio
  const portfolioAccounts = useMemo(() => {
    if (!activePortfolio) return allAccounts;
    return allAccounts.filter(account => account.portfolioId === activePortfolio.id);
  }, [allAccounts, activePortfolio]);

  // Filter transactions by portfolio accounts
  const portfolioTransactions = useMemo(() => {
    const accountIds = new Set(portfolioAccounts.map(a => a.id));
    return allTransactions.filter(t => accountIds.has(t.accountId));
  }, [allTransactions, portfolioAccounts]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalBalance = portfolioAccounts.reduce((sum, account) => sum + account.balance, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = portfolioTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;

    return { totalBalance, income, expenses, savings };
  }, [portfolioAccounts, portfolioTransactions]);

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {activePortfolio?.name || "All Portfolios"} - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {portfolioAccounts.length} account{portfolioAccounts.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${stats.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -${stats.expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.savings >= 0 ? '+' : ''}${stats.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your most recent transactions across all accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTransactions />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="accounts" className="space-y-4">
            <AccountSummary />
          </TabsContent>
          <TabsContent value="budget" className="space-y-4">
            <BudgetProgress />
          </TabsContent>
        </Tabs>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
