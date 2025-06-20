import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 3,
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryKeys = {
  accounts: ["accounts"] as const,
  account: (id: string) => ["account", id] as const,
};
