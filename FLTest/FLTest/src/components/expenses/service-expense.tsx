"use client";

import { useState } from "react";
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

const serviceTypes = [
  { id: 1, name: "Oil Change" },
  { id: 2, name: "Tire Change" },
  { id: 3, name: "General Service" },
  { id: 4, name: "Repair" },
];

export function ServiceExpenseModal() {
  const { isOpen, onClose, type } = useExpenseModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  // const groupId = "7fbd53d4-ec6c-4021-99a0-fc2e86f2a1b6";

  if (type !== "service") return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? "" : value);
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
    // if (!selectedDate) {
    //   toast({ title: "Error", description: "Please select a date", variant: "destructive" });
    //   return false;
    // }
    if (!selectedServiceType) {
      toast({
        title: "Error",
        description: "Please select service type",
        variant: "destructive",
      });
      return false;
    }
    if (amount === "" || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
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

    const requestBody = {
      service_type: selectedServiceType, // Make sure this matches the backend field name
      amount: amount,
      description: description,
    };

    console.log("Request Body:", requestBody); // Debugging: Check what's being sent

    try {
      const response = await fetch(
        "http://localhost:5000/api/services/createService",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();
      console.log("Response:", responseData); // Debugging: Check server response

      if (!response.ok)
        throw new Error(responseData.error || "Failed to add expense");

      toast({
        title: "Success",
        description: "Service expense added successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "service"} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add Service Expense
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
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div> */}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Service Type</Label>
              <Select
                value={selectedServiceType}
                onValueChange={setSelectedServiceType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="w-full"
                min={0}
                value={amount}
                onChange={handleAmountChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                placeholder="Enter service details"
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
