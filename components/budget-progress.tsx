import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const budgetCategories = [
  {
    id: "b1",
    name: "Housing",
    budgeted: 1500,
    spent: 1500,
  },
  {
    id: "b2",
    name: "Food & Dining",
    budgeted: 600,
    spent: 485.75,
  },
  {
    id: "b3",
    name: "Transportation",
    budgeted: 300,
    spent: 245.5,
  },
  {
    id: "b4",
    name: "Entertainment",
    budgeted: 200,
    spent: 175.25,
  },
  {
    id: "b5",
    name: "Utilities",
    budgeted: 350,
    spent: 320.5,
  },
  {
    id: "b6",
    name: "Shopping",
    budgeted: 200,
    spent: 163.15,
  },
];

export function BudgetProgress() {
  const totalBudgeted = budgetCategories.reduce(
    (sum, category) => sum + category.budgeted,
    0
  );
  const totalSpent = budgetCategories.reduce(
    (sum, category) => sum + category.spent,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget Overview</CardTitle>
          <CardDescription>
            Total spent: ${totalSpent.toFixed(2)} of ${totalBudgeted.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={(totalSpent / totalBudgeted) * 100}
            className="h-2"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgetCategories.map((category) => {
          const percentSpent = (category.spent / category.budgeted) * 100;
          const isOverBudget = percentSpent > 100;

          return (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <span
                    className={`text-xs font-medium ${
                      isOverBudget ? "text-red-500" : ""
                    }`}
                  >
                    {percentSpent.toFixed(0)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress
                  value={Math.min(percentSpent, 100)}
                  className={`h-2 ${isOverBudget ? "bg-red-200" : ""}`}
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${category.spent.toFixed(2)}</span>
                  <span className="text-muted-foreground">
                    of ${category.budgeted.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
