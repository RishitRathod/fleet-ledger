"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseLineChartProps {
  data: any[];
  expenseTypes: string[];
  colors: string[];
}

function ExpenseLineChart({ data, expenseTypes, colors }: ExpenseLineChartProps) {
  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle>Line Chart Comparison</CardTitle>
      </CardHeader>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {expenseTypes.map((type, index) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={colors[index % colors.length]}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ExpenseLineChart;
