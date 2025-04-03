import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, BarChart4, PieChart as PieChartIcon, LineChart as LineChartIcon, TrendingUp, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BarChart from "./expensecharts/BarChart";
import PieChart from "./expensecharts/PieChart";
import LineChart from "./expensecharts/LineChart";
import AreaChart from "./expensecharts/AreaChart";

// Sample data - this would come from your backend in a real application
const sampleData = [
  { name: "Vehicle 1", value: 400, cost: 600, maintenance: 300 },
  { name: "Vehicle 2", value: 300, cost: 400, maintenance: 250 },
  { name: "Vehicle 3", value: 300, cost: 500, maintenance: 280 },
  { name: "Vehicle 4", value: 200, cost: 300, maintenance: 220 },
];

const monthlyData = [
  { name: "Jan", expenses: 400, income: 600 },
  { name: "Feb", expenses: 300, income: 580 },
  { name: "Mar", expenses: 500, income: 550 },
  { name: "Apr", expenses: 280, income: 590 },
  { name: "May", expenses: 350, income: 600 },
  { name: "Jun", expenses: 450, income: 620 },
];

const chartTypes = [
  {
    id: "bar",
    label: "Bar Chart",
    icon: BarChart4,
    description: "Compare values across categories"
  },
  {
    id: "pie",
    label: "Pie Chart",
    icon: PieChartIcon,
    description: "Show proportion of total expenses"
  },
  {
    id: "line",
    label: "Line Chart",
    icon: LineChartIcon,
    description: "Track changes over time periods"
  },
  {
    id: "area",
    label: "Area Chart",
    icon: TrendingUp,
    description: "Visualize trends with filled areas"
  },
];

const ExpenseCharts = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [categoryType, setCategoryType] = useState("subcategory");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["bar", "pie"]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["total", "fuel", "maintenance"]);
  const [showFilters, setShowFilters] = useState(true);
  const [showBlackSection, setShowBlackSection] = useState(false);

  const handleChartSelection = (chartId: string) => {
    setSelectedCharts(prev => {
      if (prev.includes(chartId)) {
        return prev.filter(id => id !== chartId);
      } else {
        return [...prev, chartId];
      }
    });
  };

  // Sample vehicle and user data - replace with actual data from your backend
  const vehicles = [
    { id: "all", name: "All Vehicles" },
    { id: "v1", name: "Vehicle 1" },
    { id: "v2", name: "Vehicle 2" },
    { id: "v3", name: "Vehicle 3" },
    { id: "v4", name: "Vehicle 4" },
  ];

  const users = [
    { id: "all", name: "All Users" },
    { id: "u1", name: "John Doe" },
    { id: "u2", name: "Jane Smith" },
    { id: "u3", name: "Bob Johnson" },
  ];

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br">
      <div className="max-w-[2800px] mx-auto space-y-4 md:space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Main Content Grid */}
          <div className="md:col-span-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {selectedCharts.map((chartId) => {
                const chart = chartTypes.find(c => c.id === chartId);
                if (!chart) return null;

                return (
                  <div key={chartId} className="relative">
                    <div className="absolute top-0 right-0 z-10 flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChartSelection(chartId)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="h-[400px]">
                      {chartId === "bar" && (
                        <div className="w-full h-full">
                          <BarChart />
                        </div>
                      )}
                      {chartId === "pie" && (
                        <div className="w-full h-full">
                          <PieChart />
                        </div>
                      )}
                      {chartId === "line" && (
                        <div className="w-full h-full">
                          <LineChart data={monthlyData} />
                        </div>
                      )}
                      {chartId === "area" && (
                        <div className="w-full h-full">
                          <AreaChart />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Panel */}
          <div className="md:col-span-3 space-y-4" style={{ display: showFilters ? 'block' : 'none' }}>
            <div className="relative">
              {/* Filter content */}
              <div className="bg-black/90 rounded-lg shadow-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-white">Filters</h3>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-300">Date Range:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <Label htmlFor="fromDate" className="block mb-1">From:</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "MM/dd/yyyy") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label htmlFor="toDate" className="block mb-1">To:</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "MM/dd/yyyy") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-300">Vehicle:</h3>
                    <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                      <SelectTrigger className="w-full bg-black/80 border border-gray-700 text-gray-300 hover:bg-black/70">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 border border-gray-700 text-gray-300">
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-300">User:</h3>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger className="w-full bg-black/80 border border-gray-700 text-gray-300 hover:bg-black/70">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 border border-gray-700 text-gray-300">
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-300">Chart types:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {chartTypes.map((chart) => {
                        const Icon = chart.icon;
                        return (
                          <div key={chart.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`chart-${chart.id}`} 
                              checked={selectedCharts.includes(chart.id)}
                              onCheckedChange={() => handleChartSelection(chart.id)}
                              className="bg-black/80 border border-gray-700 text-blue-400"
                            />
                            <div className="grid gap-1 leading-none">
                              <Label 
                                htmlFor={`chart-${chart.id}`} 
                                className="font-medium flex items-center cursor-pointer text-gray-300"
                              >
                                <Icon className="h-4 w-4 inline mr-1 text-blue-400" />
                                {chart.label}
                              </Label>
                              <p className="text-xs text-gray-500">
                                {chart.id === "bar" && "Compare values across categories"}
                                {chart.id === "pie" && "Show proportion of total expenses"}
                                {chart.id === "line" && "Track changes over time periods"}
                                {chart.id === "area" && "Visualize trends with filled areas"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;