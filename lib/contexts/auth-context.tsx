"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import pb from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

interface AuthContextType {
  user: RecordModel | null;
  token: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    setUser(pb.authStore.record);
    setToken(pb.authStore.token);
    setIsLoading(false);

    // Set cookie if already authenticated
    if (pb.authStore.isValid) {
      document.cookie = `pb_auth=${pb.authStore.token}; path=/; max-age=604800; SameSite=Lax`;
    }

    // Listen for auth state changes
    const unsubscribe = pb.authStore.onChange((token, record) => {
      setUser(record);
      setToken(token);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await pb.collection("users").authWithPassword(email, password);
    setUser(authData.record);
    setToken(authData.token);
    
    // Manually set cookie for immediate server-side access
    document.cookie = `pb_auth=${authData.token}; path=/; max-age=604800; SameSite=Lax`;
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setToken("");
    
    // Clear the auth cookie
    document.cookie = 'pb_auth=; path=/; max-age=0';
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

