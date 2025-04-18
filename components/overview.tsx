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

const data = [
  {
    name: "Jan",
    income: 4000,
    expenses: 2400,
  },
  {
    name: "Feb",
    income: 3500,
    expenses: 2210,
  },
  {
    name: "Mar",
    income: 4500,
    expenses: 2900,
  },
  {
    name: "Apr",
    income: 4750,
    expenses: 2890,
  },
  {
    name: "May",
    income: 0,
    expenses: 0,
  },
  {
    name: "Jun",
    income: 0,
    expenses: 0,
  },
];

export function Overview() {
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
