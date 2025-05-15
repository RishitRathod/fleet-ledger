// import * as React from "react";
// import { HelpCircle } from "lucide-react";

// const Card = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={`rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-300 ${className}`}
//     {...props}
//   />
// ));
// Card.displayName = "Card";

// interface ExpenseData {
//   name: string;
//   totalAmount: number;
//   expenseBreakdown: {
//     refueling: {
//       amount: number;
//       percentage: number;
//     };
//     service: {
//       amount: number;
//       percentage: number;
//     };
//     accessories: {
//       amount: number;
//       percentage: number;
//     };
//   };
// }

// export function ExpenseCategory({ className }: { className?: string }) {
//   const [expenseData, setExpenseData] = React.useState<ExpenseData | null>(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     const fetchExpenseData = async () => {
//       try {
//         const role = localStorage.getItem('role');
//         let response;
//         if(role === 'admin') {
//           response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getExpenseCategory`);
//         } else {
//           const userEmail = localStorage.getItem('email');
//           console.log('Fetching expense data for user with email:', userEmail);
//           response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getExpenseCategoryByUserEmail`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email: userEmail }),
//           });
//         }

//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const data = await response.json();
//         console.log('Fetched data:', data);

//         // For admin role, data comes as an array of vehicles
//         if (role === 'admin') {
//           if (!Array.isArray(data)) {
//             console.error('Expected array of vehicles but got:', typeof data);
//             return;
//           }

//           // Calculate totals for each category
//           let totalRefueling = 0;
//           let totalService = 0;
//           let totalAccessories = 0;

//           data.forEach((vehicle: any) => {
//             if (vehicle && vehicle.expenseBreakdown) {
//               totalRefueling += Number(vehicle.expenseBreakdown.refueling.amount) || 0;
//               totalService += Number(vehicle.expenseBreakdown.service.amount) || 0;
//               totalAccessories += Number(vehicle.expenseBreakdown.accessories.amount) || 0;
//             }
//           });

//           const grandTotal = totalRefueling + totalService + totalAccessories;
//           console.log('Calculated totals:', {
//             totalRefueling,
//             totalService,
//             totalAccessories,
//             grandTotal
//           });

//           // Only set data if we have expenses
//           if (grandTotal > 0) {
//             const expenseInfo = {
//               name: 'All Vehicles',
//               totalAmount: grandTotal,
//               expenseBreakdown: {
//                 refueling: {
//                   amount: totalRefueling,
//                   percentage: (totalRefueling / grandTotal) * 100
//                 },
//                 service: {
//                   amount: totalService,
//                   percentage: (totalService / grandTotal) * 100
//                 },
//                 accessories: {
//                   amount: totalAccessories,
//                   percentage: (totalAccessories / grandTotal) * 100
//                 }
//               }
//             };
//             console.log('Setting expense data:', expenseInfo);
//             setExpenseData(expenseInfo);
//           } else {
//             console.log('No expenses found in data');
//           }
//         } else {
//           // For user role, data comes directly
//           const totalAmount = (data.refueling?.amount || 0) + 
//                             (data.service?.amount || 0) + 
//                             (data.accessories?.amount || 0);

//           if (totalAmount > 0) {
//             const expenseInfo = {
//               name: 'Vehicle Expenses',
//               totalAmount: totalAmount,
//               expenseBreakdown: {
//                 refueling: {
//                   amount: data.refueling?.amount || 0,
//                   percentage: totalAmount > 0 ? ((data.refueling?.amount || 0) / totalAmount) * 100 : 0
//                 },
//                 service: {
//                   amount: data.service?.amount || 0,
//                   percentage: totalAmount > 0 ? ((data.service?.amount || 0) / totalAmount) * 100 : 0
//                 },
//                 accessories: {
//                   amount: data.accessories?.amount || 0,
//                   percentage: totalAmount > 0 ? ((data.accessories?.amount || 0) / totalAmount) * 100 : 0
//                 }
//               }
//             };
//             setExpenseData(expenseInfo);
//           }
//         }

//         // Log the data structure for debugging
//         if (expenseData) {
          
//           // Log the expense distribution
//           console.log('\n📊 Expense Distribution Analysis');
//           console.log('----------------------------------------');
//           console.log(`Vehicle: ${expenseData.name}`);
//           console.log(`Total Expenses: ₹${expenseData.totalAmount.toLocaleString()}`);
//           console.log('\nExpense Breakdown:');
//           console.log(`1. Refueling: ₹${expenseData.expenseBreakdown.refueling.amount.toLocaleString()} (${expenseData.expenseBreakdown.refueling.percentage.toFixed(2)}%)`);
//           console.log(`2. Services: ₹${expenseData.expenseBreakdown.service.amount.toLocaleString()} (${expenseData.expenseBreakdown.service.percentage.toFixed(2)}%)`);
//           console.log(`3. Accessories: ₹${expenseData.expenseBreakdown.accessories.amount.toLocaleString()} (${expenseData.expenseBreakdown.accessories.percentage.toFixed(2)}%)`);
//           console.log('----------------------------------------');
//           console.log('----------------------------------------');
//         }
//       } catch (error) {
//         console.error('Error fetching expense data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExpenseData();
//   }, []);

