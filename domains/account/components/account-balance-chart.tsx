"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Nov",
    checking: 2500,
    savings: 7000,
    credit: -800,
    investment: 12000,
  },
  {
    name: "Dec",
    checking: 2800,
    savings: 7500,
    credit: -1100,
    investment: 13500,
  },
  {
    name: "Jan",
    checking: 3200,
    savings: 8000,
    credit: -950,
    investment: 14200,
  },
  {
    name: "Feb",
    checking: 3000,
    savings: 8200,
    credit: -1300,
    investment: 14800,
  },
  {
    name: "Mar",
    checking: 3400,
    savings: 8300,
    credit: -1100,
    investment: 15200,
  },
  {
    name: "Apr",
    checking: 3580,
    savings: 8500,
    credit: -1250,
    investment: 15750,
  },
];

export function AccountBalanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="checking"
          name="Checking"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="savings"
          name="Savings"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="investment"
          name="Investment"
          stroke="var(--chart-3)"
          fill="var(--chart-3)"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="credit"
          name="Credit Card"
          stroke="var(--chart-4)"
          fill="var(--chart-4)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
