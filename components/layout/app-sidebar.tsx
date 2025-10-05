"use client";

import type * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map as MapIcon,
  PieChart,
  Settings2,
  Home,
  CreditCard,
  BarChart3,
  Calculator,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavCalculators } from "@/components/layout/nav-calculators";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePage } from "@/lib/contexts/page-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

// This is sample data.
const userData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: MapIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeMenuItem } = usePage();
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: activeMenuItem === "dashboard",
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: CreditCard,
      isActive: activeMenuItem === "accounts",
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: BarChart3,
      isActive: activeMenuItem === "transactions",
    },
  ];

  const calculatorItems = [
    {
      title: "50-30-20 Budget",
      url: "/calculators/budget-50-30-20",
      icon: Calculator,
      isActive: activeMenuItem === "budget-50-30-20",
    },
    {
      title: "Compound Interest",
      url: "/calculators/compound-interest",
      icon: Calculator,
      isActive: activeMenuItem === "compound-interest",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={userData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <Separator className="my-2" />
        <NavCalculators items={calculatorItems} />
      </SidebarContent>
      {isAuthenticated && (
        <SidebarFooter>
          <div className="flex items-center justify-between p-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
