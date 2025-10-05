"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { AccountType } from "@/domains/account/types";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AccountFormData {
  name: string;
  type: AccountType;
  institution: string;
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
}

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AccountFormData>({
    name: "",
    type: AccountType.BANK,
    institution: "",
    balance: 0,
  });

  const createAccountMutation = useMutation({
    mutationFn: async (data: AccountFormData) => {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create account");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      
      // Reset form and close dialog
      setFormData({
        name: "",
        type: AccountType.BANK,
        institution: "",
        balance: 0,
      });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAccountMutation.mutate(formData);
  };

  const isCreditCard = formData.type === AccountType.CREDIT;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Add a new bank account or credit card to track your finances.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                placeholder="e.g., Chase Checking"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Account Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: AccountType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AccountType.BANK}>Bank Account</SelectItem>
                  <SelectItem value={AccountType.CREDIT}>Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                placeholder="e.g., Chase, Bank of America"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="balance">
                {isCreditCard ? "Current Balance" : "Balance"}
              </Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.balance || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    balance: Number.parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            {isCreditCard && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.creditLimit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creditLimit: Number.parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="availableCredit">Available Credit</Label>
                  <Input
                    id="availableCredit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.availableCredit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableCredit: Number.parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createAccountMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createAccountMutation.isPending}>
              {createAccountMutation.isPending ? "Adding..." : "Add Account"}
            </Button>
          </DialogFooter>

          {createAccountMutation.isError && (
            <p className="text-sm text-red-500 mt-2">
              {createAccountMutation.error.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

