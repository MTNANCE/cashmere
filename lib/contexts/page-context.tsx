"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export type BreadcrumbItem = {
  href?: string;
  label: string;
  current?: boolean;
};

type PageContextType = {
  breadcrumbItems: BreadcrumbItem[];
  setBreadcrumbItems: (items: BreadcrumbItem[]) => void;
  activeMenuItem: string;
};

const defaultBreadcrumbs: BreadcrumbItem[] = [
  { label: "Dashboard", href: "/dashboard" },
];

const PageContext = createContext<PageContextType>({
  breadcrumbItems: defaultBreadcrumbs,
  setBreadcrumbItems: () => {},
  activeMenuItem: "dashboard",
});

export function PageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breadcrumbItems, setBreadcrumbItems] =
    useState<BreadcrumbItem[]>(defaultBreadcrumbs);
  const pathname = usePathname();

  // Determine active menu item based on pathname
  const activeMenuItem = React.useMemo(() => {
    const path = pathname.split("/")[1] || "dashboard";
    return path;
  }, [pathname]);

  // Reset breadcrumbs on path change if needed
  useEffect(() => {
    if (pathname === "/dashboard") {
      setBreadcrumbItems([{ label: "Dashboard", current: true }]);
    } else if (pathname === "/accounts") {
      setBreadcrumbItems([
        { label: "Dashboard", href: "/dashboard" },
        { label: "Accounts", current: true },
      ]);
    } else if (pathname === "/transactions") {
      setBreadcrumbItems([
        { label: "Dashboard", href: "/dashboard" },
        { label: "Transactions", current: true },
      ]);
    }
  }, [pathname]);

  return (
    <PageContext.Provider
      value={{
        breadcrumbItems,
        setBreadcrumbItems,
        activeMenuItem,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  return useContext(PageContext);
}
