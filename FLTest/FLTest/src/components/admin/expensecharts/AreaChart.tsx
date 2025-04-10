"use client"

import * as React from "react"
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
  name: string
  amount: number
}

interface AreaChartProps {
  data: ChartData[]
}

function AreaChart({ data }: AreaChartProps) {
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0)
  }, [data])

  const chartConfig = React.useMemo(() => {
    return data.reduce((acc, item, index) => {
      const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
      ]
      acc[item.name] = {
        label: item.name,
        color: colors[index % colors.length],
      }
      return acc
    }, {} as ChartConfig)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Accumulation</CardTitle>
        <CardDescription>Cumulative expense growth</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null
                    const data = payload[0]
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Month
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
                    )
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1) / 0.3)"
                  strokeWidth={2}
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Expense: ₹{total.toLocaleString()}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing cumulative expense growth
        </div>
      </CardFooter>
    </Card>
  )
}

export default AreaChart
