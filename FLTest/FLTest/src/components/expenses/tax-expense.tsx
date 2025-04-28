"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useExpenseModal, vehicles } from "./expense-store";
import { DatePickerDemo } from "../date-picker";
import CalendarDialog from "../calender-dialog";
interface VehicleOption {
  value: string;
  label: string;
}

const taxTypes = [
  { id: 1, name: "Road Tax" },
  { id: 2, name: "Insurance" },
  { id: 3, name: "Permit" },
  { id: 4, name: "Other" },
];

export function TaxExpenseModal() {
  const { isOpen, onClose, type } = useExpenseModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedTaxType, setSelectedTaxType] = useState<string>("");
  const [validFrom, setValidFrom] = useState<Date>();
  const [validTo, setValidTo] = useState<Date>();
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (userEmail) {
      fetchVehicles();
    }
  }, [userEmail]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/vehicles/getVehicleunderadmin`,
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
        console.log("Vehicles fetched:", vehicleOptions);
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

  if (type !== "tax") return null;

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

    if (!selectedTaxType) {
      toast({
        title: "Error",
        description: "Please select tax type",
        variant: "destructive",
      });
      return false;
    }
    if (selectedTaxType == "Insurance" || selectedTaxType == "Permit") {
      return;
    }

    // if (!validFrom || !validTo) {
    //   toast({
    //     title: "Error",
    //     description: "Please select validity period",
    //     variant: "destructive",
    //   });
    //   return false;
    // }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Tax expense added successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "tax"} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add Tax Expense
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

            <CalendarDialog />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tax Type</Label>
              <Select
                value={selectedTaxType}
                onValueChange={setSelectedTaxType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tax type" />
                </SelectTrigger>
                <SelectContent>
                  {taxTypes.map((tax) => (
                    <SelectItem key={tax.id} value={tax.id.toString()}>
                      {tax.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTaxType === "2" || selectedTaxType === "3" ? (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valid From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validFrom ? format(validFrom, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validFrom}
                        onSelect={setValidFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valid To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validTo ? format(validTo, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validTo}
                        onSelect={setValidTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            ) : null}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="w-full"
                min={0}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                placeholder="Enter additional details"
                className="min-h-[100px]"
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
