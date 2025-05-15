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
        const role = localStorage.getItem('role');
        let response;
        if(role === 'admin') {
          response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getExpenseCategory`);
        } else {
          const userEmail = localStorage.getItem('email');
          console.log('Fetching expense data for user with email:', userEmail);
          response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getExpenseCategoryByUserEmail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
          });
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        // For admin role, data comes as an array of vehicles
        if (role === 'admin') {
          // Calculate totals across all vehicles
          const totalRefueling = data.reduce((sum: number, vehicle: any) => 
            sum + vehicle.expenseBreakdown.refueling.amount, 0);
          const totalService = data.reduce((sum: number, vehicle: any) => 
            sum + vehicle.expenseBreakdown.service.amount, 0);
          const totalAccessories = data.reduce((sum: number, vehicle: any) => 
            sum + vehicle.expenseBreakdown.accessories.amount, 0);
          
          const grandTotal = totalRefueling + totalService + totalAccessories;

          // Create aggregated data
          const expenseInfo = {
            name: 'All Vehicles',
            totalAmount: grandTotal,
            expenseBreakdown: {
              refueling: {
                amount: totalRefueling,
                percentage: grandTotal > 0 ? (totalRefueling / grandTotal) * 100 : 0
              },
              service: {
                amount: totalService,
                percentage: grandTotal > 0 ? (totalService / grandTotal) * 100 : 0
              },
              accessories: {
                amount: totalAccessories,
                percentage: grandTotal > 0 ? (totalAccessories / grandTotal) * 100 : 0
              }
            }
          };
          setExpenseData(expenseInfo);
        } else {
          // For user role, data comes directly
          const totalAmount = data.refueling.amount + data.service.amount + data.accessories.amount;
          const expenseInfo = {
            name: 'Vehicle Expenses',
            totalAmount: totalAmount,
            expenseBreakdown: {
              refueling: {
                amount: data.refueling.amount || 0,
                percentage: totalAmount > 0 ? (data.refueling.amount / totalAmount) * 100 : 0
              },
              service: {
                amount: data.service.amount || 0,
                percentage: totalAmount > 0 ? (data.service.amount / totalAmount) * 100 : 0
              },
              accessories: {
                amount: data.accessories.amount || 0,
                percentage: totalAmount > 0 ? (data.accessories.amount / totalAmount) * 100 : 0
              }
            }
          };
          setExpenseData(expenseInfo);
        }

        // Log the data structure for debugging
        if (expenseData) {
          
          // Log the expense distribution
          console.log('\n📊 Expense Distribution Analysis');
          console.log('----------------------------------------');
          console.log(`Vehicle: ${expenseData.name}`);
          console.log(`Total Expenses: ₹${expenseData.totalAmount.toLocaleString()}`);
          console.log('\nExpense Breakdown:');
          console.log(`1. Refueling: ₹${expenseData.expenseBreakdown.refueling.amount.toLocaleString()} (${expenseData.expenseBreakdown.refueling.percentage.toFixed(2)}%)`);
          console.log(`2. Services: ₹${expenseData.expenseBreakdown.service.amount.toLocaleString()} (${expenseData.expenseBreakdown.service.percentage.toFixed(2)}%)`);
          console.log(`3. Accessories: ₹${expenseData.expenseBreakdown.accessories.amount.toLocaleString()} (${expenseData.expenseBreakdown.accessories.percentage.toFixed(2)}%)`);
          console.log('----------------------------------------');
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

  // Calculate total amount for percentage validation
  const totalAmount = expenseData ? (
    expenseData.expenseBreakdown.refueling.amount +
    expenseData.expenseBreakdown.service.amount +
    expenseData.expenseBreakdown.accessories.amount
  ) : 0;

  // Debug log the amounts and calculations
  if (expenseData) {
    console.log('Debug: Expense Amounts', {
      total: totalAmount,
      fuel: expenseData.expenseBreakdown.refueling.amount,
      fuelPercent: (expenseData.expenseBreakdown.refueling.amount / totalAmount) * 100,
      services: expenseData.expenseBreakdown.service.amount,
      servicesPercent: (expenseData.expenseBreakdown.service.amount / totalAmount) * 100,
      accessories: expenseData.expenseBreakdown.accessories.amount,
      accessoriesPercent: (expenseData.expenseBreakdown.accessories.amount / totalAmount) * 100
    });
  }

  // Create categories with validated percentages
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
          <div className="relative w-full h-full">
            {expenseCategories.map((item, index) => {
              console.log(`Rendering bar for ${item.name}: ${item.value}%`);
              return (
                <div
                  key={index}
                  className="absolute h-full transition-all duration-300 hover:opacity-80"
                  style={{
                    left: `${expenseCategories
                      .slice(0, index)
                      .reduce((acc, curr) => acc + curr.value, 0)}%`,
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                  }}
                >
                  {/* White separator line (except last one) */}
                  {index < expenseCategories.length - 1 && (
                    <div className="absolute right-0 top-0 h-full w-[2px] bg-white"></div>
                  )}
                </div>
              );
            })}
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
