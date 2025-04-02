import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

interface LineChartProps {
  data: any[];
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 250 }) => {
  const { theme } = useTheme();

  const chartStyles = {
    light: {
      gridColor: "#e5e7eb",
      textColor: "#1f2937",
      backgroundColor: "#ffffff",
    },
    dark: {
      gridColor: "#4b5563",
      textColor: "#f3f4f6",
      backgroundColor: "#1f2937",
    },
  };

  const getChartStyle = (currentTheme: string) => {
    return chartStyles[currentTheme as keyof typeof chartStyles] || chartStyles.light;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid 
          vertical={false} 
          stroke={getChartStyle(theme as keyof typeof chartStyles).gridColor} 
          strokeDasharray="3 3" 
        />
        <XAxis 
          dataKey="name" 
          tickLine={false} 
          tickMargin={10} 
          axisLine={false}
          tick={{ fill: getChartStyle(theme as keyof typeof chartStyles).textColor }}
        />
        <YAxis 
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fill: getChartStyle(theme as keyof typeof chartStyles).textColor }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: getChartStyle(theme as keyof typeof chartStyles).backgroundColor,
            color: getChartStyle(theme as keyof typeof chartStyles).textColor,
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        />
        <RechartsLine 
          type="monotone" 
          dataKey="expenses" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2}
        />
        <RechartsLine 
          type="monotone" 
          dataKey="income" 
          stroke="hsl(var(--chart-2))" 
          strokeWidth={2}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
