"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType, type CreateTransactionData } from "@/domains/transaction/types";
import type { Account } from "@/domains/account/types";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateTransactionData>({
    accountId: "",
    amount: 0,
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    type: TransactionType.EXPENSE,
  });

  // Fetch accounts for the dropdown
  const { data: accounts = [], isLoading: accountsLoading } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch("/api/accounts");
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await response.json();
      return data.accounts;
    },
  });

  // Set default account when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !formData.accountId) {
      setFormData(prev => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accounts, formData.accountId]);

  const createTransactionMutation = useMutation({
    mutationFn: async (data: CreateTransactionData) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create transaction");
      }

      const result = await response.json();
      return result.transaction;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      
      // Reset form and close dialog
      setFormData({
        accountId: accounts[0]?.id || "",
        amount: 0,
        description: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
        type: TransactionType.EXPENSE,
      });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert amount based on transaction type
    const amount = formData.type === TransactionType.EXPENSE 
      ? -Math.abs(formData.amount)
      : Math.abs(formData.amount);
    
    createTransactionMutation.mutate({
      ...formData,
      amount,
    });
  };

  const commonCategories = {
    [TransactionType.EXPENSE]: [
      "Food",
      "Transportation",
      "Utilities",
      "Shopping",
      "Entertainment",
      "Health & Fitness",
      "Bills",
      "Other",
    ],
    [TransactionType.INCOME]: [
      "Salary",
      "Freelance",
      "Investment",
      "Gift",
      "Refund",
      "Other",
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Record a new transaction for one of your accounts.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select
                value={formData.accountId}
                onValueChange={(value) =>
                  setFormData({ ...formData, accountId: value })
                }
                disabled={accountsLoading}
              >
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} - {account.institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TransactionType) =>
                  setFormData({ ...formData, type: value, category: "" })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Grocery shopping"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={Math.abs(formData.amount) || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: Number.parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter amount as positive number
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {commonCategories[formData.type].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTransactionMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTransactionMutation.isPending}>
              {createTransactionMutation.isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>

          {createTransactionMutation.isError && (
            <p className="text-sm text-red-500 mt-2">
              {createTransactionMutation.error.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

