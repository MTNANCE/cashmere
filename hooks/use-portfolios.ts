import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Portfolio, CreatePortfolioData, UpdatePortfolioData } from "@/domains/portfolio/types";
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

// GET: Fetch all portfolios
export function usePortfolios() {
  return useQuery({
    queryKey: queryKeys.portfolios,
    queryFn: async () => {
      const data = await fetchApi<{ portfolios: Portfolio[] }>("/api/portfolios");
      return data.portfolios;
    },
  });
}

// GET: Fetch single portfolio
export function usePortfolio(id: string) {
  return useQuery({
    queryKey: [...queryKeys.portfolios, id],
    queryFn: async () => {
      const data = await fetchApi<{ portfolio: Portfolio }>(`/api/portfolios/${id}`);
      return data.portfolio;
    },
    enabled: !!id, // Only fetch if ID exists
  });
}

// POST: Create new portfolio
export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPortfolio: CreatePortfolioData) => {
      const data = await fetchApi<{ portfolio: Portfolio }>("/api/portfolios", {
        method: "POST",
        body: JSON.stringify(newPortfolio),
      });
      return data.portfolio;
    },
    onSuccess: () => {
      // Invalidate portfolios list to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
    },
  });
}

// PUT: Update existing portfolio
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: UpdatePortfolioData & { id: string }) => {
      const data = await fetchApi<{ portfolio: Portfolio }>(`/api/portfolios/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      return data.portfolio;
    },
    onSuccess: (updatedPortfolio) => {
      // Update the specific portfolio in cache
      queryClient.setQueryData(
        [...queryKeys.portfolios, updatedPortfolio.id],
        updatedPortfolio
      );
      // Invalidate portfolios list
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
    },
  });
}

// DELETE: Remove portfolio
export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/api/portfolios/${id}`, {
        method: "DELETE",
      });
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: [...queryKeys.portfolios, deletedId] });
      // Invalidate portfolios list
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios });
    },
  });
}

