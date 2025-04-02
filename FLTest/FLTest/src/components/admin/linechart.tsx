"use client"

import { CartesianGrid, Line, LineChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jun", expenses: 3800 },
  { month: "Aug", expenses: 6800 },
  { month: "Sep", expenses: 4300 },
  { month: "Oct", expenses: 3800 },
  { month: "Nov", expenses: 9300 },
  { month: "Dec", expenses: 3800 },
]

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "#2563eb",
  },
}

export function LineChartComponent({ className }: { className?: string }) {
  return (
    <div className={`bg-black rounded-lg p-4 text-white ${className}`}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-center">Monthly Expenses</div>
        <div className="w-[180px] h-[50px] mx-auto">
          <ChartContainer config={chartConfig}>
            <LineChart
              data={chartData}
              margin={{
                top: 24,
                left: 24,
                right: 24,
              }}
            >
              <CartesianGrid vertical={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    nameKey="expenses"
                    hideLabel
                  />
                }
              />
              <Line
                dataKey="expenses"
                type="natural"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        <div className="text-sm">
          {/* <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month
          </div> */}
          {/* <div className="leading-none text-muted-foreground">
            Showing total expenses for the last 12 months
          </div> */}
        </div>
      </div>
    </div>
  )
}
