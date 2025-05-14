import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Settings, X } from "lucide-react";
import ExpenseBarChart from "@/components/charts/ExpenseBarChart";
import ExpenseLineChart from "@/components/charts/ExpenseLineChart";
import ExpenseAreaChart from "@/components/charts/ExpenseAreaChart";
import ExpenseRadarChart from "@/components/charts/ExpenseRadarChart";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

// Type definitions for data
interface ExpenseData {
  name: string;
  refueling: number;
  tax: number;
  service: number;
  accessories: number;
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

// API Services for fetching data
const fetchUsersFromDb = async (): Promise<User[]> => {
  try {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      console.error("User email not found in localStorage");
      return [];
    }

    const response = await fetch("http://localhost:5000/api/users/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Users fetched successfully:", data);
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
  return Promise.resolve([]);
};

const ExpenseComparison = () => {
  const { toast } = useToast();
  const [comparisonType, setComparisonType] = useState<"user" | "vehicle" | "user-vehicle" | "vehicle-user">("user");
  const [chartTypes, setChartTypes] = useState<string[]>(["bar", "radar"]);
  const [timeRange, setTimeRange] = useState<string>("month");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [expenseTypes, setExpenseTypes] = useState<string[]>([
    "refueling",
    "tax",
    "service",
    "accessories",
  ]);
  const [chartStyle, setChartStyle] = useState<"stacked" | "grouped">("stacked");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Database data states
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [comparisonData, setComparisonData] = useState<ExpenseData[]>([]);

  // Selection states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<string[]>([]);
  const [tempSelectedVehicles, setTempSelectedVehicles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDateRange = () => {
    if (timeRange === 'custom' && customStartDate && customEndDate) {
      return {
        startDate: new Date(customStartDate).toISOString(),
        endDate: new Date(customEndDate).toISOString()
      };
    }

    const now = new Date();
    const end = now.toISOString();
    let start;

    switch (timeRange) {
      case "week":
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        start = new Date(now.setMonth(now.getMonth() - 1));
    }

    return {
      startDate: start.toISOString(),
      endDate: end
    };
  };

  const fetchComparisonData = async () => {
    try {
      let requestBody;
      let endpoint;

      const dateRange = getDateRange();
      
      switch (comparisonType) {
        case "vehicle":
          if (!selectedVehicles.length) {
            throw new Error("No vehicles selected for comparison");
          }
          requestBody = {
            vehicleList: selectedVehicles.map(id => ({ vehicleId: id })),
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            models: "all"
          };
          endpoint = "getvehiclecomparison";
          break;

        case "user":
          if (!selectedUsers.length) {
            throw new Error("No users selected for comparison");
          }
          requestBody = {
            userList: selectedUsers.map(id => ({ userId: id })),
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            models: "all"
          };
          endpoint = "getusercomparison";
          break;

        case "user-vehicle":
          if (!selectedUsers.length || selectedUsers.length !== 1) {
            throw new Error("Please select exactly one user for user-vehicle comparison");
          }
          if (!selectedVehicles.length) {
            throw new Error("Please select at least one vehicle for comparison");
          }
          requestBody = {
            userId: selectedUsers[0],
            vehicleIds: selectedVehicles,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            models: "all"
          };
          endpoint = "getuservehiclecomparison";
          break;

        case "vehicle-user":
          if (!selectedVehicles.length || selectedVehicles.length !== 1) {
            throw new Error("Please select exactly one vehicle for vehicle-user comparison");
          }
          if (!selectedUsers.length) {
            throw new Error("Please select at least one user for comparison");
          }
          requestBody = {
            vehicleId: selectedVehicles[0],
            userIds: selectedUsers,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            models: "all"
          };
          endpoint = "getvehicleusercomparison";
          break;

        default:
          throw new Error("Invalid comparison type");
      }

      console.log('Sending request with body:', requestBody);

      const response = await fetch(`http://localhost:5000/api/comparison/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || "Failed to fetch comparison data");
      }

      const data = await response.json();
      console.log('Comparison data:', data);
      return data;
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      throw error;
    }
  };

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) {
          toast({
            title: "Error",
            description: "Please log in to access this feature",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // First fetch users and vehicles
        const [usersData, vehiclesData] = await Promise.all([
          fetchUsersFromDb(),
          fetchVehiclesFromDb(),
        ]);

        console.log('Fetched users:', usersData);
        console.log('Fetched vehicles:', vehiclesData);

        if (usersData.length > 0) {
          setUsers(usersData);
          // Only set initial selection if no users are currently selected
          if (selectedUsers.length === 0) {
            const initialUserIds = [usersData[0]._id];
            setSelectedUsers(initialUserIds);
            setTempSelectedUsers(initialUserIds);
          }
        } else {
          toast({
            title: "Warning",
            description: "No users found under your administration",
            variant: "destructive",
          });
          return;
        }

        if (vehiclesData.length > 0) {
          setVehicles(vehiclesData);
          // Only set initial selection if no vehicles are currently selected
          if (selectedVehicles.length === 0) {
            const initialVehicleIds = [vehiclesData[0]._id];
            setSelectedVehicles(initialVehicleIds);
            setTempSelectedVehicles(initialVehicleIds);
          }
        } else {
          toast({
            title: "Warning",
            description: "No vehicles found under your administration",
            variant: "destructive",
          });
          return;
        }

        // Fetch comparison data
        const comparisonData = await fetchComparisonData();
        if (comparisonData) {
          interface ComparisonDataItem {
            id: string;
            name: string;
            totalAmount: number;
            details: {
              refuelingTotal?: number;
              serviceTotal?: number;
              accessoryTotal?: number;
              taxTotal?: number;
            };
          }
          const formattedData = comparisonData.map((item: ComparisonDataItem) => ({
            name: item.name,
            refueling: item.details.refuelingTotal || 0,
            tax: item.details.taxTotal || 0,
            service: item.details.serviceTotal || 0,
            accessories: item.details.accessoryTotal || 0,
          })) || [];
          setComparisonData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, timeRange, expenseTypes, selectedUsers]);

  useEffect(() => {
    if (isSettingsOpen) {
      setTempSelectedUsers(selectedUsers);
      setTempSelectedVehicles(selectedVehicles);
    }
  }, [isSettingsOpen, selectedUsers, selectedVehicles]);

  useEffect(() => {
    if (selectedUsers.length > 0 || selectedVehicles.length > 0) {
      // Only fetch if we have a valid date range
      if (timeRange !== 'custom' || (customStartDate && customEndDate)) {
        fetchComparisonData();
      }
    }
  }, [selectedUsers, selectedVehicles, timeRange, customStartDate, customEndDate]);

  const getDataBasedOnType = (): ExpenseData[] => {
    switch (comparisonType) {
      case "user":
        if (selectedUsers.length === 0) return [];
        return comparisonData;

      case "vehicle":
        if (selectedVehicles.length === 0) return [];
        return comparisonData;

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
  const handleDialogOk = async () => {
    // Update selected users and vehicles
    setSelectedUsers(tempSelectedUsers);
    setSelectedVehicles(tempSelectedVehicles);
    setIsSettingsOpen(false);

    // Fetch new comparison data with selected users
    try {
      const response = await fetch("http://localhost:5000/api/comparison/getusercomparison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userList: tempSelectedUsers.length ? tempSelectedUsers.map(id => ({ userId: id })) : [{ userId: users[0]?._id || 'all' }],
          startDate: timeRange ? getStartDate() : "2000-01-01",
          endDate: new Date().toISOString(),
          models: "all"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const data = await response.json();
      if (data && data.data) {
        const formattedData = data.data.map((item: any) => ({
          name: item.name,
          refueling: item.refueling || 0,
          tax: item.tax || 0,
          service: item.service || 0,
          accessories: item.accessories || 0,
        }));
        setComparisonData(formattedData);
      }
    } catch (error) {
      console.error('Error updating comparison data:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comparison data',
        variant: 'destructive',
      });
    }
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
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user-vehicle" id="user-vehicle" />
                          <Label htmlFor="user-vehicle" className="text-gray-300">
                            User-Vehicle Comparison
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vehicle-user" id="vehicle-user" />
                          <Label htmlFor="vehicle-user" className="text-gray-300">
                            Vehicle-User Comparison
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Time Range & Chart Style */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Time Range</Label>
                      <Select value={timeRange} onValueChange={(value) => {
                        setTimeRange(value);
                        if (value !== 'custom') {
                          setCustomStartDate("");
                          setCustomEndDate("");
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>

                      {timeRange === 'custom' && (
                        <div className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Start Date</Label>
                            <input
                              type="date"
                              value={customStartDate}
                              onChange={(e) => {
                                const newStartDate = e.target.value;
                                setCustomStartDate(newStartDate);
                                // Clear end date if it's before new start date
                                if (customEndDate && new Date(customEndDate) < new Date(newStartDate)) {
                                  setCustomEndDate('');
                                }
                              }}
                              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">End Date</Label>
                            <input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => {
                                const newEndDate = e.target.value;
                                if (!customStartDate) {
                                  toast({
                                    title: 'Error',
                                    description: 'Please select a start date first',
                                    variant: 'destructive',
                                  });
                                  return;
                                }
                                if (new Date(newEndDate) < new Date(customStartDate)) {
                                  toast({
                                    title: 'Error',
                                    description: 'End date cannot be before start date',
                                    variant: 'destructive',
                                  });
                                  return;
                                }
                                setCustomEndDate(newEndDate);
                              }}
                              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                              min={customStartDate}
                            />
                          </div>
                        </div>
                      )}

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
                        {["refueling", "tax", "service", "accessories"].map((type) => (
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
                  {(comparisonType === "user" || comparisonType === "user-vehicle") && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">
                        {comparisonType === "user-vehicle" ? "Select User" : "Select Users"}
                      </Label>
                      <ScrollArea className="h-32 border rounded-md p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {users.map((user) => (
                            <div key={user._id} className="flex items-center space-x-2">
                              {comparisonType === "user-vehicle" ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name="user-selection"
                                    value={user._id}
                                    id={`select-user-${user._id}`}
                                    checked={tempSelectedUsers.includes(user._id)}
                                    onChange={() => setTempSelectedUsers([user._id])}
                                  />
                                </div>
                              ) : (
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
                              )}
                              <Label
                                htmlFor={`select-user-${user._id}`}
                                className="text-gray-300"
                              >
                                {user.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Vehicle Selection */}
                  {(comparisonType === "vehicle" || comparisonType === "vehicle-user" || 
                    (comparisonType === "user-vehicle" && tempSelectedUsers.length === 1)) && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">
                        {comparisonType === "vehicle-user" ? "Select Vehicle" : "Select Vehicles"}
                      </Label>
                      <ScrollArea className="h-32 border rounded-md p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {vehicles.map((vehicle) => (
                            <div key={vehicle._id} className="flex items-center space-x-2">
                              {comparisonType === "vehicle-user" ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name="vehicle-selection"
                                    value={vehicle._id}
                                    id={`select-vehicle-${vehicle._id}`}
                                    checked={tempSelectedVehicles.includes(vehicle._id)}
                                    onChange={() => setTempSelectedVehicles([vehicle._id])}
                                  />
                                </div>
                              ) : (
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
                              )}
                              <Label
                                htmlFor={`select-vehicle-${vehicle._id}`}
                                className="text-gray-300"
                              >
                                {vehicle.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* User Selection for Vehicle-User Comparison */}
                  {comparisonType === "vehicle-user" && tempSelectedVehicles.length === 1 && (
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
                              <Label
                                htmlFor={`select-user-${user._id}`}
                                className="text-gray-300"
                              >
                                {user.name}
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
          {currentData.length === 0 ? (
            <div className="col-span-2 flex justify-center items-center py-12">
              <p>Please select users and/or vehicles to display expense data</p>
            </div>
          ) : isLoading ? (
            <div className="col-span-2 flex justify-center items-center py-12">
              <p>Loading expense data...</p>
            </div>
          ) : (
            <>
                {chartTypes.includes("pie") && (
                <div className="w-full">
                  <ExpensePieChart
                    data={currentData.map(item => ({
                      name: item.name,
                      value: expenseTypes.reduce((sum, type) => 
                        sum + (typeof item[type] === 'number' ? (item[type] as number) : 0), 0)
                    }))}
                    colors={COLORS}
                    className="w-full"
                  />
                </div>
              )}

              {chartTypes.includes("bar") && (
                <div className="w-full">
                  <ExpenseBarChart
                    data={currentData}
                    expenseTypes={expenseTypes}
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

          
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseComparison;
