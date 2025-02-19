"use client";

import type * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Car,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  HandCoins,
  Bolt,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";

// Sample data
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "FleetLedger",
      logo: GalleryVerticalEnd,
      plan: "",
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
  navMain: [
    {
      title: "Add Expenses",
      url: "#",
      icon: HandCoins,
      isActive: true,
      items: [
        {
          title: "Accesories",
          url: "#",
          icon: Bolt,
        },
        {
          title: "Fuel",
          url: "/dashboard",
          icon: Bolt,
        },
        {
          title: "Services",
          url: "#",
        },
        {
          title: "Taxes",
          url: "#",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Frame,
    },
    {
      title: "Import/Export",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    // {
    //   title: "My Fleet",
    //   url: "/fleet",
    //   icon: Car,
    // },
    // {
    //   title: "Add Vehicle",
    //   url: "/users",
    //   icon: Frame,
    // },
   
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
