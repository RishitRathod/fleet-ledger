"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
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
  Fuel,
  Wrench,
  IndianRupee,
  ReceiptIndianRupee,
  UsersRound,
  Import
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "../team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";

// Default data structure
const data = {
  user: {
    name: "",
    email: "",
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
      icon: IndianRupee,
      isActive: true,
      items: [
        {
          title: "Accessories",
          url: "#",
          icon: Bolt,
        },
        {
          title: "Fuel",
          url: "#",
          icon: Fuel,
        },
        {
          title: "Service",
          url: "#",
          icon: Wrench,
        },
        {
          title: "Tax",
          url: "#",
          icon: ReceiptIndianRupee,
        },
      ],
    },
    
    {
      title: "Import/Export",
      url: "/data-table",
      icon: Import,
      
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

export function AppSidebarUser({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState(data.user);

  useEffect(() => {
    // Get user data from localStorage
    const userName = localStorage.getItem('name') || "User";
    const userEmail = localStorage.getItem('email') || "user@example.com";
    
    setUserData({
      name: userName,
      email: userEmail,
      avatar: "/avatars/shadcn.jpg",
    });
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} vehicleitems={[]} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
