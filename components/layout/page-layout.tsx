"use client";

import type React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { usePage } from "@/lib/contexts/page-context";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { breadcrumbItems } = usePage();

  return <AppLayout breadcrumbItems={breadcrumbItems}>{children}</AppLayout>;
}
