"use client"

import * as React from "react"
import { PieChart as RechartsPieChart, Pie, Cell, Label, ResponsiveContainer } from "recharts";

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
} from "@/components/ui/chart"

interface ChartData {
  name: string;
  amount: number;
  fill?: string;
}

interface PieChartProps {
  chartData: ChartData[];
}

function PieChart({ chartData }: PieChartProps) {
  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [chartData]);

  const CustomLabel = ({
    viewBox,
  }: {
    viewBox?: { cx: number; cy: number };
  }) => {
    if (!viewBox) return null;
    const { cx, cy } = viewBox;
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-1em" fontSize="14" fill="hsl(var(--foreground))">
          Total Expense
        </tspan>
        <tspan
          x={cx}
          dy="1.5em"
          fontSize="16"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          ₹{total.toLocaleString()}
        </tspan>
      </text>
    );
  };

  const chartConfig = React.useMemo(() => {
    return chartData.reduce((acc, item, index) => {
      const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
      ];
      acc[item.name] = {
        label: item.name,
        color: colors[index % colors.length],
      };
      return acc;
    }, {} as ChartConfig);
  }, [chartData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Total expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full">
          <ChartContainer config={chartConfig}>
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={0}
                    strokeWidth={0}
                  >
                    <Label content={<CustomLabel />} position="center" />
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill || `hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const data = payload[0];
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Category
                              </span>
                              <span className="font-bold">{data.payload?.name || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Amount
                              </span>
                              <span className="font-bold">
                                ₹{(data.payload?.value || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </div>
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

export default PieChart;
