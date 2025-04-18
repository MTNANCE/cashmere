import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const accounts = [
  {
    id: "a1",
    name: "Checking Account",
    institution: "Bank of America",
    balance: 3580.25,
    type: "checking",
  },
  {
    id: "a2",
    name: "Savings Account",
    institution: "Bank of America",
    balance: 8500.0,
    type: "savings",
  },
  {
    id: "a3",
    name: "Credit Card",
    institution: "Chase",
    balance: -1250.75,
    limit: 5000,
    type: "credit",
  },
  {
    id: "a4",
    name: "Investment Account",
    institution: "Vanguard",
    balance: 15750.5,
    type: "investment",
  },
];

export function AccountSummary() {
  const totalAssets = accounts.reduce((sum, account) => {
    return account.balance > 0 ? sum + account.balance : sum;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{account.name}</CardTitle>
            <CardDescription>{account.institution}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {account.balance < 0 ? "-" : ""}$
              {Math.abs(account.balance).toFixed(2)}
            </div>
            {account.type === "credit" && account.limit && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Credit Used</span>
                  <span>
                    {Math.round(
                      (Math.abs(account.balance) / account.limit) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={(Math.abs(account.balance) / account.limit) * 100}
                  className="h-2"
                />
              </div>
            )}
            {account.type !== "credit" && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>% of Assets</span>
                  <span>
                    {Math.round((account.balance / totalAssets) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(account.balance / totalAssets) * 100}
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
