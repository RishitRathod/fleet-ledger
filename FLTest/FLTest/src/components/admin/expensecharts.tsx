import * as React from "react";
import { useState, useEffect } from "react";
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

// API response interfaces
interface VehicleExpenseData {
  vehicleName: string;
  totalAmount: number;
  // Add other fields if they exist in the API response
}

interface UserExpenseData {
  userName: string;
  totalAmount: number;
  // Add other fields if they exist in the API response
}

// Chart data interface
interface ChartData {
  name: string;
  amount: number;
}

interface MonthlyData {
  name: string;
  expenses: number;
  income: number;
}

// Fetch functions
const fetchVehicleData = async (period: string, startDate?: Date, endDate?: Date): Promise<ChartData[]> => {
  try {
    let url = `http://localhost:5000/api/vehicles/getVehiclesWithTotalAmount`;
    if (period === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle data');
    }
    
    // Get the raw data from API
    const rawData: VehicleExpenseData[] = await response.json();
    console.log('Raw vehicle data:', rawData);
    
    // Transform the data to match ChartData interface
    const transformedData: ChartData[] = rawData.map(item => ({
      name: item.vehicleName,
      amount: item.totalAmount
    }));
    
    console.log('Transformed vehicle data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return [];
  }
};

const fetchUserData = async (period: string, startDate?: Date, endDate?: Date): Promise<ChartData[]> => {
  try {
    let url = `http://localhost:5000/api/users/getUsersWithTotalAmount`;
    // if (period === 'custom' && startDate && endDate) {
    //   url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    // }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    // Get the raw data from API
    const rawData: UserExpenseData[] = await response.json();
    console.log('Raw user data:', rawData);
    
    // Transform the data to match ChartData interface
    const transformedData: ChartData[] = rawData.map(item => ({
      name: item.userName,
      amount: item.totalAmount
    }));
    
    console.log('Transformed user data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
};


const fetchCategoryData = async (period: string, startDate?: Date, endDate?: Date): Promise<ChartData[]> => {
  try {
    let url = `http://localhost:5000/api/category/getCatrgoryWithTotalAmount`;
    // if (period === 'custom' && startDate && endDate) {
    //   url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    // }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    // Get the raw data from API
    const rawData: UserExpenseData[] = await response.json();
    console.log('Raw user data:', rawData);
    
    // Transform the data to match ChartData interface
    const transformedData: ChartData[] = rawData.map(item => ({
      name: item.userName,
      amount: item.totalAmount
    }));
    
    console.log('Transformed user data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
};

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
  const [filterType, setFilterType] = useState<'vehicle' | 'user' | 'category'>('vehicle');
  const [datePeriod, setDatePeriod] = useState<'monthly' | 'quarterly' | 'yearly' | 'custom'>('monthly');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let fetchFunction;
  
      if (filterType === 'vehicle') {
        fetchFunction = fetchVehicleData;
      } else if (filterType === 'user') {
        fetchFunction = fetchUserData;
      } else if (filterType === 'category') {
        fetchFunction = fetchCategoryData;
      } else {
        console.error('Unknown filter type:', filterType);
        return; // Important: Stop execution if filterType is unknown
      }
  
      try {
        const data = await fetchFunction(datePeriod, startDate, endDate);
        setChartData(data);
  
        // Transform data for monthly view (line chart)
        const monthlyTransformed = data.map(item => ({
          name: item.name,
          expenses: item.amount, // Using amount as expenses
          income: 0 // Set to 0 or remove if not needed
        }));
        setMonthlyData(monthlyTransformed);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [filterType, datePeriod, startDate, endDate]);
  
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
    <div className="min-h-screen w-full p-2 sm:p-4 md:p-6 bg-gradient-to-br">
      <div className="max-w-[2800px] mx-auto px-2 sm:px-4 md:px-6 space-y-2 sm:space-y-4 md:space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 md:gap-6">
          {/* Main Content Grid */}
          <div className="lg:col-span-9 space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
              {selectedCharts.map((chartId) => {
                const chart = chartTypes.find(c => c.id === chartId);
                if (!chart) return null;

                return (
                  // <div key={chartId} className="relative bg-card rounded-lg shadow-md h-[300px] sm:h-[350px] md:h-[400px] p-2 sm:p-4">
                  <div key={chartId}>
                    <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChartSelection(chartId)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {chartId === "bar" && (
                      <BarChart chartData={chartData} />
                    )}
                    {chartId === "pie" && (
                      <PieChart chartData={chartData} />
                    )}
                    {chartId === "line" && (
                      <LineChart data={chartData} />
                    )}
                    {chartId === "area" && (
                      <AreaChart data={chartData} />
                    )}
                  </div>
                  // </div>
                );
              })}
            </div>
          </div>

          {/* Filter Panel */}
          <div className="lg:col-span-3 space-y-4" style={{ display: showFilters ? 'block' : 'none' }}>
            <div className="relative">
              {/* Filter content */}
              <div className="bg-black/90 rounded-lg shadow-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-white">Filters</h3>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-300">Date Period:</h3>
                    <Select value={datePeriod} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly' | 'custom') => setDatePeriod(value)}>
                      <SelectTrigger className="w-full bg-black/80 border border-gray-700 text-gray-300 hover:bg-black/70">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 border border-gray-700 text-gray-300">
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {datePeriod === 'custom' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-300">From:</h3>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-black/80 border border-gray-700 text-gray-300 hover:bg-black/70",
                                !startDate && "text-gray-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-black/80 border border-gray-700">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              className="bg-black/80 text-gray-300"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-300">To:</h3>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-black/80 border border-gray-700 text-gray-300 hover:bg-black/70",
                                !endDate && "text-gray-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-black/80 border border-gray-700">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              className="bg-black/80 text-gray-300"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={filterType === 'vehicle' ? 'default' : 'outline'}
                        onClick={() => setFilterType('vehicle')}
                        className="w-full"
                      >
                        Vehicle
                      </Button>
                      <Button
                        variant={filterType === 'user' ? 'default' : 'outline'}
                        onClick={() => setFilterType('user')}
                        className="w-full"
                      >
                        User
                      </Button>
                      <Button
                        variant={filterType === 'category' ? 'default' : 'outline'}
                        onClick={() => setFilterType('category')}
                        className="w-full"
                      >
                        Category
                      </Button>
                    </div>

                    {filterType === 'vehicle' ? (
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
                    ) : (
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
                    )}
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