"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VehicleData {
  name: string;
  totalAmount: number;
}

interface ChartDataItem {
  vehicle: string;
  expense: number;
  fill: string;
}

const fetchVehicleData = async (): Promise<VehicleData[]> => {
  try {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    let url = "http://localhost:5000/api/vehicles/getVehiclesWithTotalAmount";
    let options: RequestInit = { method: "GET" };

    if (role === "user") {
      url = "http://localhost:5000/api/vehicles/getvehiclecomparisonbyemail";
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      };
    }

    console.log('Fetching from URL:', url, 'with options:', options);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log('Received data:', data);
    return data;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    return [];
  }
};

export function VehiclewiseExpense() {
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [totalExpense, setTotalExpense] = React.useState(0);

  React.useEffect(() => {
    fetchVehicleData().then((data) => {
      const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
      ];

      // Ensure data is an array
      const vehiclesArray = Array.isArray(data) ? data : [data];
      console.log('Processing vehicles array:', vehiclesArray);

      const formattedData = vehiclesArray
        .filter((vehicle) => vehicle && vehicle.totalAmount > 0)
        .map((vehicle, index) => ({
          vehicle: vehicle.name,
          expense: parseFloat(vehicle.totalAmount.toString()),
          fill: colors[index % colors.length],
        }));

      console.log('Formatted chart data:', formattedData);
      const total = formattedData.reduce((sum, item) => sum + item.expense, 0);
      setChartData(formattedData);
      setTotalExpense(total);
    });
  }, []);

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.vehicle] = { label: item.vehicle, color: item.fill };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle-wise Expenses</CardTitle>
        <CardDescription>Total expenses by vehicle</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            width={400}
            height={250}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="vehicle"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
            <ChartTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="expense"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              shape={(props: unknown) => (
                <Rectangle
                  {...(props as {
                    fill: string;
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                  })}
                  fill={(props as { fill: string }).fill}
                  stroke={(props as { fill: string }).fill}
                  strokeWidth={2}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Expense: ₹{totalExpense.toLocaleString()}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses for all vehicles
        </div>
      </CardFooter>
    </Card>
  );
}
