"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useExpenseModal, vehicles } from "./expense-store"

const fuelTypes = [
  { id: 1, name: "Petrol" },
  { id: 2, name: "Diesel" },
  { id: 3, name: "CNG" },
]

export function FuelExpenseModal() {
  const { isOpen, onClose, type } = useExpenseModal()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [selectedFuelType, setSelectedFuelType] = useState<string>("")
  const [fuelQuantity, setFuelQuantity] = useState<number>(0)
  const [pricePerLiter, setPricePerLiter] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const groupId = '7fbd53d4-ec6c-4021-99a0-fc2e86f2a1b6';

  if (type !== 'fuel') return null

  const handleFuelCalculation = (quantity: number, price: number) => {
    const total = quantity * price
    setTotalAmount(total)
  }

  const validateForm = () => {
    if (!selectedVehicle) {
      toast({
        title: "Error",
        description: "Please select a vehicle",
        variant: "destructive",
      })
      return false
    }

    // if (!selectedDate) {
    //   toast({
    //     title: "Error",
    //     description: "Please select a date",
    //     variant: "destructive",
    //   })
    //   return false
    // }

    if (!selectedFuelType) {
      toast({
        title: "Error",
        description: "Please select fuel type",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/refuelings/addFuelEntry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          date: selectedDate?.toISOString(),
          fuelType: selectedFuelType,
          liters: fuelQuantity,
          pricePerLiter,
          totalAmount,
          groupId
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
  
      toast({
        title: "Success",
        description: "Fuel expense added successfully",
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
    <Dialog open={isOpen && type === 'fuel'} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Fuel Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
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
              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
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
                  const value = parseFloat(e.target.value)
                  setFuelQuantity(value)
                  handleFuelCalculation(value, pricePerLiter)
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
                  const value = parseFloat(e.target.value)
                  setPricePerLiter(value)
                  handleFuelCalculation(fuelQuantity, value)
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
  )
}
