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
import { useToast } from "@/hooks/use-toast";
import { UserPiDash } from "../dashboard_component/user_pi_dash";
import { ExpenseCategory } from "../dashboard_component/expense-category";
import { Totalvehicleexpense } from "../dashboard_component/total-vehicle-expense";
import { MonthlyContribution } from "../dashboard_component/monthlycontribution";
import { VehiclewiseExpense } from "../dashboard_component/vehicle-wise-expense";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/slider.css";

// Card Components
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm flex justify-center items-center ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

interface Vehicle {
  id: string;
  name: string;
  model: string;
  registrationNumber: string;
}

interface VehicleData {
  refueling: Array<{
    date: string;
    pricePerLiter: number;
    amount: number;
    liters: number;
    kmStart: number;
    kmEnd: number;
    totalRun: number;
    days: number;
    avgDailyExpense: number;
  }>;
}

interface VehicleCost {
  vehicle: string;
  cost: string;
  avgCostPerKm: number;
}

interface VehicleConsumption {
  vehicle: string;
  consumption: string;
  avgLiters: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const costSliderRef = React.useRef<any>(null);
  const consumptionSliderRef = React.useRef<any>(null);
  
  // Dummy data for vehicles
  const dummyVehicles: Vehicle[] = [
    { id: "1", name: "skoda", model: "2022", registrationNumber: "MH01AB1234" },
    { id: "2", name: "luna", model: "2021", registrationNumber: "MH02CD5678" },
    { id: "3", name: "vdfds", model: "2023", registrationNumber: "MH03EF9012" },
    { id: "4", name: "1234fdfs", model: "2022", registrationNumber: "MH04GH3456" }
  ];

  // Dummy data for vehicle costs
  const dummyCosts: VehicleCost[] = [
    { vehicle: "skoda", cost: "Rs. 3.75", avgCostPerKm: 3.75 },
    { vehicle: "luna", cost: "Rs. 5.20", avgCostPerKm: 5.20 },
    { vehicle: "vdfds", cost: "Rs. 2.90", avgCostPerKm: 2.90 },
    { vehicle: "1234fdfs", cost: "Rs. 4.15", avgCostPerKm: 4.15 }
  ];

  // Dummy data for vehicle consumption
  const dummyConsumption: VehicleConsumption[] = [
    { vehicle: "skoda", consumption: "18.5 km/l", avgLiters: 18.5 },
    { vehicle: "luna", consumption: "12.8 km/l", avgLiters: 12.8 },
    { vehicle: "vdfds", consumption: "22.3 km/l", avgLiters: 22.3 },
    { vehicle: "1234fdfs", consumption: "16.7 km/l", avgLiters: 16.7 }
  ];

