import * as React from "react";
import { ArrowDownIcon, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff79c6", "#ff9f55"];


interface ExpenseData {
  totalAmount: number;
}

export function Totalvehicleexpense({ className }: { className?: string }) {
  const [expenseData, setExpenseData] = React.useState<ExpenseData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getVehiclesWithTotalAmount`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log("Fetched data:", data);
  
        // Calculate sum of all totalAmount fields
        const totalOfAllAmounts = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
        console.log("Total Amount:", totalOfAllAmounts);
  
        // Now you can even attach this total if you want
        const expenseData = { totalAmount: totalOfAllAmounts };
  
        setExpenseData(expenseData);
  
      } catch (error) {
        console.error('Error fetching expense data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchExpenseData();
  }, []);
  

  return (
    <Card className={`p-4 h-[170px] flex flex-col justify-center ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Vehicle Expenses</h3>
          <div className="relative inline-block">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </div>
        </div>
        {/* //make it in center */}
        <p className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        INR<br/>{Math.floor(expenseData?.totalAmount || 0).toLocaleString()}
        </p>
        <div className="flex items-center text-red-500">
          <ArrowDownIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">4% vs last month</span>
        </div>
      </div>
    </Card>
  );
}