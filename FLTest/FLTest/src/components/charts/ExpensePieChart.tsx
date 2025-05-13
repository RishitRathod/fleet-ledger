"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";



interface ChartDataItem {
  name: string;
  value: number;
  fill?: string;
}



interface ExpensePieChartProps {
  data: ChartDataItem[];
  colors: string[];
  className?: string;
}

const ExpensePieChart = ({ data, colors, className }: ExpensePieChartProps) => {
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [totalExpense, setTotalExpense] = React.useState(0);

  React.useEffect(() => {
    const chartData = data.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
    }));
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    setChartData(chartData);
    setTotalExpense(total);
  }, [data, colors]);

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
          ₹{totalExpense.toLocaleString()}
        </tspan>
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className=" pb-0">
        <CardTitle>User Expense Distribution</CardTitle>
        <CardDescription>Total expenses by user</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0] as { name: string; value: number };
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            User
                          </span>
                          <span className="font-bold">{data.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Amount
                          </span>
                          <span className="font-bold">
                            ₹{data.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={0}
                strokeWidth={0}
              >
                <Label content={<CustomLabel />} position="center" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
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


export default ExpensePieChart;