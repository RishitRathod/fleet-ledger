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
import { UserPiDash } from "./user_pi_dash";
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

// Updated data for vehicle expenses
const monthlyData = [
  { vehicle: "Vehicle 1", expenses: 186000 },
  { vehicle: "Vehicle 2", expenses: 305000 },
  { vehicle: "Vehicle 3", expenses: 237000 },
  { vehicle: "Vehicle 4", expenses: 173000 },
  { vehicle: "Vehicle 5", expenses: 209000 },
];

const userExpenseData = [
  { name: "John", value: 35 },
  { name: "Alice", value: 25 },
  { name: "Bob", value: 20 },
  { name: "Carol", value: 15 },
  { name: "David", value: 5 },
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const expenseCategories = [
  { name: "Fuel", value: 80.4 },
  { name: "Maintenance", value: 11.6 },
  { name: "Insurance", value: 8.0 },
];

const generateContributionData = () => {
  return Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    value: Math.random() * 100,
    amount: Math.floor(Math.random() * 300000) + 200000,
  }));
};

const getCellColor = (value: number) => {
  const intensity = Math.floor((value / 100) * 5);
  return `bg-green-${(intensity + 1) * 100}`;
};

const Dashboard = () => {
  const { toast } = useToast();
  const contributionData = generateContributionData();

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br">

      <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Total Vehicle Expenses Card */}
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

         {/* Expense Categories Card */}
{/* Expense Categories Card */}
<Card className="p-4 md:p-6 hover:shadow-xl transition-all duration-300">
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <h3 className="text-sm font-medium text-muted-foreground">Expense Categories</h3>
      <div className="relative inline-block">
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
      </div>
    </div>

    {/* Horizontal Line */}
    <div className="border-t border-gray-300 my-2"></div>

    <div className="flex justify-between items-center">
      {expenseCategories.map((item, index) => (
        <div key={index} className="text-center relative">
          <div className="text-lg font-semibold">{item.value}%</div>
          <div className="text-xs text-muted-foreground mt-1">{item.name}</div>
          {/* Color Indicator Line */}
          <div 
            className="w-10 h-1 rounded-full mx-auto mt-1" 
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
        </div>
      ))}
    </div>
  </div>
</Card>


        </div>

        {/* Monthly Contribution Map with reduced height */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">Monthly Expense Contributions</h3>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                <span className="text-sm text-muted-foreground">Low Expense</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="text-sm text-muted-foreground">High Expense</span>
              </div>
            </div>
          </div>

          {/* Contribution grid with reduced cell size */}
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="text-xs text-muted-foreground text-center mb-1">
                {day}
              </div>
            ))}
            
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8"></div>
            ))}
            
            {contributionData.map((data) => (
              <div
                key={data.day}
                className={`w-8 h-8 relative group ${getCellColor(data.value)} rounded-sm hover:ring-2 hover:ring-primary cursor-pointer transition-all duration-200`}
              >
                <div className="absolute top-1 left-1 text-[10px] text-muted-foreground">
                  {data.day}
                </div>
                <div className="absolute invisible group-hover:visible bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg -translate-y-full -top-2 left-1/2 -translate-x-1/2 z-20 w-32 text-xs">
                  <div className="font-medium">Day {data.day}</div>
                  <div className="text-muted-foreground">
                    IDR {data.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* User Expense Distribution */}
          {/* <Card className="p-4 md:p-6 ">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">User Expense Distribution</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userExpenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card> */}
          <UserPiDash/>

          {/* Vehicle-wise Expenses */}
          <Card className="p-4 md:p-6 ">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Vehicle-wise Expenses</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="vehicle" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="expenses" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
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