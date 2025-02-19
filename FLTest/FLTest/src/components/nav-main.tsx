"use client"

import { ChartArea, FileText, CarFront, PlusCircle , ChevronRight, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[],
  vehicleitems: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    vehicleitems?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({ items, vehicleitems }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // For specific items that shouldn't have dropdowns
          if (item.title === "Import/Export" || item.title === "Users") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a href={item.url} className="text-foreground">
                    {item.icon && <item.icon className="text-foreground" />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // For items with dropdowns
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
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
                          <a href={subItem.url} className="text-foreground">
                            <span>{subItem.title}</span>
                            {/* <subItem.icon className="text-foreground" /> */}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu><br />
      <SidebarGroupLabel>Statistics</SidebarGroupLabel>
      <SidebarMenu>
      <SidebarMenuItem>
    <SidebarMenuButton tooltip="My Fleet" asChild>
      <a href="/my-fleet" className="text-foreground">
      <FileText className="text-foreground" />
        <span>Data</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton tooltip="Add Vehicle" asChild>
      <a href="/add-vehicle" className="text-foreground">
      <ChartArea className="text-foreground" />
        <span>Charts</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
      </SidebarMenu><br />
      <SidebarGroupLabel>Vehicles</SidebarGroupLabel>
      <SidebarMenu>
      <SidebarMenuItem>
    <SidebarMenuButton tooltip="My Fleet" asChild>
      <a href="/my-fleet" className="text-foreground">
      <CarFront className="text-foreground" />
        <span>My Fleet</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton tooltip="Add Vehicle" asChild>
      <a href="/add-vehicle" className="text-foreground">
      <PlusCircle className="text-foreground" />
        <span>Add Vehicle</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
