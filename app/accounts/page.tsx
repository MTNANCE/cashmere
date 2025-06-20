"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSummary } from "@/components/account-summary";
import { AccountBalanceChart } from "@/components/account-balance-chart";
import { Plus } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountType } from "@/types/account.types";

export default function AccountsPage() {
  const {
    data: allAccounts,
    isLoading: allLoading,
    error: allError,
  } = useAccounts();
  const { data: bankAccounts, isLoading: bankLoading } = useAccounts({
    type: AccountType.BANK,
  });
  const { data: creditAccounts, isLoading: creditLoading } = useAccounts({
    type: AccountType.CREDIT,
  });

  // Handle loading states
  if (allLoading || bankLoading || creditLoading) {
    return (
      <PageLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
              <p className="text-muted-foreground">Loading your accounts...</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </PageLayout>
    );
  }

  // Handle error states
  const error = allError || bankError || creditError;
  if (error) {
    return (
      <PageLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
              <p className="text-red-500">
                Failed to load accounts: {error.message}
              </p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage your financial accounts
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All Accounts ({allAccounts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="bank">
              Bank Accounts ({bankAccounts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="credit">
              Credit Cards ({creditAccounts?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>
                  Overview of your account balances over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AccountBalanceChart />
              </CardContent>
            </Card>
            <AccountSummary />
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>
                  Your checking and savings accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!bankAccounts?.length ? (
                  <p className="text-muted-foreground text-center py-8">
                    No bank accounts found
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {bankAccounts.map((account) => (
                      <Card key={account.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            {account.name}
                          </CardTitle>
                          <CardDescription>
                            {account.institution}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            ${account.balance.toFixed(2)}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            View Transactions
                          </Button>
                          <Button size="sm">Transfer</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit">
            <Card>
              <CardHeader>
                <CardTitle>Credit Cards</CardTitle>
                <CardDescription>Your credit card accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {!creditAccounts?.length ? (
                  <p className="text-muted-foreground text-center py-8">
                    No credit cards found
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {creditAccounts.map((account) => (
                      <Card key={account.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            {account.name}
                          </CardTitle>
                          <CardDescription>
                            {account.institution}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-500">
                            ${account.balance.toFixed(2)}
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Available credit: $
                            {account.availableCredit?.toFixed(2)}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            View Transactions
                          </Button>
                          <Button size="sm">Pay Balance</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
