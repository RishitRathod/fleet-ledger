import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Select from "react-select";
import { Label } from "recharts";

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
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(
    null
  );

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
        console.log("Users fetched:", userOptions);
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
      console.log("Vehicle response:", data);

      if (data.success && data.vehicles) {
        const vehicleOptions = data.vehicles.map((vehicle: any) => ({
          value: vehicle.id,
          label: vehicle.name,
        }));

        setVehicles(vehicleOptions);
        console.log("Vehicles fetched1:", vehicleOptions);
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
            username: selectedUser.label, // Send the user's name
            vehicleName: selectedVehicle.label, // Send the vehicle's name
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign vehicle to user");
      }

      const data = await response.json();
      console.log("Assignment response:", data);

      alert("Success: Vehicle assigned to user successfully");

      setSelectedUser(null);
      setSelectedVehicle(null);
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
            <Label className="text-sm font-medium text-black">Username</Label>
            <Select
              options={users}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select username"
              className="w-full"
              isClearable
              isLoading={!users.length}
              styles={{
                control: (styles) => ({ ...styles, color: "black" }),
                option: (styles) => ({ ...styles, color: "black" }),
                menu: (styles) => ({ ...styles, color: "black" }),
                singleValue: (styles) => ({ ...styles, color: "black" }),
              }}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">
              Vehicle Name
            </Label>
            <Select
              options={vehicles}
              value={selectedVehicle}
              onChange={setSelectedVehicle}
              placeholder="Select vehicle"
              className="w-full"
              isClearable
              styles={{
                control: (styles) => ({ ...styles, color: "black" }),
                option: (styles) => ({ ...styles, color: "black" }),
                menu: (styles) => ({ ...styles, color: "black" }),
                singleValue: (styles) => ({ ...styles, color: "black" }),
              }}
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
