"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface ExpenseBarChartProps {
  data: any[];
  expenseTypes: string[];
  colors: string[];
}

function ExpenseBarChart({ data, expenseTypes, colors }: ExpenseBarChartProps) {
  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle>Bar Chart Comparison</CardTitle>
      </CardHeader>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {expenseTypes.map((type, index) => (
              <Bar
                key={type}
                dataKey={type}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ExpenseBarChart;
