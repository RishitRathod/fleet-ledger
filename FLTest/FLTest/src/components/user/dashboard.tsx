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

// Card Component
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

const DashboardUser = () => {
  const { toast } = useToast();
  
  // Force re-render if needed
  const [sliderKey, setSliderKey] = React.useState(0);
  React.useEffect(() => {
    setSliderKey(prevKey => prevKey + 1);
  }, []);

  const vehicleCosts = [
    { vehicle: "Car A", cost: "Rs. 5/km" },
    { vehicle: "Car B", cost: "Rs. 6/km" },
    { vehicle: "Car C", cost: "Rs. 4.5/km" },
    { vehicle: "Car D", cost: "Rs. 5.2/km" },
  ];

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="bg-gradient-to-br p-4 w-full md:p-6 min-h-screen">
      <div className="animate-fade-in max-w-[1800px] md:space-y-6 mx-auto space-y-4">
        {/* Expense Categories Card - Full Width */}
        <div className="w-full">
          <ExpenseCategory />
        </div>

        {/* Monthly Contribution and Total Vehicle Expenses - Side by Side */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <MonthlyContribution />
          </div>
          <div className="md:col-span-1">
            <Totalvehicleexpense />
          </div>
        </div>

        {/* User Pi Dash and Vehicle-wise Expenses */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
          <UserPiDash />
          <VehiclewiseExpense />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
          <Card className="col-span-1 p-4 md:p-6">
            <h4 className="text-muted-foreground text-sm font-medium">
              Cost per Km (Per Vehicle)
            </h4>
            <div className="w-full relative min-h-[150px]">
              {isClient && (
                <Slider key={sliderKey} {...sliderSettings} className="slider-container">
                  {vehicleCosts.map((item, index) => (
                    <div key={index} className="p-4 text-center">
                      <h5 className="text-lg font-semibold">{item.vehicle}</h5>
                      <p className="bg-clip-text bg-gradient-to-r text-2xl text-transparent font-bold from-blue-500 to-cyan-500">
                        {item.cost}
                      </p>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </Card>

          {["Avg. Daily Expenses", "Avg. Daily Consumption"].map(
            (stat, index) => (
              <Card key={index} className="p-4 md:p-6">
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-sm font-medium">
                    {stat}
                  </h4>
                  <p className="bg-clip-text bg-gradient-to-r text-2xl text-transparent font-bold from-blue-500 to-cyan-500">
                    {index === 0 ? "Rs. 200" : "5 Liters"}
                  </p>
                </div>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
