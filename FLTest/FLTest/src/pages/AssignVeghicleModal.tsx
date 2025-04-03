import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function AssignVehicleModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [vehicleName, setVehicleName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !vehicleName.trim()) {
      alert("Error: Username and vehicle name are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/vehicles/assignUserToVehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, vehicleName }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign vehicle to user");
      }

      alert("Success: Vehicle assigned to user successfully");

      setUsername(""); // Reset input
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
          <DialogTitle className="text-2xl font-semibold">Assign Vehicle to User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Username</Label>
            <Input
              type="text"
              placeholder="Enter username"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Vehicle Name</Label>
            <Input
              type="text"
              placeholder="Enter vehicle name"
              className="w-full"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Assign Vehicle
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
