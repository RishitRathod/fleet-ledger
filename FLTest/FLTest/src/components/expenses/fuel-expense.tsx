"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useExpenseModal } from "./expense-store";
import CalendarDialog from "../calender-dialog";
interface VehicleOption {
  value: string;
  label: string;
}

const fuelTypes = [
  { id: 1, name: "Petrol" },
  { id: 2, name: "Diesel" },
  { id: 3, name: "CNG" },
];

export function FuelExpenseModal() {
  const { isOpen, onClose, type } = useExpenseModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const userEmail = localStorage.getItem("email");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("");
  const [fuelQuantity, setFuelQuantity] = useState<number>(0);
  const [pricePerLiter, setPricePerLiter] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (userEmail) {
      fetchVehicles();
    }
  }, [userEmail]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getVehicleunderadmin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const data = await response.json();

      if (data.success && data.vehicles) {
        const vehicleOptions = data.vehicles.map((vehicle: any) => ({
          value: vehicle.id,
          label: vehicle.name,
        }));

        setVehicles(vehicleOptions);
        console.log("Vehicles fetched2:", vehicleOptions);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      });
    }
  };

  if (type !== "fuel") return null;

  const handleFuelCalculation = (quantity: number, price: number) => {
    const total = quantity * price;
    setTotalAmount(total);
  };

  const validateForm = () => {
    if (!selectedVehicle) {
      toast({
        title: "Error",
        description: "Please select a vehicle",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedFuelType) {
      toast({
        title: "Error",
        description: "Please select fuel type",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const email = localStorage.getItem("email");
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ORIGIN}/api/refuelings/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vehicleId: selectedVehicle,
            date: formattedDate,
            fuelType: selectedFuelType,
            liters: fuelQuantity,
            pricePerLiter,
            totalAmount,
            email
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense");
      }

      toast({
        title: "Success",
        description: "Fuel expense added successfully",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "fuel"} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add Fuel Expense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Vehicle</Label>
              <Select
                value={selectedVehicle}
                onValueChange={setSelectedVehicle}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.value} value={vehicle.value}>
                      {vehicle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CalendarDialog
              selectedDate={selectedDate}
              onDateSelect={(date) => setSelectedDate(date)}
            />

            {/* <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div> */}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Fuel Type</Label>
              <Select
                value={selectedFuelType}
                onValueChange={setSelectedFuelType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel.id} value={fuel.id.toString()}>
                      {fuel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Quantity (Liters)</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                className="w-full"
                min={0}
                value={fuelQuantity}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setFuelQuantity(value);
                  handleFuelCalculation(value, pricePerLiter);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Price per Liter</Label>
              <Input
                type="number"
                placeholder="Enter price per liter"
                className="w-full"
                min={0}
                value={pricePerLiter}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setPricePerLiter(value);
                  handleFuelCalculation(fuelQuantity, value);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Total Amount</Label>
              <Input
                type="number"
                className="w-full"
                value={totalAmount}
                disabled
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
