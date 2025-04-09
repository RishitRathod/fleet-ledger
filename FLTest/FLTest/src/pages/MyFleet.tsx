import React from "react";
("use client");

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
const MyFleet = () => {
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [assignVehicleOpen, setAssignVehicleOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setAddVehicleOpen(true)}
        className="text-foreground w-full justify-start"
      >
        <PlusCircle className="text-foreground" />
        <span>Add Vehicle</span>
      </Button>
      <AddVehicleModal open={addVehicleOpen} onOpenChange={setAddVehicleOpen} />

      <Button
        onClick={() => setAssignVehicleOpen(true)}
        className="text-foreground w-full justify-start"
      >
        <PlusCircle className="text-foreground" />
        <span>Assign Vehicle</span>
      </Button>
      <AssignVehicleModal
        open={assignVehicleOpen}
        onOpenChange={setAssignVehicleOpen}
      />
    </>
  );
};

export default MyFleet;
