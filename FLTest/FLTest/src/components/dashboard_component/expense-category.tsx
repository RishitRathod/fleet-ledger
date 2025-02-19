import * as React from "react";
import { HelpCircle } from "lucide-react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-300 ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const expenseCategories = [
  { name: "Fuel", value: 80.4, color: "#4CAF50" }, // Green
  { name: "Maintenance", value: 11.6, color: "#1976D2" }, // Blue
  { name: "Insurance", value: 8.0, color: "#FFC107" }, // Yellow
];

export function ExpenseCategory() {
  return (
    <Card className="p-4 md:p-6 transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Expense Categories</h3>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </div>

        {/* Progress Bar with Multiple Colors & White Lines */}
        <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 relative">
          <div className="flex w-full h-full">
            {expenseCategories.map((item, index) => (
              <div
                key={index}
                className="h-full transition-all duration-300 hover:opacity-80 relative"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              >
                {/* White separator line (except last one) */}
                {index < expenseCategories.length - 1 && (
                  <div className="absolute right-0 top-0 h-full w-[2px] bg-white"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Labels & Color Indicators */}
        <div className="flex justify-between items-center mt-2">
          {expenseCategories.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-semibold">{item.value}%</div>
              <div className="text-xs text-muted-foreground mt-1">{item.name}</div>
              {/* Color Indicator Below Labels */}
              <div
                className="w-4 h-1 rounded-full mx-auto mt-1"
                style={{ backgroundColor: item.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
