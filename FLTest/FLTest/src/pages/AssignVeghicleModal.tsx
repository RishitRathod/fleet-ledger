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
  value: string;
  label: string;
}

interface VehicleOption {
  value: string;
  label: string;
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
        `http://localhost:5000/api/users/admin/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const data = await response.json();

      if (data.success && data.users) {
        const userOptions = data.users.map((user: any) => ({
          value: user.id,
          label: user.name,
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
      const response = await fetch(
        "http://localhost:5000/api/groups/assignUserToVehicle",
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
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-4"
              required
            >
              <option value="">Select username</option>
              {users.map((user) => (
                <option key={user.value} value={user.value}>
                  {user.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Vehicle Name</Label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-4"
              required
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.value} value={vehicle.value}>
                  {vehicle.label}
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
