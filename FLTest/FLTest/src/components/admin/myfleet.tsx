import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const expenseData = {
  car: {
    totalExpense: 5000,
    totalFuel: 200,
    userExpenses: [
      { name: "User1", value: 2000 },
      { name: "User2", value: 3000 },
    ],
    timelyData: [
      { date: "2023-01-01", expense: 1000 },
      { date: "2023-02-01", expense: 1500 },
      { date: "2023-03-01", expense: 2500 },
    ],
  },
  scooter: {
    totalExpense: 3000,
    totalFuel: 100,
    userExpenses: [
      { name: "User1", value: 1000 },
      { name: "User2", value: 2000 },
    ],
    timelyData: [
      { date: "2023-01-01", expense: 500 },
      { date: "2023-02-01", expense: 1000 },
      { date: "2023-03-01", expense: 1500 },
    ],
  },
  bike: {
    totalExpense: 2000,
    totalFuel: 50,
    userExpenses: [
      { name: "User1", value: 800 },
      { name: "User2", value: 1200 },
    ],
    timelyData: [
      { date: "2023-01-01", expense: 400 },
      { date: "2023-02-01", expense: 600 },
      { date: "2023-03-01", expense: 1000 },
    ],
  },
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const FleetExpenses = () => {
  const [selectedVehicle, setSelectedVehicle] = React.useState("car");
  const [expenseType, setExpenseType] = React.useState("fuel_cost");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Vehicle Expenses Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="car" className="w-full" onValueChange={setSelectedVehicle}>
            <TabsList className="mb-6">
              <TabsTrigger value="car">Car</TabsTrigger>
              <TabsTrigger value="scooter">Scooter</TabsTrigger>
              <TabsTrigger value="bike">Bike</TabsTrigger>
            </TabsList>

            {Object.keys(expenseData).map((vehicle) => (
              <TabsContent key={vehicle} value={vehicle} className="space-y-6">
                <div className="flex items-center justify-between">
                  <Select defaultValue={expenseType} onValueChange={setExpenseType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select expense type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fuel_cost">Fuel Cost</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" /> Add Expense
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary">
                        Rs. {expenseData[vehicle as keyof typeof expenseData].totalExpense.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Total Fuel Consumption</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary">
                        {expenseData[vehicle as keyof typeof expenseData].totalFuel} Ltr.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">User-wise Expense Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseData[vehicle as keyof typeof expenseData].userExpenses}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {expenseData[vehicle as keyof typeof expenseData].userExpenses.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Expense Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={expenseData[vehicle as keyof typeof expenseData].timelyData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(str) => {
                              const date = new Date(str);
                              return date.getDate().toString();
                            }}
                          />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetExpenses;