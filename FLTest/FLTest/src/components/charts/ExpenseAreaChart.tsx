import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseAreaChartProps {
  data: any[];
  expenseTypes: string[];
  chartStyle: 'stacked' | 'grouped';
  colors: string[];
}

const ExpenseAreaChart: React.FC<ExpenseAreaChartProps> = ({ data, expenseTypes, chartStyle, colors }) => {
  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle>Area Chart Comparison</CardTitle>
      </CardHeader>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {expenseTypes.map((type, index) => (
              <Area
                key={type}
                type="monotone"
                dataKey={type}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
                stackId={chartStyle === "stacked" ? "stack" : undefined}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ExpenseAreaChart;
