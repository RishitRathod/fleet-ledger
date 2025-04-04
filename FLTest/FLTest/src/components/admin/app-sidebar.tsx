import type * as React from "react";
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} vehicleitems={data.vehicleitems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}