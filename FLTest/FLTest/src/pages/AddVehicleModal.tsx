import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function AddVehicleModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [vehicleName, setVehicleName] = useState("");

  const email = localStorage.getItem("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleName.trim()) {
      alert("Error: Vehicle name is required");
      return;
    }

    setLoading(true);
    try {
      console.log("kokoVehicle name:", vehicleName);
      console.log("kpkoEmail:", email);
      const response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/createVehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleName, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to add vehicle");
      }

      alert("Success: Vehicle added successfully");

      setVehicleName(""); // Reset input
      onOpenChange(false); // Close modal after success
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Vehicle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vehicle Name</Label>
            <Input
              type="text"
              placeholder="Enter vehicle name"
              className="w-full border border-gray-300 rounded-lg py-2 px-4"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Vehicle
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
