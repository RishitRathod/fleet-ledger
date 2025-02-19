import * as React from "react";
import { ArrowDownIcon, ArrowUpIcon, HelpCircle, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const userExpenseData = [
    { name: "John", value: 35 },
    { name: "Alice", value: 25 },
    { name: "Bob", value: 20 },
    { name: "Carol", value: 5 },
    { name: "David", value: 15 },
  ];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff79c6", "#ff9f55"];
export function UserPiDash() {
  return (
    <Card className="p-4 md:p-6 ">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">User Expense Distribution</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userExpenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
  );
}