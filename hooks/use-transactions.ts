import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Transaction, TransactionFilters, CreateTransactionData } from "@/domains/transaction/types";
import { queryKeys } from "@/lib/query-client";

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

// GET: Fetch all transactions
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: [...queryKeys.transactions, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.accountId) params.append("accountId", filters.accountId);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.minAmount) params.append("minAmount", filters.minAmount.toString());
      if (filters?.maxAmount) params.append("maxAmount", filters.maxAmount.toString());

      const url = `/api/transactions${params.toString() ? `?${params}` : ""}`;
      const data = await fetchApi<{ transactions: Transaction[] }>(url);
      return data.transactions;
    },
  });
}

// GET: Fetch single transaction
export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: async () => {
      const data = await fetchApi<{ transaction: Transaction }>(`/api/transactions/${id}`);
      return data.transaction;
    },
    enabled: !!id, // Only fetch if ID exists
  });
}

// POST: Create new transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTransaction: CreateTransactionData) => {
      const data = await fetchApi<{ transaction: Transaction }>("/api/transactions", {
        method: "POST",
        body: JSON.stringify(newTransaction),
      });
      return data.transaction;
    },
    onSuccess: () => {
      // Invalidate transactions list to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      // Also invalidate accounts since balance may have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

// PATCH: Update existing transaction
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<CreateTransactionData> & { id: string }) => {
      const data = await fetchApi<{ transaction: Transaction }>(`/api/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      return data.transaction;
    },
    onSuccess: (updatedTransaction) => {
      // Update the specific transaction in cache
      queryClient.setQueryData(
        queryKeys.transaction(updatedTransaction.id),
        updatedTransaction
      );
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      // Also invalidate accounts since balance may have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

// DELETE: Remove transaction
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.transaction(deletedId) });
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      // Also invalidate accounts since balance may have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