  const [vehicles, setVehicles] = React.useState<Vehicle[]>(dummyVehicles);
  const [vehicleCosts, setVehicleCosts] = React.useState<VehicleCost[]>(dummyCosts);
  const [vehicleConsumption, setVehicleConsumption] = React.useState<VehicleConsumption[]>(dummyConsumption);
  const [avgDailyExpense, setAvgDailyExpense] = React.useState<number>(520.35);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Try to fetch real data
        const response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getVehicles`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setVehicles(data.data);
          // Fetch data for each vehicle
          await Promise.all(data.data.map((vehicle: Vehicle) => fetchVehicleData(vehicle.name)));
        } else {
          // If no real data, keep the dummy data
          console.log("No real vehicle data found, using dummy data");
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setError('Error fetching vehicles');
        toast({
          title: "Admin Dashboard",
          description: "Using demo data for visualization",
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [toast]);

  const fetchVehicleData = async (vehicleName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getVehicledata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: vehicleName }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to fetch data for ${vehicleName}`);
      }

      // Process the refueling data
      processVehicleData(vehicleName, data.data);

    } catch (error) {
      console.error(`Error fetching data for ${vehicleName}:`, error);
    }
  };

  const processVehicleData = (vehicleName: string, data: VehicleData) => {
    if (!data.refueling || !Array.isArray(data.refueling) || data.refueling.length === 0) {
      return;
    }

    // Calculate average cost per km
    let totalCost = 0;
    let totalDistance = 0;
    let totalLiters = 0;
    let totalDailyExpense = 0;
    let entryCount = 0;

    data.refueling.forEach(entry => {
      const distance = entry.kmEnd - entry.kmStart;
      if (distance > 0) {
        totalCost += entry.amount;
        totalDistance += distance;
      }
      totalLiters += entry.liters;
      totalDailyExpense += entry.avgDailyExpense || 0;
      entryCount++;
    });

    const avgCostPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;
    const avgLiters = entryCount > 0 ? totalLiters / entryCount : 0;
    const avgDailyExp = entryCount > 0 ? totalDailyExpense / entryCount : 0;

    // Update vehicle costs
    setVehicleCosts(prev => {
      const newCosts = [...prev];
      const existingIndex = newCosts.findIndex(item => item.vehicle === vehicleName);
      
      const newCostItem = {
        vehicle: vehicleName,
        cost: `Rs. ${avgCostPerKm.toFixed(2)}/km`,
        avgCostPerKm: avgCostPerKm
      };

      if (existingIndex >= 0) {
        newCosts[existingIndex] = newCostItem;
      } else {
        newCosts.push(newCostItem);
      }
      
      return newCosts;
    });

    // Update vehicle consumption
    setVehicleConsumption(prev => {
      const newConsumption = [...prev];
      const existingIndex = newConsumption.findIndex(item => item.vehicle === vehicleName);
      
      const newConsumptionItem = {
        vehicle: vehicleName,
        consumption: `${avgLiters.toFixed(2)} Liters`,
        avgLiters: avgLiters
      };

      if (existingIndex >= 0) {
        newConsumption[existingIndex] = newConsumptionItem;
      } else {
        newConsumption.push(newConsumptionItem);
      }
      
      return newConsumption;
    });

    // Update average daily expense
    setAvgDailyExpense(prev => {
      // Calculate weighted average based on number of entries
      const totalEntries = prev > 0 ? entryCount + 1 : entryCount;
      return totalEntries > 0 ? 
        ((prev * (totalEntries - entryCount)) + totalDailyExpense) / totalEntries : 
        avgDailyExp;
    });
  };

  // Slider settings for the dashboard cards
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  // Function to ensure we always have data to display
  React.useEffect(() => {
    // If after API calls we still have no data, use the dummy data
    if (!loading && vehicleCosts.length === 0) {
      setVehicleCosts(dummyCosts);
    }
    if (!loading && vehicleConsumption.length === 0) {
      setVehicleConsumption(dummyConsumption);
    }
    if (!loading && avgDailyExpense === 0) {
      setAvgDailyExpense(520.35);
    }
  }, [loading]);

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br">
      <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6 animate-fade-in">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Left Section - 75% width */}
          <div className="md:col-span-10 space-y-4 md:space-y-6">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="md:col-span-1">
                <Totalvehicleexpense />
              </div>
              <div className="md:col-span-3">
                <ExpenseCategory />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <UserPiDash />
              <VehiclewiseExpense />
            </div>
          </div>

          {/* Right Section - Stats Cards Vertical Layout - 25% width */}
          <div className="md:col-span-2 space-y-4 flex flex-col h-full">
            {/* Slider for Cost per Km */}
            <div className="flex-1 h-[100px]">
              {loading ? (
                <Card className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </Card>
              ) : vehicleCosts.length > 0 ? (
                <Slider ref={costSliderRef} {...sliderSettings} className="h-full">
                  {vehicleCosts.map((item, index) => (
                    <Card key={index} className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
                      <h4 className="text-sm font-medium text-muted-foreground">{item.vehicle} - Cost per Km</h4>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        {item.cost}
                      </p>
                    </Card>
                  ))}
                </Slider>
              ) : (
                <Card className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
                  <p className="text-sm text-muted-foreground">No vehicle data available</p>
                </Card>
              )}
            </div>

            {/* Card for Avg. Daily Expenses */}
            <Card className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
              <h4 className="text-sm font-medium text-muted-foreground">Avg. Daily Expenses</h4>
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Rs. {avgDailyExpense.toFixed(2)}
                </p>
              )}
            </Card>

            {/* Slider for Avg. Daily Consumption */}
            <div className="flex-1">
              {loading ? (
                <Card className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </Card>
              ) : vehicleConsumption.length > 0 ? (
                <Slider ref={consumptionSliderRef} {...sliderSettings} className="h-full">
                  {vehicleConsumption.map((item, index) => (
                    <Card key={index} className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
                      <h4 className="text-sm font-medium text-muted-foreground">{item.vehicle} - Avg. Daily Consumption</h4>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        {item.consumption}
                      </p>
                    </Card>
                  ))}
                </Slider>
              ) : (
                <Card className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
                  <p className="text-sm text-muted-foreground">No consumption data available</p>
                </Card>
              )}
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
