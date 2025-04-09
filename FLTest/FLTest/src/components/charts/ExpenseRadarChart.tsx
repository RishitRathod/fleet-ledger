"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ExpenseRadarChartProps {
  data: any[];
  expenseTypes: string[];
  colors: string[];
}

function ExpenseRadarChart({ data, expenseTypes, colors }: ExpenseRadarChartProps) {
  const chartConfig = expenseTypes.reduce((acc, type, index) => ({
    ...acc,
    [type]: {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      color: colors[index % colors.length]
    }
  }), {} as ChartConfig)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Radar Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={data}>
            <PolarAngleAxis dataKey="name" />
            <PolarGrid />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            {expenseTypes.map((type) => (
              <Radar
                key={type}
                dataKey={type}
                fill={`var(--color-${type})`}
                fillOpacity={0.6}
              />
            ))}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ExpenseRadarChart;
