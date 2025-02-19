import * as React from "react";
import { ArrowDownIcon, ArrowUpIcon, HelpCircle, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";



const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff79c6", "#ff9f55"];
export function Totalvehicleexpense() {
  return (
          <Card className="p-4 md:p-6 hover:shadow-xl transition-all duration-300">
               <div className="flex justify-between items-start">
                 <div className="space-y-2">
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
               </div>
             </Card>
  );
}