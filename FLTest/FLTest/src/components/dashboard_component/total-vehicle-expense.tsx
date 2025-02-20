import * as React from "react";
import { ArrowDownIcon, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff79c6", "#ff9f55"];

export function Totalvehicleexpense() {
  return (
    <Card className="p-4 h-[165px] flex flex-col justify-center">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Vehicle Expenses</h3>
          <div className="relative inline-block">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </div>
        </div>
        <p className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          IDR 9,300,000
        </p>
        <div className="flex items-center text-red-500">
          <ArrowDownIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">4% vs last month</span>
        </div>
      </div>
    </Card>
  );
}