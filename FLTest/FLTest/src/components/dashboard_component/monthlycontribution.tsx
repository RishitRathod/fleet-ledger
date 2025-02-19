import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";

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

// Sample Data
const users = ["User 1", "User 2", "User 3"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

  // Update Data When Month or Year Changes
  React.useEffect(() => {
    setContributionData(generateContributionData(selectedYear, selectedMonth));
  }, [selectedMonth, selectedYear]);

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <Card className="p-4 md:p-6">
      {/* Header with Dropdowns */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Monthly Expense Contributions</h3>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24 text-sm">{selectedYear}</SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-28 text-sm">{selectedMonth}</SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Layout */}
      <div className="grid grid-cols-[auto,repeat(var(--days-in-month),minmax(20px,1fr))] gap-1" style={{ "--days-in-month": daysInMonth } as React.CSSProperties}>
        {/* Expense Data Rows for Each User */}
        {users.map((user) => (
          <React.Fragment key={user}>
            <div className="text-sm font-medium text-muted-foreground">{user}</div>
            {contributionData[user].map((data) => (
             <div
             key={`${user}-${data.day}`}
             className={`w-8 h-8 flex items-center justify-center text-[10px] text-white ${getExpenseShade(data.amount)} rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-primary`}
           >
           
                <span className="hidden group-hover:block absolute bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg -translate-y-full -top-2 left-1/2 -translate-x-1/2 z-20 text-xs">
                  IDR {data.amount.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Days Row Below */}
        <div className="text-xs text-muted-foreground font-semibold">Day</div>
        {Array.from({ length: daysInMonth }, (_, i) => (
          <div key={i} className="text-xs text-muted-foreground text-center font-semibold">
            {i + 1}
          </div>
        ))}
      </div>
    </Card>
  );
}
