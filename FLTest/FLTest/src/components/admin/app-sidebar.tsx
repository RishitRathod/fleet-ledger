import type * as React from "react";
import { useEffect, useState } from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Import,
  IndianRupee,
  Bolt,
  Fuel,
  Wrench,
  ReceiptIndianRupee,
  UsersRound,
} from "lucide-react";

import { NavMain } from "./nav-main";
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
      title: "Users",
      url: "/users",
      icon: UsersRound,
    },
    {
      title: "Import/Export",
      url: "/refuelimport",
      icon: Import,
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
  vehicleitems: [], // Added to fix the NavMainProps requirement
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState(data.user);

  useEffect(() => {
    // Get user data from localStorage
    const userName = localStorage.getItem('name') || "Admin";
    const userEmail = localStorage.getItem('email') || "admin@example.com";
    
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
        <NavMain items={data.navMain} vehicleitems={data.vehicleitems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}