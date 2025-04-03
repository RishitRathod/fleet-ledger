"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
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

// Dummy vehicle expense data
const vehicleExpenseData = [
  { vehicle: "Car A", expense: 52000, fill: "hsl(var(--chart-1))" },
  { vehicle: "Car B", expense: 78000, fill: "hsl(var(--chart-2))" },
  { vehicle: "Truck C", expense: 120000, fill: "hsl(var(--chart-3))" },
  { vehicle: "Van D", expense: 65000, fill: "hsl(var(--chart-4))" },
  { vehicle: "Bike E", expense: 30000, fill: "hsl(var(--chart-5))" },
];

const chartConfig = vehicleExpenseData.reduce((acc, item, index) => {
  acc[item.vehicle] = { label: item.vehicle, color: item.fill };
  return acc;
}, {} as ChartConfig);

export function VehiclewiseExpense({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Vehicle-wise Expenses</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={vehicleExpenseData}
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
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <ChartTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="expense"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              shape={(props: any) => (
                <Rectangle
                  {...props}
                  fill={props.fill}
                  stroke={props.fill}
                  strokeWidth={2}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
