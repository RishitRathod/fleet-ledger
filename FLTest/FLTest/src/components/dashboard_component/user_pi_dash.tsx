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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  totalAmount: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
    value: number;
  }>;
}

const fetchUserData = async (): Promise<UserData[]> => {
  try {
    const response = await fetch(
      "http://localhost:5001/api/users/getUsersWithTotalAmount"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export function UserPiDash() {
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [totalExpense, setTotalExpense] = React.useState(0);

  React.useEffect(() => {
    fetchUserData().then((data) => {
      const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
      ];

      const formattedData = data
        .filter((user) => user.totalAmount > 0)
        .map((user, index) => ({
          name: user.name,
          value: parseFloat(user.totalAmount.toString()),
          fill: colors[index % colors.length],
        }));

      const total = formattedData.reduce((sum, item) => sum + item.value, 0);

      setChartData(formattedData);
      setTotalExpense(total);
    });
  }, []);

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
    <Card className="flex flex-col">
      <CardHeader className=" pb-0">
        <CardTitle>User Expense Distribution</CardTitle>
        <CardDescription>Total expenses by user</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={({ active, payload }: TooltipProps) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const data = payload[0];
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            User
                          </span>
                          <span className="font-bold">{data.payload.name}</span>
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
