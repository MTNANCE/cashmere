"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface BudgetResult {
  needs: number;
  wants: number;
  savings: number;
}

const chartConfig = {
  needs: {
    label: "Needs (50%)",
    color: "hsl(var(--chart-1))",
  },
  wants: {
    label: "Wants (30%)",
    color: "hsl(var(--chart-2))",
  },
  savings: {
    label: "Savings (20%)",
    color: "hsl(var(--chart-3))",
  },
};

export default function Budget503020Page() {
  const [income, setIncome] = useState<string>("");
  const [currency, setCurrency] = useState<string>("kr");
  const [results, setResults] = useState<BudgetResult | null>(null);

  const calculateBudget = () => {
    const monthlyIncome = Number.parseFloat(income);
    if (Number.isNaN(monthlyIncome) || monthlyIncome <= 0) {
      alert("Please enter a valid income amount");
      return;
    }

    const budgetResults: BudgetResult = {
      needs: monthlyIncome * 0.5,
      wants: monthlyIncome * 0.3,
      savings: monthlyIncome * 0.2,
    };

    setResults(budgetResults);
  };

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartData = results ? [
    {
      name: "Needs",
      value: results.needs,
      fill: chartConfig.needs.color,
    },
    {
      name: "Wants", 
      value: results.wants,
      fill: chartConfig.wants.color,
    },
    {
      name: "Savings",
      value: results.savings,
      fill: chartConfig.savings.color,
    },
  ] : [];

  return (
    <PageLayout title="50-30-20 Budget Calculator" activeMenuItem="budget-50-30-20">
      <div className="space-y-6">
        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>About the 50-30-20 Budget Rule</CardTitle>
            <CardDescription>
              The 50-30-20 rule is a simple budgeting method that allocates your after-tax income into three categories:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">50% - Needs</h3>
                <p className="text-sm text-muted-foreground">
                  Essential expenses like rent, groceries, utilities, minimum debt payments, and transportation.
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">30% - Wants</h3>
                <p className="text-sm text-muted-foreground">
                  Non-essential expenses like dining out, entertainment, hobbies, and discretionary shopping.
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">20% - Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Emergency fund, retirement contributions, debt repayment, and other financial goals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Calculate Your Budget</CardTitle>
            <CardDescription>
              Enter your monthly after-tax income to see your budget breakdown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="income" className="block text-sm font-medium mb-2">
                  Monthly After-Tax Income
                </label>
                <Input
                  id="income"
                  type="number"
                  placeholder="Enter your monthly income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="w-32">
                <label htmlFor="currency" className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kr">NOK (kr)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateBudget} className="mb-0">
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table Results */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
                <CardDescription>
                  Your recommended monthly budget allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Needs</TableCell>
                      <TableCell>50%</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(results.needs)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Wants</TableCell>
                      <TableCell>30%</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(results.wants)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Savings</TableCell>
                      <TableCell>20%</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(results.savings)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">100%</TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {formatCurrency(results.needs + results.wants + results.savings)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Visual Breakdown</CardTitle>
                <CardDescription>
                  Pie chart representation of your budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Getting Started</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Track your current spending for a month</li>
                  <li>• List all your fixed expenses first</li>
                  <li>• Be realistic about your categorizations</li>
                  <li>• Adjust percentages if needed based on your situation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Making it Work</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Review and adjust monthly</li>
                  <li>• Use budgeting apps to track expenses</li>
                  <li>• Automate savings to pay yourself first</li>
                  <li>• Be flexible - life happens!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
