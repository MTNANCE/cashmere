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
import type { Account } from "@/types/account.types";

async function getAccounts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/accounts`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch accounts');
  }
  
  const data = await res.json();

  console.log(data);

  return data.accounts as Account[];
}

async function getBankAccounts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/accounts?type=bank`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch bank accounts');
  }
  
  const data = await res.json();
  return data.accounts as Account[];
}

async function getCreditAccounts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/accounts?type=credit`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch credit accounts');
  }
  
  const data = await res.json();
  return data.accounts as Account[];
}

export default async function AccountsPage() {
  const allAccounts = await getAccounts();
  const bankAccounts = await getBankAccounts();
  const creditAccounts = await getCreditAccounts();

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
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="bank">Bank Accounts</TabsTrigger>
            <TabsTrigger value="credit">Credit Cards</TabsTrigger>
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
                <div className="grid gap-4 md:grid-cols-2">
                  {bankAccounts.map((account) => (
                    <Card key={account.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {account.name}
                        </CardTitle>
                        <CardDescription>{account.institution}</CardDescription>
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
                <div className="grid gap-4 md:grid-cols-2">
                  {creditAccounts.map((account) => (
                    <Card key={account.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {account.name}
                        </CardTitle>
                        <CardDescription>{account.institution}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                          ${account.balance.toFixed(2)}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Available credit: ${account.availableCredit?.toFixed(2)}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