//   // Calculate total amount for percentage validation
//   const totalAmount = expenseData ? (
//     expenseData.expenseBreakdown.refueling.amount +
//     expenseData.expenseBreakdown.service.amount +
//     expenseData.expenseBreakdown.accessories.amount
//   ) : 0;

//   // Debug log the amounts and calculations
//   if (expenseData) {
//     console.log('Debug: Expense Amounts', {
//       total: totalAmount,
//       fuel: expenseData.expenseBreakdown.refueling.amount,
//       fuelPercent: (expenseData.expenseBreakdown.refueling.amount / totalAmount) * 100,
//       services: expenseData.expenseBreakdown.service.amount,
//       servicesPercent: (expenseData.expenseBreakdown.service.amount / totalAmount) * 100,
//       accessories: expenseData.expenseBreakdown.accessories.amount,
//       accessoriesPercent: (expenseData.expenseBreakdown.accessories.amount / totalAmount) * 100
//     });
//   }

//   // Create categories with validated percentages
//   const expenseCategories = expenseData ? [
//     { 
//       name: "Fuel", 
//       value: Number(expenseData.expenseBreakdown.refueling.percentage) || 0, 
//       color: "#4CAF50",
//       amount: Number(expenseData.expenseBreakdown.refueling.amount) || 0
//     },
//     { 
//       name: "Services", 
//       value: Number(expenseData.expenseBreakdown.service.percentage) || 0, 
//       color: "#1976D2",
//       amount: Number(expenseData.expenseBreakdown.service.amount) || 0
//     },
//     { 
//       name: "Accessories", 
//       value: Number(expenseData.expenseBreakdown.accessories.percentage) || 0, 
//       color: "#FFC107",
//       amount: Number(expenseData.expenseBreakdown.accessories.amount) || 0
//     }
//   ].filter(category => category.amount > 0) : [];

//   if (loading) {
//     return (
//       <Card className={`p-4 md:p-6 h-[170px] flex items-center justify-center ${className}`}>
//         <div className="text-muted-foreground">Loading expense data...</div>
//       </Card>
//     );
//   }

//   if (!expenseData || expenseData.totalAmount === 0) {
//     return (
//       <Card className={`p-4 md:p-6 h-[170px] flex items-center justify-center ${className}`}>
//         <div className="text-muted-foreground">
//           {!expenseData ? 'No expense data available' : 'No expenses recorded yet'}
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card className={`p-4 md:p-6 h-[170px] flex flex-col justify-center ${className}`}>
//       <div className="space-y-4">
//         {/* Header */}
//         <div className="flex items-center gap-2">
//           <h3 className="text-sm font-medium text-muted-foreground">Expense Categories</h3>
//           <HelpCircle className="h-2 w-4 text-muted-foreground cursor-help" />
//         </div>

//         {/* Progress Bar with Multiple Colors & White Lines */}
//         <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 relative">
//           <div className="relative w-full h-full">
//             {expenseCategories
//               .filter(item => item.value > 0) // Only show categories with values > 0
//               .map((item, index, filteredArray) => {
//                 console.log(`Rendering bar for ${item.name}: ${item.value}%`);
//                 const leftPosition = filteredArray
//                   .slice(0, index)
//                   .reduce((acc, curr) => acc + curr.value, 0);
//                 return (
//                   <div
//                     key={index}
//                     className="absolute h-full transition-all duration-300 hover:opacity-80"
//                     style={{
//                       left: `${leftPosition}%`,
//                       width: `${item.value}%`,
//                       backgroundColor: item.color,
//                     }}
//                   >
//                     {/* White separator line (except last one) */}
//                     {index < filteredArray.length - 1 && (
//                       <div className="absolute right-0 top-0 h-full w-[2px] bg-white"></div>
//                     )}
//                   </div>
//                 );
//               })}
//           </div>
//         </div>

