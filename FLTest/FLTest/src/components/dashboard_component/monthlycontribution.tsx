"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Sample Data
const users = ["User 1", "User 2", "User 3"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = ["2023", "2024", "2025"];

// Function to Get Days in a Month
const getDaysInMonth = (year: string, month: string) => {
  const monthIndex = months.indexOf(month);
  return new Date(parseInt(year), monthIndex + 1, 0).getDate();
};

// Generate Random Expenses Based on Days
const generateContributionData = (year: string, month: string) => {
  const days = getDaysInMonth(year, month);
  return users.reduce((acc, user) => {
    acc[user] = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      amount: Math.floor(Math.random() * 300000) + 50000, // Expense between 50,000 and 350,000
    }));
    return acc;
  }, {} as Record<string, { day: number; amount: number }[]>);
};

// Determine Box Darkness Based on Expense
const getExpenseShade = (amount: number) => {
  if (amount > 300000) return "bg-green-900";
  if (amount > 250000) return "bg-green-700";
  if (amount > 200000) return "bg-green-500";
  if (amount > 150000) return "bg-green-300";
  return "bg-green-100";
};

export function MonthlyContribution() {
  const [selectedMonth, setSelectedMonth] = React.useState(months[0]);
  const [selectedYear, setSelectedYear] = React.useState(years[0]);
  const [contributionData, setContributionData] = React.useState(generateContributionData(selectedYear, selectedMonth));

  React.useEffect(() => {
    setContributionData(generateContributionData(selectedYear, selectedMonth));
  }, [selectedMonth, selectedYear]);

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <>
      {/* Custom CSS to hide scrollbars */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Card className="p-4 h-[180px] flex flex-col">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <h3 className="text-xs font-medium text-muted-foreground">
              Monthly Expense Contributions
            </h3>
            <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
          </div>

          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-16 text-[10px] h-6 px-2">
                {selectedYear}
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year} className="text-xs">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-20 text-[10px] h-6 px-2">
                {selectedMonth}
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month} className="text-xs">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid Container with hidden scrollbar */}
        <div className="flex-1 overflow-auto no-scrollbar">
          <div
            className="grid grid-cols-[auto,repeat(var(--days-in-month),minmax(14px,1fr))] gap-2"
            style={{ "--days-in-month": daysInMonth } as React.CSSProperties}
          >
            {users.map((user) => (
              <React.Fragment key={user}>
                <div className="text-[10px] font-medium text-muted-foreground pr-2">
                  {user}
                </div>
                {contributionData[user].map((data) => (
                  <div
                    key={`${user}-${data.day}`}
                    className={`w-6 h-6 flex items-center justify-center text-[6px] text-white ${getExpenseShade(
                      data.amount
                    )} rounded-[2px] transition-all cursor-pointer hover:ring-[0.5px] hover:ring-primary group relative`}
                  >
                    <span className="invisible group-hover:visible absolute bg-popover text-popover-foreground px-1.5 py-0.5 rounded shadow-lg -translate-y-full -top-1 left-1/2 -translate-x-1/2 z-20 text-[10px] whitespace-nowrap">
                      Day {data.day}: IDR {data.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}

            <div className="text-[8px] text-muted-foreground font-medium pr-2">
              Day
            </div>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div key={i} className="text-[8px] text-muted-foreground text-center font-medium">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
