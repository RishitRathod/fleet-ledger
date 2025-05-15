"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// Calendar import removed as we're using a custom implementation
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useExpenseModal } from "./expense-store";
import CalendarDialog from "@/components/calender-dialog";
interface VehicleOption {
  value: string;
  label: string;
}

export function AccessoriesExpenseModal() {
  const { isOpen, onClose, type } = useExpenseModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // const [currentMonth, setCurrentMonth] = useState(3); // April (0-indexed)
  // const [currentYear, setCurrentYear] = useState(2025);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [accessoryName, setAccessoryName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);

  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

  useEffect(() => {
    if (userEmail) fetchVehicles();
  }, [userEmail]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.SERVER_ORIGIN}/api/vehicles/getVehicleunderadmin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        }
      );
      const data = await res.json();
      if (data.success && data.vehicles) {
        // setVehicles(
        //   data.vehicles.map((v: any) => ({
        //     value: v._id,
        //     label: v.name,
        //   }))
        // );
        const vehicleOptions = data.vehicles.map((vehicle: any) => ({
          value: vehicle.id,
          label: vehicle.name,
        }));

        setVehicles(vehicleOptions);
        console.log("Vehicles fetched3:", vehicleOptions);
      } else {
        throw new Error("Invalid vehicles data");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      });
    }
  };

  if (type !== "accessories") return null;

  // Helper function to check if a day is the selected date
  const resetForm = () => {
    setSelectedVehicle("");
    setSelectedDate(new Date());
    setAccessoryName("");
    setAmount("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedVehicle ||
      !selectedDate ||
      !accessoryName.trim() ||
      !amount.trim()
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.SERVER_ORIGIN}/api/Accessories/createAccessory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: selectedVehicle,
            date: selectedDate.toISOString(),
            accessory_type: accessoryName,
            amount: Number(amount),
            description,
            email: userEmail,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Accessory expense added successfully!",
        });
        resetForm();
        onClose();
      } else {
        throw new Error(data.message || "Failed to add expense");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "accessories"} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Accessories Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <CalendarDialog />
          {/* Accessory Name */}
          <div className="space-y-2">
            <Label>Accessory Name</Label>
            <Input
              value={accessoryName}
              onChange={(e) => setAccessoryName(e.target.value)}
              placeholder="e.g., Seat Cover, GPS, etc."
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "Add Expense"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
