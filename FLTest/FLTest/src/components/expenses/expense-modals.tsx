"use client"

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
import { CalendarIcon } from "lucide-react"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Success",
      description: `${type?.charAt(0).toUpperCase()}${type?.slice(1)} expense added successfully`,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'accessories' && "Add Accessories Expense"}
            {type === 'fuel' && "Add Fuel Expense"}
            {type === 'service' && "Add Service Expense"}
            {type === 'tax' && "Add Tax Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select>
              <SelectTrigger>
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
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Pick a date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Accessories Fields */}
          {type === 'accessories' && (
            <>
              <div className="space-y-2">
                <Label>Accessory Name</Label>
                <Input placeholder="Enter accessory name" />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Enter description" />
              </div>
            </>
          )}

          {/* Fuel Fields */}
          {type === 'fuel' && (
            <>
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select>
                  <SelectTrigger>
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
                <Label>Quantity (Liters)</Label>
                <Input type="number" placeholder="Enter quantity" />
              </div>
              <div className="space-y-2">
                <Label>Price per Liter</Label>
                <Input type="number" placeholder="Enter price per liter" />
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input type="number" disabled />
              </div>
            </>
          )}

          {/* Service Fields */}
          {type === 'service' && (
            <>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select>
                  <SelectTrigger>
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
                <Label>Service Provider</Label>
                <Input placeholder="Enter service provider" />
              </div>
              <div className="space-y-2">
                <Label>Current Mileage</Label>
                <Input type="number" placeholder="Enter current mileage" />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label>Service Details</Label>
                <Textarea placeholder="Enter service details" />
              </div>
            </>
          )}

          {/* Tax Fields */}
          {type === 'tax' && (
            <>
              <div className="space-y-2">
                <Label>Tax Type</Label>
                <Select>
                  <SelectTrigger>
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
                <Label>Document Number</Label>
                <Input placeholder="Enter document number" />
              </div>
              <div className="space-y-2">
                <Label>Valid From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Pick a date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Valid To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Pick a date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea placeholder="Enter additional notes" />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { useExpenseModal }
