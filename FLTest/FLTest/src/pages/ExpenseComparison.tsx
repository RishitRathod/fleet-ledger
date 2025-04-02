import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { 
  Card, 
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  { user: "John", vehicle: "Vehicle 1", fuel: 95000, maintenance: 25000, insurance: 15000 },
  { user: "John", vehicle: "Vehicle 2", fuel: 120000, maintenance: 40000, insurance: 15000 },
  { user: "Alice", vehicle: "Vehicle 1", fuel: 65000, maintenance: 10000, insurance: 15000 },
  { user: "Bob", vehicle: "Vehicle 3", fuel: 145000, maintenance: 55000, insurance: 15000 },
  { user: "Carol", vehicle: "Vehicle 4", fuel: 80000, maintenance: 30000, insurance: 15000 },
  { user: "David", vehicle: "Vehicle 5", fuel: 75000, maintenance: 22000, insurance: 15000 },
  { user: "Alice", vehicle: "Vehicle 2", fuel: 85000, maintenance: 35000, insurance: 15000 },
  { user: "Bob", vehicle: "Vehicle 1", fuel: 75000, maintenance: 30000, insurance: 15000 },
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const ExpenseComparison = () => {
  const { toast } = useToast();
  const [comparisonType, setComparisonType] = useState<"user" | "vehicle" | "user-vehicle">("vehicle");
  const [chartTypes, setChartTypes] = useState<string[]>(["bar"]);
  const [timeRange, setTimeRange] = useState("month");
  const [expenseTypes, setExpenseTypes] = useState<string[]>(["fuel", "maintenance", "insurance"]);
  const [chartStyle, setChartStyle] = useState("stacked");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedUsersForVehicle, setSelectedUsersForVehicle] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Get current data based on comparison type
  const getDataBasedOnType = () => {
    if (comparisonType === "user-vehicle" && selectedVehicle) {
      const filteredData = userVehicleData.filter(item => item.vehicle === selectedVehicle);
      
      // If users are selected, filter by those users
      if (selectedUsersForVehicle.length > 0) {
        return filteredData
          .filter(item => selectedUsersForVehicle.includes(item.user))
          .map(item => ({
            name: item.user,
            fuel: item.fuel,
            maintenance: item.maintenance,
            insurance: item.insurance
          }));
      }
      
      return filteredData.map(item => ({
        name: item.user,
        fuel: item.fuel,
        maintenance: item.maintenance,
        insurance: item.insurance
      }));
    }
    
    return comparisonType === "user" ? userData : vehicleData;
  }

  const currentData = getDataBasedOnType();

  const handleCheckboxChange = (value: string) => {
    setChartTypes(prev => 
      prev.includes(value) 
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  };

  const handleExpenseTypeChange = (value: string) => {
    setExpenseTypes(prev => 
      prev.includes(value) 
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data is being exported as CSV",
    });
  };

  const getTotalExpense = (item: any) => {
    return expenseTypes.reduce((sum, type) => sum + (item[type] || 0), 0);
  };

  const pieData = currentData.map(item => ({
    name: item.name,
    value: getTotalExpense(item),
  }));

  // Get unique vehicles for dropdown
  const uniqueVehicles = Array.from(new Set(userVehicleData.map(item => item.vehicle)));
  
  // Get users for the selected vehicle
  const usersForSelectedVehicle = selectedVehicle ? [...new Set(
    userVehicleData
      .filter(item => item.vehicle === selectedVehicle)
      .map(item => item.user)
  )] : [];

  const handleVehicleSelectionChange = (vehicle: string) => {
    setSelectedVehicle(vehicle);
    setSelectedUsersForVehicle([]); // Reset selected users when vehicle changes
  };

  return (
    <div className="bg-gradient-to-br w-[1200px] pr-[25px] pl-[25px] min-h-screen relative">
      <div className="animate-fade-in max-w-[1800px] mx-auto space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-2xl font-bold">Expense Comparison</h2>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[700px] w-[90vw] bg-gray-500 border border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Comparison Settings</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Comparison Type */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">Comparison Type</Label>
                      <RadioGroup
                        value={comparisonType}
                        onValueChange={(value: any) => setComparisonType(value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user" className="text-gray-300">User Comparison</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vehicle" id="vehicle" />
                          <Label htmlFor="vehicle" className="text-gray-300">Vehicle Comparison</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user-vehicle" id="user-vehicle" />
                          <Label htmlFor="user-vehicle" className="text-gray-300">User-Vehicle Comparison</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Time Range & Chart Style */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">Time Range</Label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 text-gray-300">
                          <SelectItem value="week" className="text-gray-300">Week</SelectItem>
                          <SelectItem value="month" className="text-gray-300">Month</SelectItem>
                          <SelectItem value="year" className="text-gray-300">Year</SelectItem>
                        </SelectContent>
                      </Select>

                      <Label className="mt-4 block text-gray-300">Chart Style</Label>
                      <Select value={chartStyle} onValueChange={setChartStyle}>
                        <SelectTrigger className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 text-gray-300">
                          <SelectItem value="stacked" className="text-gray-300">Stacked</SelectItem>
                          <SelectItem value="grouped" className="text-gray-300">Grouped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Chart Types */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">Chart Types</Label>
                      <div className="space-y-2">
                        {["bar", "line", "area", "pie"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={chartTypes.includes(type)}
                              onCheckedChange={() => handleCheckboxChange(type)}
                            />
                            <Label htmlFor={type} className="text-gray-300 capitalize">{type} Chart</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expense Types */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">Expense Types</Label>
                      <div className="space-y-2">
                        {["fuel", "maintenance", "insurance"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={expenseTypes.includes(type)}
                              onCheckedChange={() => handleExpenseTypeChange(type)}
                            />
                            <Label htmlFor={type} className="text-gray-300 capitalize">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vehicle Selection for User-Vehicle Comparison */}
                    {comparisonType === "user-vehicle" && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Select Vehicle</Label>
                          <Select value={selectedVehicle} onValueChange={handleVehicleSelectionChange}>
                            <SelectTrigger className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                              <SelectValue placeholder="Select a vehicle" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-gray-300">
                              {[...new Set(userVehicleData.map(item => item.vehicle))].map((vehicle) => (
                                <SelectItem key={vehicle} value={vehicle} className="text-gray-300">{vehicle}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedVehicle && (
                          <div className="space-y-2">
                            <Label className="text-gray-300">Select Users</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {usersForSelectedVehicle.map((user) => (
                                <div key={user} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`user-${user}`}
                                    checked={selectedUsersForVehicle.includes(user)}
                                    onCheckedChange={() => setSelectedUsersForVehicle(prev => 
                                      prev.includes(user)
                                        ? prev.filter(name => name !== user)
                                        : [...prev, user]
                                    )}
                                  />
                                  <Label htmlFor={`user-${user}`} className="text-gray-300">{user}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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
          {chartTypes.includes("bar") && (
            <Card className="p-4 md:p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Bar Chart Comparison</CardTitle>
              </CardHeader>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {expenseTypes.map((type, index) => (
                      <Bar
                        key={type}
                        dataKey={type}
                        fill={COLORS[index % COLORS.length]}
                        stackId={chartStyle === "stacked" ? "stack" : undefined}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {chartTypes.includes("line") && (
            <Card className="p-4 md:p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Line Chart Comparison</CardTitle>
              </CardHeader>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {expenseTypes.map((type, index) => (
                      <Line
                        key={type}
                        type="monotone"
                        dataKey={type}
                        stroke={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {chartTypes.includes("area") && (
            <Card className="p-4 md:p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Area Chart Comparison</CardTitle>
              </CardHeader>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {expenseTypes.map((type, index) => (
                      <Area
                        key={type}
                        type="monotone"
                        dataKey={type}
                        fill={COLORS[index % COLORS.length]}
                        stroke={COLORS[index % COLORS.length]}
                        stackId={chartStyle === "stacked" ? "stack" : undefined}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {chartTypes.includes("pie") && (
            <Card className="p-4 md:p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Total Expense Distribution</CardTitle>
              </CardHeader>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseComparison;
