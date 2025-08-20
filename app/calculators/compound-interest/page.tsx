"use client";

import { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface CompoundData {
  period: number;
  balance: number;
  periodLabel: string;
  totalContributions: number;
  totalInterest: number;
}

const chartConfig = {
  balance: {
    label: "Total Balance",
    color: "hsl(var(--chart-1))",
  },
  contributions: {
    label: "Total Contributions", 
    color: "hsl(var(--chart-2))",
  },
  interest: {
    label: "Interest Earned",
    color: "hsl(var(--chart-3))",
  },
};

export default function CompoundInterestPage() {
  const [startingCapital, setStartingCapital] = useState<string>("");
  const [annualGrowthRate, setAnnualGrowthRate] = useState<string>("6");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("0");
  const [currency, setCurrency] = useState<string>("kr");
  const [timeView, setTimeView] = useState<"months" | "years">("years");
  const [maxPeriods, setMaxPeriods] = useState<number>(30);
  const [selectedRange, setSelectedRange] = useState<string>("max");

  const calculateCompoundInterest = useMemo(() => {
    const principal = Number.parseFloat(startingCapital) || 0;
    const rate = Number.parseFloat(annualGrowthRate) / 100 || 0;
    const monthly = Number.parseFloat(monthlyContribution) || 0;
    
    if (principal < 0 || rate < 0) return [];

    const periods = timeView === "months" ? maxPeriods : maxPeriods * 12;
    const periodRate = rate / 12; // Monthly rate
    const data: CompoundData[] = [];

    for (let period = 0; period <= periods; period++) {
      // Calculate compound interest with monthly contributions
      let balance = principal;
      let totalContributions = principal;
      
      if (period > 0) {
        // Formula for compound interest with regular contributions
        // Final amount = P(1+r)^n + PMT[((1+r)^n - 1) / r]
        const compoundPrincipal = principal * (1 + periodRate) ** period;
        const compoundContributions = monthly > 0 
          ? monthly * ((1 + periodRate) ** period - 1) / periodRate 
          : 0;
        
        balance = compoundPrincipal + compoundContributions;
        totalContributions = principal + (monthly * period);
      }

      const totalInterest = balance - totalContributions;
      
      const periodLabel = timeView === "months" 
        ? `${period}m`
        : period % 12 === 0 
          ? `${period / 12}y`
          : `${Math.floor(period / 12)}y ${period % 12}m`;

      data.push({
        period,
        balance,
        periodLabel,
        totalContributions,
        totalInterest,
      });
    }

    return data;
  }, [startingCapital, annualGrowthRate, monthlyContribution, timeView, maxPeriods]);

  const getRangeOptions = useMemo(() => {
    const maxMonths = timeView === "months" ? maxPeriods : maxPeriods * 12;
    const options: { label: string; value: string; periods: number }[] = [];
    
    // Add month options
    if (maxMonths >= 1) options.push({ label: "1M", value: "1m", periods: 1 });
    if (maxMonths >= 3) options.push({ label: "3M", value: "3m", periods: 3 });
    if (maxMonths >= 6) options.push({ label: "6M", value: "6m", periods: 6 });
    if (maxMonths >= 12) options.push({ label: "1Y", value: "1y", periods: 12 });
    if (maxMonths >= 36) options.push({ label: "3Y", value: "3y", periods: 36 });
    if (maxMonths >= 60) options.push({ label: "5Y", value: "5y", periods: 60 });
    if (maxMonths >= 120) options.push({ label: "10Y", value: "10y", periods: 120 });
    if (maxMonths >= 300) options.push({ label: "25Y", value: "25y", periods: 300 });
    
    options.push({ label: "MAX", value: "max", periods: maxMonths });
    
    return options;
  }, [maxPeriods, timeView]);

  const filteredChartData = useMemo(() => {
    if (selectedRange === "max") return calculateCompoundInterest;
    
    const selectedOption = getRangeOptions.find(opt => opt.value === selectedRange);
    if (!selectedOption) return calculateCompoundInterest;
    
    const endIndex = selectedOption.periods;
    return calculateCompoundInterest.slice(0, endIndex + 1);
  }, [calculateCompoundInterest, selectedRange, getRangeOptions]);

  const formatCurrency = (amount: number) => {
    return `${currency} ${amount.toLocaleString('nb-NO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const finalBalance = calculateCompoundInterest[calculateCompoundInterest.length - 1];

  return (
    <PageLayout title="Compound Interest Calculator" activeMenuItem="compound-interest">
      <div className="space-y-6">
        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>The Power of Compound Interest</CardTitle>
            <CardDescription>
              Compound interest is the eighth wonder of the world. Visualize how your money grows exponentially over time through the magic of compounding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Start Early</h3>
                <p className="text-sm text-muted-foreground">
                  Time is your greatest asset. Starting early gives compound interest more time to work its magic.
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Stay Consistent</h3>
                <p className="text-sm text-muted-foreground">
                  Regular contributions, even small ones, can significantly boost your long-term wealth.
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Be Patient</h3>
                <p className="text-sm text-muted-foreground">
                  The exponential growth effect becomes more pronounced over longer time periods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Parameters</CardTitle>
            <CardDescription>
              Enter your investment details to see the power of compound growth.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="starting-capital" className="block text-sm font-medium mb-2">
                  Starting Capital
                </label>
                <Input
                  id="starting-capital"
                  type="number"
                  placeholder="100000"
                  value={startingCapital}
                  onChange={(e) => setStartingCapital(e.target.value)}
                  min="0"
                  step="1000"
                />
              </div>
              
              <div>
                <label htmlFor="growth-rate" className="block text-sm font-medium mb-2">
                  Annual Growth Rate (%)
                </label>
                <Input
                  id="growth-rate"
                  type="number"
                  placeholder="6"
                  value={annualGrowthRate}
                  onChange={(e) => setAnnualGrowthRate(e.target.value)}
                  min="0"
                  max="50"
                  step="0.1"
                />
              </div>

              <div>
                <label htmlFor="monthly-contribution" className="block text-sm font-medium mb-2">
                  Monthly Contribution
                </label>
                <Input
                  id="monthly-contribution"
                  type="number"
                  placeholder="5000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  min="0"
                  step="500"
                />
              </div>

              <div>
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
            </div>
          </CardContent>
        </Card>

        {/* Time Period Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Time Period View</CardTitle>
            <CardDescription>
              Choose how to view your investment timeline and adjust the maximum period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div>
                <label htmlFor="view-mode" className="block text-sm font-medium mb-2">
                  View Mode
                </label>
                <Tabs value={timeView} onValueChange={(value) => setTimeView(value as "months" | "years")}>
                  <TabsList id="view-mode">
                    <TabsTrigger value="months">Months</TabsTrigger>
                    <TabsTrigger value="years">Years</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex-1">
                <label htmlFor="max-periods" className="block text-sm font-medium mb-2">
                  Maximum {timeView === "months" ? "Months" : "Years"}
                  {timeView === "months" && maxPeriods > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      (~{(maxPeriods / 12).toFixed(1)} years)
                    </span>
                  )}
                </label>
                <Input
                  id="max-periods"
                  type="number"
                  value={maxPeriods}
                  onChange={(e) => {
                    const newMax = Number.parseInt(e.target.value, 10) || 30;
                    setMaxPeriods(newMax);
                    setSelectedRange("max");
                  }}
                  min={timeView === "months" ? "12" : "5"}
                  max={timeView === "months" ? "600" : "50"}
                  step="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {finalBalance && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Final Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(finalBalance.balance)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  After {maxPeriods} {timeView}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(finalBalance.totalContributions)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Money you invested
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Interest Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(finalBalance.totalInterest)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Compound growth
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart */}
        {calculateCompoundInterest.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Growth Visualization</CardTitle>
              <CardDescription>
                Watch your investment grow exponentially over time. Use the time range buttons below to focus on specific periods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChartContainer
                config={chartConfig}
                className="h-[400px] w-full"
              >
                <LineChart data={filteredChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="periodLabel"
                    tick={{ fontSize: 12 }}
                    interval={Math.floor(filteredChartData.length / 8)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${currency} ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        formatCurrency(value as number),
                        name === "balance" ? "Total Balance" :
                        name === "totalContributions" ? "Total Contributions" :
                        "Interest Earned"
                      ]}
                    />}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke={chartConfig.balance.color}
                    strokeWidth={3}
                    dot={false}
                    name="balance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalContributions" 
                    stroke={chartConfig.contributions.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="totalContributions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalInterest" 
                    stroke={chartConfig.interest.color}
                    strokeWidth={2}
                    dot={false}
                    name="totalInterest"
                  />
                </LineChart>
              </ChartContainer>
              
              {/* Time Range Buttons */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-center">Time Range</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {getRangeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedRange === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRange(option.value)}
                      className="min-w-[3rem]"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Tips for Norwegians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Tax-Advantaged Accounts</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• BSU (Boligsparing for ungdom) - up to 25,000 kr/year</li>
                  <li>• IPS (Individuell pensjonsordning) - tax deductions</li>
                  <li>• Aksjesparekonto - 200,000 kr tax-free gains</li>
                  <li>• Consider global index funds</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Realistic Expectations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Norwegian stock market (OSEBX): ~6-8% historical</li>
                  <li>• Global diversification typically 5-7%</li>
                  <li>• Remember inflation (~2-3% annually)</li>
                  <li>• Past performance doesn't guarantee future results</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
