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

export default function AccountsPage() {
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
            <TabsTrigger value="investment">Investments</TabsTrigger>
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
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Checking Account
                      </CardTitle>
                      <CardDescription>Bank of America</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$3,580.25</div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Transactions
                      </Button>
                      <Button size="sm">Transfer</Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Savings Account
                      </CardTitle>
                      <CardDescription>Bank of America</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$8,500.00</div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Transactions
                      </Button>
                      <Button size="sm">Transfer</Button>
                    </CardFooter>
                  </Card>
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
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Credit Card</CardTitle>
                      <CardDescription>Chase</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-500">
                        -$1,250.75
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Available credit: $3,749.25
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Transactions
                      </Button>
                      <Button size="sm">Pay Balance</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="investment">
            <Card>
              <CardHeader>
                <CardTitle>Investment Accounts</CardTitle>
                <CardDescription>Your investment portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Investment Account
                      </CardTitle>
                      <CardDescription>Vanguard</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$15,750.50</div>
                      <div className="mt-2 text-sm text-green-500">
                        +$350.25 (2.3%) today
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Holdings
                      </Button>
                      <Button size="sm">Trade</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
