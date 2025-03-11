"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { create } from "zustand"

interface ExpenseModalStore {
  type: 'accessories' | 'fuel' | 'service' | 'tax' | null
  isOpen: boolean
  onOpen: (type: 'accessories' | 'fuel' | 'service' | 'tax') => void
  onClose: () => void
}

const useExpenseModal = create<ExpenseModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
}))

const vehicles = [
  { id: 1, name: "Vehicle 1" },
  { id: 2, name: "Vehicle 2" },
  { id: 3, name: "Vehicle 3" },
]

const fuelTypes = [
  { id: 1, name: "Petrol" },
  { id: 2, name: "Diesel" },
  { id: 3, name: "CNG" },
]

const serviceTypes = [
  { id: 1, name: "Oil Change" },
  { id: 2, name: "Tire Change" },
  { id: 3, name: "General Service" },
  { id: 4, name: "Repair" },
]

const taxTypes = [
  { id: 1, name: "Road Tax" },
  { id: 2, name: "Insurance" },
  { id: 3, name: "Permit" },
  { id: 4, name: "Other" },
]

export function ExpenseModals() {
  const { type, isOpen, onClose } = useExpenseModal()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedVehicle, setSelectedVehicle] = useState<string>("") 
  
  // Fuel expense state
  const [fuelQuantity, setFuelQuantity] = useState<number>(0)
  const [pricePerLiter, setPricePerLiter] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)

  // Tax dates state
  const [validFrom, setValidFrom] = useState<Date | undefined>()
  const [validTo, setValidTo] = useState<Date | undefined>()

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

    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return false
    }

    if (type === 'tax' && (!validFrom || !validTo)) {
      toast({
        title: "Error",
        description: "Please select valid date range",
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: `${type?.charAt(0).toUpperCase()}${type?.slice(1)} expense added successfully`,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {type === 'accessories' && "Add Accessories Expense"}
            {type === 'fuel' && "Add Fuel Expense"}
            {type === 'service' && "Add Service Expense"}
            {type === 'tax' && "Add Tax Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
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
          </div>

          {/* Accessories Fields */}
          {type === 'accessories' && (
            <div className="space-y-4">
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
          )}

          {/* Fuel Fields */}
          {type === 'fuel' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fuel Type</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
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
                  value={fuelQuantity || ''}
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
                  value={pricePerLiter || ''}
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
                  value={totalAmount || 0} 
                  className="w-full bg-muted" 
                  disabled 
                />
              </div>
            </div>
          )}

          {/* Service Fields */}
          {type === 'service' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Type</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Provider</Label>
                <Input placeholder="Enter service provider" className="w-full" required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Mileage</Label>
                <Input type="number" placeholder="Enter current mileage" className="w-full" min={0} required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount</Label>
                <Input type="number" placeholder="Enter amount" className="w-full" min={0} required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Details</Label>
                <Textarea placeholder="Enter service details" className="min-h-[100px]" />
              </div>
            </div>
          )}

          {/* Tax Fields */}
          {type === 'tax' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tax Type</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Document Number</Label>
                <Input placeholder="Enter document number" className="w-full" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valid From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !validFrom && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validFrom ? format(validFrom, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={validFrom} onSelect={setValidFrom} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Valid To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !validTo && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validTo ? format(validTo, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single" 
                        selected={validTo} 
                        onSelect={setValidTo} 
                        disabled={(date) => validFrom ? date < validFrom : false}
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Notes</Label>
                <Textarea placeholder="Enter additional notes" />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { useExpenseModal }
