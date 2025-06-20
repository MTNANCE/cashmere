"use client";

import { useState } from "react";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "@/hooks/use-accounts";
import type { Account } from "@/types/account.types";
import { AccountType } from "@/types/account.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountsExample() {
  const [newAccountName, setNewAccountName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // GET: Fetch accounts
  const { data: accounts, isLoading, error } = useAccounts();

  // POST: Create account mutation
  const createAccount = useCreateAccount();

  // PUT: Update account mutation
  const updateAccount = useUpdateAccount();

  // DELETE: Delete account mutation
  const deleteAccount = useDeleteAccount();

  const handleCreate = async () => {
    if (!newAccountName.trim()) return;

    createAccount.mutate(
      {
        name: newAccountName,
        type: AccountType.BANK,
        institution: "Sample Bank",
        balance: 0,
      },
      {
        onSuccess: () => {
          setNewAccountName("");
        },
        onError: (error) => {
          alert(`Failed to create account: ${error.message}`);
        },
      }
    );
  };

  const handleUpdate = async (account: Account) => {
    updateAccount.mutate(
      {
        id: account.id,
        name: editName,
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditName("");
        },
        onError: (error) => {
          alert(`Failed to update account: ${error.message}`);
        },
      }
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    deleteAccount.mutate(id, {
      onError: (error) => {
        alert(`Failed to delete account: ${error.message}`);
      },
    });
  };

  if (isLoading) return <div>Loading accounts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TanStack Query CRUD Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CREATE */}
          <div className="flex gap-2">
            <Input
              placeholder="New account name"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
            />
            <Button onClick={handleCreate} disabled={createAccount.isPending}>
              {createAccount.isPending ? "Creating..." : "Create Account"}
            </Button>
          </div>

          {/* READ & UPDATE & DELETE */}
          <div className="space-y-2">
            {accounts?.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-2 p-2 border rounded"
              >
                {editingId === account.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(account)}
                      disabled={updateAccount.isPending}
                    >
                      {updateAccount.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setEditName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">
                      {account.name} - ${account.balance}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(account.id);
                        setEditName(account.name);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(account.id)}
                      disabled={deleteAccount.isPending}
                    >
                      {deleteAccount.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
