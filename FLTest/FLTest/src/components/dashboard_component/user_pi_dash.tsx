"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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

// Dummy user expense data generator
const users = ["Alice", "Bob", "Charlie", "David", "Eve"]
const generateDummyData = () => {
  return users.map((user, index) => ({
    user,
    expense: Math.floor(Math.random() * 500000) + 50000, // Random expense between 50k - 550k
    fill: `hsl(var(--chart-${index + 1}))`,
  }))
}

export function UserPiDash() {
  const [chartData, setChartData] = React.useState(generateDummyData())

  React.useEffect(() => {
    // Simulate backend API fetch
    const fetchUserExpenses = () => {
      setTimeout(() => {
        setChartData(generateDummyData())
      }, 1000) // Simulating network delay
    }
    fetchUserExpenses()
  }, [])

  const chartConfig: ChartConfig = users.reduce((acc, user, index) => {
    acc[user] = { label: user, color: `hsl(var(--chart-${index + 1}))` }
    return acc
  }, {} as ChartConfig)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User-wise Expenses</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
  <ChartContainer
    config={chartConfig}
    className="mx-auto aspect-square max-h-[250px] flex items-center justify-center"
  >
    <PieChart width={250} height={250} className="mx-auto">
      <ChartTooltip content={<ChartTooltipContent nameKey="expense" hideLabel />} />
     <Pie
  data={chartData}
  dataKey="expense"
  cx="50%"
  cy="50%"
  innerRadius={50}
  outerRadius={100}
  labelLine={false}
  label={({ payload, ...props }) => (
    <text
      x={props.x}
      y={props.y}
      textAnchor={props.textAnchor}
      dominantBaseline={props.dominantBaseline}
      fill="hsla(var(--foreground))"
      fontSize="12px"  // Make text smaller to fit better
      fontWeight="bold"
      style={{ pointerEvents: "none" }} // Prevents labels from being hidden by tooltips
    >
      {payload.expense.toLocaleString("id-ID")}
    </text>
  )}
  nameKey="user"
/>

    </PieChart>
  </ChartContainer>
</CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total user expenses for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
