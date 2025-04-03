"use client";

import { useState } from "react";
import {
  ChartArea,
  FileText,
  CarFront,
  PlusCircle,
  ChevronRight,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { useExpenseModal } from "../expenses/expense-store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AddVehicleModal } from "@/pages/AddVehicleModal";
import { AssignVehicleModal } from "@/pages/AssignVeghicleModal";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}

export function NavMain({ items }: NavMainProps) {
  const { onOpen } = useExpenseModal();
  const location = useLocation();
  const isOnDashboard = location.pathname === "/dashboard";

  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [assignVehicleOpen, setAssignVehicleOpen] = useState(false);

  const handleExpenseClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    type: string
  ) => {
    e.preventDefault();
    onOpen(type.toLowerCase() as "accessories" | "fuel" | "service" | "tax");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        {!isOnDashboard && (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard" asChild>
              <Link to="/dashboard" className="text-foreground">
                <LayoutDashboard className="text-foreground" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {items.map((item) => {
          // Skip the dashboard item if it exists in the array since we're handling it separately
          if (item.title === "Dashboard") return null;
          // For specific items that shouldn't have dropdowns
          if (item.title === "Import/Export" || item.title === "Users") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link to={item.url} className="text-foreground">
                    {item.icon && <item.icon className="text-foreground" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // For items with dropdowns
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon className="text-foreground" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-foreground" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={subItem.url}
                            className="text-foreground"
                            onClick={(e) =>
                              handleExpenseClick(e, subItem.title)
                            }
                          >
                            {subItem.icon && <subItem.icon className="mr-2" />}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
      <br />
      <SidebarGroupLabel>Statistics</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Data Table" asChild>
            <Link to="/data-table" className="text-foreground">
              <FileText className="text-foreground" />
              <span>Data Table</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Charts" asChild>
            <Link to="/charts" className="text-foreground">
              <ChartArea className="text-foreground" />
              <span>Charts</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Comparison" asChild>
            <Link to="/comparison" className="text-foreground">
              <ChartArea className="text-foreground" />
              <span>Comparison</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <br />
      <SidebarGroupLabel>Vehicles</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="My Fleet" asChild>
            <Link to="/myfleet" className="text-foreground">
              <CarFront className="text-foreground" />
              <span>My Fleet</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* <SidebarMenuItem>
          <SidebarMenuButton tooltip="Add Vehicle" asChild>
            <Button
              onClick={() => setAddVehicleOpen(true)}
              className="text-foreground w-full justify-start"
            >
              <PlusCircle className="text-foreground" />
              <span>Add Vehicle</span>
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Assign Vehicle" asChild>
            <Button
              onClick={() => setAssignVehicleOpen(true)}
              className="text-foreground w-full justify-start"
            >
              <PlusCircle className="text-foreground" />
              <span>Assign Vehicle</span>
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>

      {/* Add Vehicle Modal */}
      <AddVehicleModal open={addVehicleOpen} onOpenChange={setAddVehicleOpen} />

      {/* Assign Vehicle Modal */}
      <AssignVehicleModal
        open={assignVehicleOpen}
        onOpenChange={setAssignVehicleOpen}
      />
    </SidebarGroup>
  );
}
