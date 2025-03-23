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

const Dashboard = () => {
  const { toast } = useToast();
  const costSliderRef = React.useRef<any>(null);
  const consumptionSliderRef = React.useRef<any>(null);

  const vehicleCosts = [
    { vehicle: "Car A", cost: "Rs. 5/km" },
    { vehicle: "Car B", cost: "Rs. 6/km" },
    { vehicle: "Car C", cost: "Rs. 4.5/km" },
    { vehicle: "Car D", cost: "Rs. 5.2/km" },
  ];

  const vehicleConsumption = [
    { vehicle: "Car A", consumption: "5 Liters" },
    { vehicle: "Car B", consumption: "6 Liters" },
    { vehicle: "Car C", consumption: "4.5 Liters" },
    { vehicle: "Car D", consumption: "5.2 Liters" },
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
  };

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
            </div>

            {/* Card for Avg. Daily Expenses */}
            <Card className="p-4 md:p-6 flex flex-col justify-center items-center h-full text-center">
              <h4 className="text-sm font-medium text-muted-foreground">Avg. Daily Expenses</h4>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Rs. 200
              </p>
            </Card>

            {/* Slider for Avg. Daily Consumption */}
            <div className="flex-1">
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
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
