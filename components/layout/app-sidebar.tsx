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
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePage } from "@/lib/contexts/page-context";
import { Separator } from "../ui/separator";

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
      <SidebarRail />
    </Sidebar>
  );
}
