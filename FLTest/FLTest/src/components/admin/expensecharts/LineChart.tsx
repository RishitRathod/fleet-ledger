"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer } from "recharts"

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

interface MonthlyData {
  name: string;
  expenses: number;
  income: number;
}

interface LineChartProps {
  data: MonthlyData[];
}

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig

export function LineChartComponent({ data }: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>Expenses and Income Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 24,
                  right: 24,
                  left: 24,
                  bottom: 24,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
