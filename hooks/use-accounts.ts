import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Account } from "@/types/account.types";
import { queryKeys } from "@/lib/query-client";
import type { AccountFilters } from "@/lib/storage/types";

// Simple fetch wrapper - no over-engineering
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// GET: Fetch all accounts
export function useAccounts(filters?: AccountFilters) {
  return useQuery({
    queryKey: [...queryKeys.accounts, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append("type", filters.type);
      if (filters?.institution)
        params.append("institution", filters.institution);
      if (filters?.minBalance)
        params.append("minBalance", filters.minBalance.toString());
      if (filters?.maxBalance)
        params.append("maxBalance", filters.maxBalance.toString());

      const url = `/api/accounts${params.toString() ? `?${params}` : ""}`;
      const data = await fetchApi<{ accounts: Account[] }>(url);
      return data.accounts;
    },
  });
}

// GET: Fetch single account
export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: async () => {
      const data = await fetchApi<{ account: Account }>(`/api/accounts/${id}`);
      return data.account;
    },
    enabled: !!id, // Only fetch if ID exists
  });
}

// POST: Create new account
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAccount: Omit<Account, "id" | "lastUpdated">) => {
      const data = await fetchApi<{ account: Account }>("/api/accounts", {
        method: "POST",
        body: JSON.stringify(newAccount),
      });
      return data.account;
    },
    onSuccess: () => {
      // Invalidate accounts list to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

// PUT: Update existing account
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Account> & { id: string }) => {
      const data = await fetchApi<{ account: Account }>(`/api/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      return data.account;
    },
    onSuccess: (updatedAccount) => {
      // Update the specific account in cache
      queryClient.setQueryData(
        queryKeys.account(updatedAccount.id),
        updatedAccount
      );
      // Invalidate accounts list
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

// DELETE: Remove account
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/api/accounts/${id}`, {
        method: "DELETE",
      });
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.account(deletedId) });
      // Invalidate accounts list
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}
