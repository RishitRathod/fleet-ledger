/**
 * @file BarChart.tsx
 * @author [Your Name]
 * @description Bar Chart component for expense charts
 */

"use client";
import {
  Bar,
  BarChart as RechartsBarChart,
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
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
interface BarChartProps {
  chartData: ChartData[];
}

function BarChart({ chartData }: BarChartProps) {
  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  const chartConfig = chartData.reduce((acc, item, index) => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];
    acc[item.name] = { 
      label: item.name, 
      color: colors[index % colors.length] 
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Total expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RechartsBarChart
            data={chartData}
            width={400}
            height={250}
            margin={{ top: 20, right: 20, left: 10 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickFormatter={(value: number) => `₹${value.toLocaleString()}`} />
            <ChartTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="amount"
              fill="hsl(var(--chart-1))"
              radius={[8, 8, 0, 0]}
              shape={(props: any) => {
                const colors = [
                  "hsl(var(--chart-1))",
                  "hsl(var(--chart-2))",
                  "hsl(var(--chart-3))",
                  "hsl(var(--chart-4))",
                  "hsl(var(--chart-5))",
                ];
                const index = chartData.findIndex(item => item.amount === props.payload.amount);
                const color = colors[index % colors.length];
                return (
                  <Rectangle
                    {...props}
                    fill={color}
                    stroke={color}
                    strokeWidth={2}
                  />
                );
              }}
            />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Expense: ₹{total.toLocaleString()}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses by category
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarChart;
