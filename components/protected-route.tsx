"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting...
  }

  return <>{children}</>;
}

