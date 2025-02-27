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
import { useToast } from "@/hooks/use-toast";
import { UserPiDash } from "../dashboard_component/user_pi_dash";
import { ExpenseCategory } from "../dashboard_component/expense-category";
import { Totalvehicleexpense } from "../dashboard_component/total-vehicle-expense";
import { MonthlyContribution } from "../dashboard_component/monthlycontribution";
import { VehiclewiseExpense } from "../dashboard_component/vehicle-wise-expense";

// Card Components
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

const Dashboard = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br">
      <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6 animate-fade-in">
        {/* Expense Categories Card - Full Width */}

        {/* Monthly Contribution and Total Vehicle Expenses - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Total Vehicle Expenses taking 25% */}
          <div className="md:col-span-1">
            <Totalvehicleexpense />
          </div>
          {/* Monthly Contribution taking 75% */}
          
          <div className="md:col-span-3">
          <ExpenseCategory />
        </div>
        </div>  
        {/* <div className="w-full">
            <MonthlyContribution />
          </div> */}
        
        {/* User Pi Dash and Vehicle-wise Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <UserPiDash />
          <VehiclewiseExpense />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {['Avg. Daily Expenses', 'Cost per Km', 'Avg. Daily Consumption'].map((stat, index) => (
            <Card key={index} className="p-4 md:p-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">{stat}</h4>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {index === 0 ? 'Rs. 200' : index === 1 ? 'Rs. 5' : '5 Liters'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;