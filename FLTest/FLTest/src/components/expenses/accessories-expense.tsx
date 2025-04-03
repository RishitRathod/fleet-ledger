"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useExpenseModal } from "./expense-store"

interface VehicleOption {
  value: string;
  label: string;
}

export function AccessoriesExpenseModal() {
  const { isOpen, onClose, type } = useExpenseModal()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [vehicles, setVehicles] = useState<VehicleOption[]>([])
  const userEmail = localStorage.getItem('email')

  useEffect(() => {
    if (userEmail) {
      fetchVehicles();
    }
  }, [userEmail]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/getVehicleunderadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      
      if (data.success && data.vehicles) {
        const vehicleOptions = data.vehicles.map((vehicle: any) => ({
          value: vehicle.id,
          label: vehicle.name
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
        variant: "destructive"
      });
    }
  };

  if (type !== 'accessories') return null

  const validateForm = () => {
    if (!selectedVehicle) {
      toast({
        title: "Error",
        description: "Please select a vehicle",
        variant: "destructive",
      })
      return false
    }

    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Accessories expense added successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen && type === 'accessories'} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Accessories Expense</DialogTitle>
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
                    <SelectItem key={vehicle.value} value={vehicle.value}>
                      {vehicle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Accessory Name</Label>
              <Input placeholder="Enter accessory name" className="w-full" required />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount</Label>
              <Input type="number" placeholder="Enter amount" className="w-full" min={0} required />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea placeholder="Enter description" className="min-h-[100px]" />
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
