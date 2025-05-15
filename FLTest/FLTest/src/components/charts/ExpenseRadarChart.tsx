"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface ExpenseRadarChartProps {
  data: any[];
  expenseTypes: string[];
  colors: string[];
}

function ExpenseRadarChart({ data, expenseTypes, colors }: ExpenseRadarChartProps) {
  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle>Radar Chart Comparison</CardTitle>
      </CardHeader>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <Tooltip />
            <Legend />
            {expenseTypes.map((type, index) => (
              <Radar
                key={type}
                name={type.charAt(0).toUpperCase() + type.slice(1)}
                dataKey={type}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ExpenseRadarChart;
