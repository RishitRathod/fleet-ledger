import React, { useState, useEffect } from "react";
import ExpenseBarChart from "@/components/charts/ExpenseBarChart";
import ExpenseLineChart from "@/components/charts/ExpenseLineChart";
import ExpenseAreaChart from "@/components/charts/ExpenseAreaChart";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import ExpenseRadarChart from "@/components/charts/ExpenseRadarChart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Settings, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";


// Type definitions for data
interface ExpenseData {
  name: string;
  fuel: number;
  maintenance: number;
  insurance: number;
  [key: string]: string | number;
}

interface UserVehicleData extends ExpenseData {
  user: string;
  vehicle: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Vehicle {
  _id: string;
  name: string;
  registrationNumber: string;
}

interface PieData {
  name: string;
  value: number;
}

// Chart component props interfaces
interface ExpenseBarChartProps {
  data: ExpenseData[];
  expenseTypes: string[];
  chartStyle: "stacked" | "grouped";
  colors: string[];
}

interface ExpenseRadarChartProps {
  data: ExpenseData[];
  expenseTypes: string[];
  colors: string[];
}

interface ExpenseLineChartProps {
  data: ExpenseData[];
  expenseTypes: string[];
  colors: string[];
}

interface ExpenseAreaChartProps {
  data: ExpenseData[];
  expenseTypes: string[];
  chartStyle: "stacked" | "grouped";
  colors: string[];
}

interface ExpensePieChartProps {
  data: PieData[];
  colors: string[];
}

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

// API Services for fetching data
const fetchUsersFromDb = async (): Promise<User[]> => {
  try {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      console.error("User email not found in localStorage");
      return [];
    }

    const response = await fetch("http://localhost:5000/api/admin/getUsersUnderAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data.success && data.users) {
      return data.users;
    } else {
      throw new Error("Invalid users data");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const fetchVehiclesFromDb = async (): Promise<Vehicle[]> => {
  try {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      console.error("User email not found in localStorage");
      return [];
    }
    
    const response = await fetch(
      "http://localhost:5000/api/vehicles/getVehicleunderadmin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data.success && data.vehicles) {
      return data.vehicles;
    } else {
      throw new Error("Invalid vehicles data");
    }
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

const fetchUserVehicleRelationsFromDb = async (): Promise<UserVehicleData[]> => {
  // This would be replaced with actual API call
  return Promise.resolve(userVehicleData);
};

// Sample data for users
const userData = [
  { name: "John", fuel: 350000, maintenance: 120000, insurance: 80000 },
  { name: "Alice", fuel: 280000, maintenance: 95000, insurance: 80000 },
  { name: "Bob", fuel: 320000, maintenance: 150000, insurance: 80000 },
  { name: "Carol", fuel: 220000, maintenance: 85000, insurance: 80000 },
  { name: "David", fuel: 180000, maintenance: 60000, insurance: 80000 },
];

// Sample data for vehicles
const vehicleData = [
  { name: "Vehicle 1", fuel: 186000, maintenance: 35000, insurance: 25000 },
  { name: "Vehicle 2", fuel: 305000, maintenance: 80000, insurance: 25000 },
  { name: "Vehicle 3", fuel: 237000, maintenance: 65000, insurance: 25000 },
  { name: "Vehicle 4", fuel: 173000, maintenance: 42000, insurance: 25000 },
  { name: "Vehicle 5", fuel: 209000, maintenance: 58000, insurance: 25000 },
];

// Sample data for user-vehicle relationships
const userVehicleData = [
  {
    user: "John",
    vehicle: "Vehicle 1",
    name: "John - Vehicle 1",
    fuel: 95000,
    maintenance: 25000,
    insurance: 15000,
  },
  {
    user: "John",
    vehicle: "Vehicle 2",
    name: "John - Vehicle 2",
    fuel: 120000,
    maintenance: 40000,
    insurance: 15000,
  },
  {
    user: "Alice",
    vehicle: "Vehicle 1",
    name: "Alice - Vehicle 1",
    fuel: 65000,
    maintenance: 10000,
    insurance: 15000,
  },
  {
    user: "Bob",
    vehicle: "Vehicle 3",
    name: "Bob - Vehicle 3",
    fuel: 145000,
    maintenance: 55000,
    insurance: 15000,
  },
  {
    user: "Carol",
    vehicle: "Vehicle 4",
    name: "Carol - Vehicle 4",
    fuel: 80000,
    maintenance: 30000,
    insurance: 15000,
  },
  {
    user: "David",
    vehicle: "Vehicle 5",
    name: "David - Vehicle 5",
    fuel: 75000,
    maintenance: 22000,
    insurance: 15000,
  },
  {
    user: "Alice",
    vehicle: "Vehicle 2",
    name: "Alice - Vehicle 2",
    fuel: 85000,
    maintenance: 35000,
    insurance: 15000,
  },
  {
    user: "Bob",
    vehicle: "Vehicle 1",
    name: "Bob - Vehicle 1",
    fuel: 75000,
    maintenance: 30000,
    insurance: 15000,
  },
];

const ExpenseComparison = () => {
  const { toast } = useToast();
  const [comparisonType, setComparisonType] = useState<
    "user" | "vehicle" | "user-vehicle" | "vehicle-user"
  >("vehicle");
  const [chartTypes, setChartTypes] = useState<string[]>(["bar", "radar"]);
  const [timeRange, setTimeRange] = useState("month");
  const [expenseTypes, setExpenseTypes] = useState<string[]>([
    "fuel",
    "maintenance",
    "insurance",
  ]);
  const [chartStyle, setChartStyle] = useState<"stacked" | "grouped">("stacked");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Database data states
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  // Selection states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  
  // Temporary selection states for dialog
  const [tempSelectedUsers, setTempSelectedUsers] = useState<string[]>([]);
  const [tempSelectedVehicles, setTempSelectedVehicles] = useState<string[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) {
          toast({
            title: "Error",
            description: "Please log in to access this feature",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const [usersData, vehiclesData] = await Promise.all([
          fetchUsersFromDb(),
          fetchVehiclesFromDb()
        ]);
        
        if (usersData.length > 0) {
          setUsers(usersData);
          // Don't set default selections
          setSelectedUsers([]);
          setTempSelectedUsers([]);
        } else {
          toast({
            title: "Warning",
            description: "No users found under your administration",
            variant: "destructive"
          });
        }

        if (vehiclesData.length > 0) {
          setVehicles(vehiclesData);
          // Don't set default selections
          setSelectedVehicles([]);
          setTempSelectedVehicles([]);
        } else {
          toast({
            title: "Warning",
            description: "No vehicles found under your administration",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Reset temporary selections when dialog opens
  useEffect(() => {
    if (isSettingsOpen) {
      setTempSelectedUsers(selectedUsers);
      setTempSelectedVehicles(selectedVehicles);
    }
  }, [isSettingsOpen, selectedUsers, selectedVehicles]);

  // Get current data based on comparison type and selections
  const getDataBasedOnType = (): ExpenseData[] => {
    switch (comparisonType) {
      case "user":
        if (selectedUsers.length === 0) return [];
        return users
          .filter(user => selectedUsers.includes(user._id))
          .map(user => ({
            name: user.name,
            fuel: Math.random() * 100000, // Replace with actual data from API
            maintenance: Math.random() * 50000,
            insurance: Math.random() * 30000,
          }));
        
      case "vehicle":
        if (selectedVehicles.length === 0) return [];
        return vehicles
          .filter(vehicle => selectedVehicles.includes(vehicle._id))
          .map(vehicle => ({
            name: vehicle.name,
            fuel: Math.random() * 100000, // Replace with actual data from API
            maintenance: Math.random() * 50000,
            insurance: Math.random() * 30000,
          }));
        
      default:
        return [];
    }
  };

  const currentData = getDataBasedOnType();

  const handleCheckboxChange = (value: string) => {
    setChartTypes((prev) =>
      prev.includes(value)
        ? prev.filter((type) => type !== value)
        : [...prev, value]
    );
  };

  const handleExpenseTypeChange = (value: string) => {
    setExpenseTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data is being exported as CSV",
    });
  };

  const getTotalExpense = (item: ExpenseData): number => {
    return expenseTypes.reduce((sum, type) => sum + (Number(item[type]) || 0), 0);
  };

  const pieData = currentData.map((item) => ({
    name: item.name,
    value: getTotalExpense(item),
  }));

  // Handle selection changes
  const toggleUserSelection = (userId: string) => {
    setTempSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const toggleVehicleSelection = (vehicleId: string) => {
    setTempSelectedVehicles(prev => 
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Handle comparison type change
  const handleComparisonTypeChange = (value: "user" | "vehicle" | "user-vehicle" | "vehicle-user") => {
    setComparisonType(value);
  };

  // Function to safely set chart style
  const setChartStyleSafely = (value: string) => {
    if (value === "stacked" || value === "grouped") {
      setChartStyle(value);
    }
  };

  // Handle dialog actions
  const handleDialogOk = () => {
    setSelectedUsers(tempSelectedUsers);
    setSelectedVehicles(tempSelectedVehicles);
    setIsSettingsOpen(false);
  };

  const handleDialogReset = () => {
    setTempSelectedUsers([]);
    setTempSelectedVehicles([]);
    setSelectedUsers([]);
    setSelectedVehicles([]);
  };

  return (
    <div className="bg-gradient-to-br w-[1200px] pr-[25px] pl-[25px] min-h-screen relative">
      <div className="animate-fade-in max-w-[1800px] mx-auto space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-2xl font-bold">Expense Comparison</h2>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] w-[90vw]">
                <DialogHeader className="border-b pb-4">
                  <DialogTitle className="text-xl font-semibold text-center">
                    Comparison Settings
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Comparison Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Comparison Type
                      </Label>
                      <RadioGroup
                        value={comparisonType}
                        onValueChange={handleComparisonTypeChange}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user" className="text-gray-300">
                            User Comparison
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vehicle" id="vehicle" />
                          <Label htmlFor="vehicle" className="text-gray-300">
                            Vehicle Comparison
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Time Range & Chart Style */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Time Range</Label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>

                      <Label className="mt-4 block text-gray-300">
                        Chart Style
                      </Label>
                      <Select
                        value={chartStyle}
                        onValueChange={setChartStyleSafely}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stacked">Stacked</SelectItem>
                          <SelectItem value="grouped">Grouped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Chart Types */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Chart Types</Label>
                      <div className="space-y-2">
                        {["bar", "line", "area", "pie", "radar"].map((type) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`chart-${type}`}
                              checked={chartTypes.includes(type)}
                              onCheckedChange={() => handleCheckboxChange(type)}
                            />
                            <Label
                              htmlFor={`chart-${type}`}
                              className="capitalize"
                            >
                              {type} chart
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expense Types */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Expense Types
                      </Label>
                      <div className="space-y-2">
                        {["fuel", "maintenance", "insurance"].map((type) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={type}
                              checked={expenseTypes.includes(type)}
                              onCheckedChange={() =>
                                handleExpenseTypeChange(type)
                              }
                            />
                            <Label
                              htmlFor={type}
                              className="text-gray-300 capitalize"
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User/Vehicle Selection Section */}
                <div className="border-t pt-4 mt-4">
                  {/* User Selection */}
                  {comparisonType === "user" && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">
                        Select Users
                      </Label>
                      <ScrollArea className="h-32 border rounded-md p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {users.map((user) => (
                            <div key={user._id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`select-user-${user._id}`}
                                checked={tempSelectedUsers.includes(user._id)}
                                onCheckedChange={() => {
                                  const newSelection = tempSelectedUsers.includes(user._id)
                                    ? tempSelectedUsers.filter(id => id !== user._id)
                                    : [...tempSelectedUsers, user._id];
                                  setTempSelectedUsers(newSelection);
                                }}
                              />
                              <Label htmlFor={`select-user-${user._id}`}>
                                {user.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  {/* Vehicle Selection */}
                  {comparisonType === "vehicle" && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Select Vehicles
                      </Label>
                      <ScrollArea className="h-32 border rounded-md p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {vehicles.map((vehicle) => (
                            <div key={vehicle._id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`select-vehicle-${vehicle._id}`}
                                checked={tempSelectedVehicles.includes(vehicle._id)}
                                onCheckedChange={() => {
                                  const newSelection = tempSelectedVehicles.includes(vehicle._id)
                                    ? tempSelectedVehicles.filter(id => id !== vehicle._id)
                                    : [...tempSelectedVehicles, vehicle._id];
                                  setTempSelectedVehicles(newSelection);
                                }}
                              />
                              <Label htmlFor={`select-vehicle-${vehicle._id}`}>
                                {vehicle.name} ({vehicle.registrationNumber})
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                {/* Dialog Footer with OK and Reset buttons */}
                <DialogFooter className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handleDialogReset}>
                    Reset
                  </Button>
                  <Button onClick={handleDialogOk}>
                    OK
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-2 flex justify-center items-center py-12">
              <p>Loading expense data...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="col-span-2 flex justify-center items-center py-12">
              <p>Please select users and/or vehicles to display expense data</p>
            </div>
          ) : (
            <>
              {chartTypes.includes("bar") && (
                <div className="w-full">
                  <ExpenseBarChart
                    data={currentData}
                    expenseTypes={expenseTypes}
                    chartStyle={chartStyle}
                    colors={COLORS}
                  />
                </div>
              )}

              {chartTypes.includes("radar") && (
                <div className="w-full">
                  <ExpenseRadarChart
                    data={currentData}
                    expenseTypes={expenseTypes}
                    colors={COLORS}
                  />
                </div>
              )}

              {chartTypes.includes("line") && (
                <div className="w-full">
                  <ExpenseLineChart
                    data={currentData}
                    expenseTypes={expenseTypes}
                    colors={COLORS}
                  />
                </div>
              )}

              {chartTypes.includes("area") && (
                <div className="w-full">
                  <ExpenseAreaChart
                    data={currentData}
                    expenseTypes={expenseTypes}
                    chartStyle={chartStyle}
                    colors={COLORS}
                  />
                </div>
              )}

              {chartTypes.includes("pie") && (
                <div className="w-full">
                  <ExpensePieChart
                    data={pieData}
                    colors={COLORS}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseComparison;
