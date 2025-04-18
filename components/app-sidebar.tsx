"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Home,
  CreditCard,
  BarChart3,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePage } from "@/lib/contexts/page-context";

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
      icon: Map,
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
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: CreditCard,
      isActive: activeMenuItem === "accounts",
      items: [
        {
          title: "All Accounts",
          url: "/accounts",
        },
        {
          title: "Add Account",
          url: "/accounts/add",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: BarChart3,
      isActive: activeMenuItem === "transactions",
      items: [
        {
          title: "Recent Transactions",
          url: "/transactions",
        },
        {
          title: "Add Transaction",
          url: "/transactions/add",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: activeMenuItem === "settings",
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Account",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={userData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavProjects projects={userData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