//         {/* Labels & Color Indicators */}
//         <div className="flex justify-between items-center mt-2">
//           {expenseCategories.map((item, index) => (
//             <div key={index} className="text-center">
//               <div className="text-lg font-semibold">{item.value.toFixed(1)}%</div>
//               <div className="text-xs text-muted-foreground mt-1">{item.name}</div>
//               <div className="text-xs text-muted-foreground">₹{item.amount.toLocaleString()}</div>
//               {/* Color Indicator Below Labels */}
//               <div
//                 className="w-4 h-1 rounded-full mx-auto mt-1"
//                 style={{ backgroundColor: item.color }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </Card>
//   );
// }


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
          if (!Array.isArray(data)) {
            console.error('Expected array of vehicles but got:', typeof data);
            return;
          }

          // Calculate totals for each category
          let totalRefueling = 0;
          let totalService = 0;
          let totalAccessories = 0;

          data.forEach((vehicle: any) => {
            if (vehicle && vehicle.expenseBreakdown) {
              totalRefueling += Number(vehicle.expenseBreakdown.refueling.amount) || 0;
              totalService += Number(vehicle.expenseBreakdown.service.amount) || 0;
              totalAccessories += Number(vehicle.expenseBreakdown.accessories.amount) || 0;
            }
          });

          const grandTotal = totalRefueling + totalService + totalAccessories;
          console.log('Calculated totals:', {
            totalRefueling,
            totalService,
            totalAccessories,
            grandTotal
          });

          // Only set data if we have expenses
          if (grandTotal > 0) {
            const expenseInfo = {
              name: 'All Vehicles',
              totalAmount: grandTotal,
              expenseBreakdown: {
                refueling: {
                  amount: totalRefueling,
                  percentage: (totalRefueling / grandTotal) * 100
                },
                service: {
                  amount: totalService,
                  percentage: (totalService / grandTotal) * 100
                },
                accessories: {
                  amount: totalAccessories,
                  percentage: (totalAccessories / grandTotal) * 100
                }
              }
            };
            console.log('Setting admin expense data:', expenseInfo);
            setExpenseData(expenseInfo);
          }
        } else {
          // For user role, data comes directly
          if (data && data.expenseBreakdown) {
            const totalAmount = 
              Number(data.expenseBreakdown.refueling.amount || 0) +
              Number(data.expenseBreakdown.service.amount || 0) +
              Number(data.expenseBreakdown.accessories.amount || 0);

            if (totalAmount > 0) {
              const expenseInfo = {
                name: data.name || 'Vehicle Expenses',
                totalAmount: totalAmount,
                expenseBreakdown: {
                  refueling: {
                    amount: Number(data.expenseBreakdown.refueling.amount || 0),
                    percentage: (Number(data.expenseBreakdown.refueling.amount || 0) / totalAmount) * 100
                  },
                  service: {
                    amount: Number(data.expenseBreakdown.service.amount || 0),
                    percentage: (Number(data.expenseBreakdown.service.amount || 0) / totalAmount) * 100
                  },
                  accessories: {
                    amount: Number(data.expenseBreakdown.accessories.amount || 0),
                    percentage: (Number(data.expenseBreakdown.accessories.amount || 0) / totalAmount) * 100
                  }
                }
              };
              console.log('Setting user expense data:', expenseInfo);
              setExpenseData(expenseInfo);
            }
          }
        }

        // Log the data structure for debugging
        if (expenseData) {
          console.log('\n📊 Expense Distribution Analysis');
          console.log('----------------------------------------');
          console.log(`Vehicle: ${expenseData.name}`);
          console.log(`Total Expenses: ₹${expenseData.totalAmount.toLocaleString()}`);
          console.log('\nExpense Breakdown:');
          console.log(`1. Refueling: ₹${expenseData.expenseBreakdown.refueling.amount.toLocaleString()} (${expenseData.expenseBreakdown.refueling.percentage.toFixed(2)}%)`);
          console.log(`2. Services: ₹${expenseData.expenseBreakdown.service.amount.toLocaleString()} (${expenseData.expenseBreakdown.service.percentage.toFixed(2)}%)`);
          console.log(`3. Accessories: ₹${expenseData.expenseBreakdown.accessories.amount.toLocaleString()} (${expenseData.expenseBreakdown.accessories.percentage.toFixed(2)}%)`);
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
      value: expenseData.expenseBreakdown.refueling.percentage || 0, 
      color: "#4CAF50",
      amount: expenseData.expenseBreakdown.refueling.amount || 0
    },
    { 
      name: "Services", 
      value: expenseData.expenseBreakdown.service.percentage || 0, 
      color: "#1976D2",
      amount: expenseData.expenseBreakdown.service.amount || 0
    },
    { 
      name: "Accessories", 
      value: expenseData.expenseBreakdown.accessories.percentage || 0, 
      color: "#FFC107",
      amount: expenseData.expenseBreakdown.accessories.amount || 0
    }
  ].filter(category => category.amount > 0) : [];

  if (loading) {
    return (
      <Card className={`p-4 md:p-6 h-[170px] flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground">Loading expense data...</div>
      </Card>
    );
  }

  if (!expenseData || !expenseCategories.length) {
    return (
      <Card className={`p-4 md:p-6 h-[170px] flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground">
          {!expenseData ? 'No expense data available' : 'No expenses recorded yet'}
        </div>
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