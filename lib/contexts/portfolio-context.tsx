"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePortfolios } from "@/hooks/use-portfolios";
import type { Portfolio } from "@/domains/portfolio/types";

interface PortfolioContextType {
  activePortfolio: Portfolio | null;
  setActivePortfolio: (portfolio: Portfolio | null) => void;
  portfolios: Portfolio[];
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { data: portfolios = [], isLoading } = usePortfolios();
  const [activePortfolio, setActivePortfolioState] = useState<Portfolio | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    // Don't do anything if portfolios haven't loaded yet
    if (isLoading || portfolios.length === 0) {
      return;
    }

    const stored = localStorage.getItem("active-portfolio");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate that this portfolio still exists
        const portfolio = portfolios.find((p) => p.id === parsed?.id);
        if (portfolio) {
          setActivePortfolioState(portfolio);
          return;
        }
      } catch (error) {
        console.error("Failed to parse stored portfolio:", error);
      }
    }
    
    // Default to first portfolio if none stored or stored is invalid
    if (portfolios.length > 0 && !activePortfolio) {
      setActivePortfolioState(portfolios[0]);
    }
  }, [portfolios, activePortfolio, isLoading]);

  // Save to localStorage when changed
  const setActivePortfolio = (portfolio: Portfolio | null) => {
    setActivePortfolioState(portfolio);
    if (portfolio) {
      localStorage.setItem("active-portfolio", JSON.stringify(portfolio));
    } else {
      localStorage.removeItem("active-portfolio");
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        activePortfolio,
        setActivePortfolio,
        portfolios,
        isLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolioContext must be used within a PortfolioProvider");
  }
  return context;
}

