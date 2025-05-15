import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserOption {
  name: string;
}

interface VehicleOption {
  name: string;
}

export function AssignVehicleModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");

  // Get user email from localStorage
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (userEmail) {
      fetchUsers();
      fetchVehicles();
    }
  }, [userEmail]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ORIGIN}/api/users/admin/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const data = await response.json();

      console.log("Users found under admin:", data.users);

      if (data.success && data.users) {
        const userOptions = data.users.map((user: any) => ({
          name: user.name
        }));

        setUsers(userOptions);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
      console.log("Vehicles found under admin:", data.vehicles);

      if (data.success && data.vehicles) {
        const vehicleOptions = data.vehicles.map((vehicle: any) => ({
          name: vehicle.name
        }));

        setVehicles(vehicleOptions);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedVehicle) {
      alert("Error: Please select both username and vehicle");
      return;
    }

    setLoading(true);
    try {
      console.log("Assigning user to vehicle:", selectedUser, selectedVehicle);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ORIGIN}/api/groups/assignUserToVehicle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: selectedUser,
            vehicleName: selectedVehicle,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign vehicle to user");
      }

      const data = await response.json();
      console.log("Assignment response:", data);

      alert("Success: Vehicle assigned to user successfully");

      setSelectedUser("");
      setSelectedVehicle("");
      onOpenChange(false);
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
          <DialogTitle className="text-2xl font-semibold">
            Assign Vehicle to User
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Username</Label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-4"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.name} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Vehicle</Label>
            <select
              id="vehicle"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-4"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.name} value={vehicle.name}>
                  {vehicle.name}
                </option>
              ))}
            </select>
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
