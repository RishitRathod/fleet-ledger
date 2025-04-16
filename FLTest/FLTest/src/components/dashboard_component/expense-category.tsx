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

interface ExpenseData {
  name: string;
  totalAmount: number;
  expenseBreakdown: {
    refueling: {
      amount: number;
      percentage: number;
    };
    service: {
      amount: number;
      percentage: number;
    };
    accessories: {
      amount: number;
      percentage: number;
    };
  };
}

export function ExpenseCategory({ className }: { className?: string }) {
  const [expenseData, setExpenseData] = React.useState<ExpenseData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicles/getExpenseCategory');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        // Get the first vehicle's data for the expense breakdown
        if (data.length > 0) {
          setExpenseData(data[0]);
          
          // Log the expense distribution
          console.log('\n📊 Expense Distribution Analysis');
          console.log('----------------------------------------');
          console.log(`Vehicle: ${data[0].name}`);
          console.log(`Total Expenses: ₹${data[0].totalAmount.toLocaleString()}`);
          console.log('\nExpense Breakdown:');
          console.log(`1. Refueling: ₹${data[0].expenseBreakdown.refueling.amount.toLocaleString()} (${data[0].expenseBreakdown.refueling.percentage.toFixed(2)}%)`);
          console.log(`2. Services: ₹${data[0].expenseBreakdown.service.amount.toLocaleString()} (${data[0].expenseBreakdown.service.percentage.toFixed(2)}%)`);
          console.log(`3. Accessories: ₹${data[0].expenseBreakdown.accessories.amount.toLocaleString()} (${data[0].expenseBreakdown.accessories.percentage.toFixed(2)}%)`);
          console.log('----------------------------------------');
          
          // Log percentage distribution analysis
          console.log('\n📈 Percentage Distribution Analysis');
          console.log('----------------------------------------');
          const totalPercentage = data[0].expenseBreakdown.refueling.percentage + 
                                data[0].expenseBreakdown.service.percentage + 
                                data[0].expenseBreakdown.accessories.percentage;
          console.log(`Total Percentage: ${totalPercentage.toFixed(2)}%`);
          console.log('----------------------------------------');
        }
      } catch (error) {
        console.error('Error fetching expense data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  const expenseCategories = expenseData ? [
    { 
      name: "Fuel", 
      value: expenseData.expenseBreakdown.refueling.percentage, 
      color: "#4CAF50",
      amount: expenseData.expenseBreakdown.refueling.amount
    },
    { 
      name: "Services", 
      value: expenseData.expenseBreakdown.service.percentage, 
      color: "#1976D2",
      amount: expenseData.expenseBreakdown.service.amount
    },
    { 
      name: "Accessories", 
      value: expenseData.expenseBreakdown.accessories.percentage, 
      color: "#FFC107",
      amount: expenseData.expenseBreakdown.accessories.amount
    }
  ] : [];

  if (loading) {
    return (
      <Card className={`p-4 md:p-6 h-[170px] flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground">Loading expense data...</div>
      </Card>
    );
  }

  if (!expenseData) {
    return (
      <Card className={`p-4 md:p-6 h-[170px] flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground">No expense data available</div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 md:p-6 h-[170px] flex flex-col justify-center ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Expense Categories</h3>
          <HelpCircle className="h-2 w-4 text-muted-foreground cursor-help" />
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
              <div className="text-lg font-semibold">{item.value.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">{item.name}</div>
              <div className="text-xs text-muted-foreground">₹{item.amount.toLocaleString()}</div>
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
