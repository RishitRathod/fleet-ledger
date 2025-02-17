import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Car, 
  DollarSign, 
  Fuel, 
  Wrench, 
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";

// ... keep existing code (monthlyData, expenseCategories, fuelEfficiencyData, recentTransactions)

// Daily expense data for the heatmap (mock data)
const dailyExpenses = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(2024, 0, i + 1),
  amount: Math.random() * 100
}));

// Function to get color based on expense amount
const getExpenseColor = (amount: number) => {
  if (amount === 0) return 'bg-gray-100 dark:bg-gray-800';
  if (amount < 25) return 'bg-green-100 dark:bg-green-900/30';
  if (amount < 50) return 'bg-green-300 dark:bg-green-700/50';
  if (amount < 75) return 'bg-green-500 dark:bg-green-500/70';
  return 'bg-green-700 dark:bg-green-300';
};

const StatCard = ({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend?: string }) => (
  // ... keep existing code (StatCard component)
);

const Index = () => {
  // Function to group expenses by week
  const getWeeksArray = () => {
    const weeks: Array<Array<typeof dailyExpenses[0]>> = [];
    let currentWeek: typeof dailyExpenses = [];
    
    dailyExpenses.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  return (
    <ScrollArea className="h-screen">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vehicle Expense Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Track and manage your vehicle expenses</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={DollarSign} 
            label="Total Expenses" 
            value="$1,234.56" 
            trend="+12.3% from last month"
          />
          <StatCard 
            icon={Fuel} 
            label="Fuel Efficiency" 
            value="28 MPG"
            trend="2 MPG better than avg"
          />
          <StatCard 
            icon={Wrench} 
            label="Maintenance Cost" 
            value="$345.67"
            trend="Next service in 2 weeks"
          />
          <StatCard 
            icon={Car} 
            label="Vehicle Status" 
            value="Good"
            trend="All systems normal"
          />
        </div>

        {/* Daily Expense Heatmap */}
        <Card className="p-6 backdrop-blur-sm bg-white/10 border-none shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Expense Activity
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="flex gap-1 text-xs mb-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <div key={month} className="flex-1">{month}</div>
                ))}
              </div>
              <div className="flex gap-[2px]">
                {getWeeksArray().map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${getExpenseColor(day.amount)}`}
                        title={`${day.date.toLocaleDateString()}: $${day.amount.toFixed(2)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  {['bg-gray-100 dark:bg-gray-800', 'bg-green-100 dark:bg-green-900/30', 'bg-green-300 dark:bg-green-700/50', 'bg-green-500 dark:bg-green-500/70', 'bg-green-700 dark:bg-green-300'].map((color, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Charts Grid */}
        // ... keep existing code (Charts Grid section)

        {/* Recent Transactions */}
        // ... keep existing code (Recent Transactions section)
      </div>
    </ScrollArea>
  );
};

export default Index;