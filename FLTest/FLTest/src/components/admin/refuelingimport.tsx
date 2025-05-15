"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRefuelingModal } from "./refueling-store";
import * as XLSX from 'xlsx';

interface VehicleOption {
  id: string;
  name: string;
}

export function RefuelingImportModal() {
  const { isOpen, onClose, type } = useRefuelingModal();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (userEmail) {
      fetchVehicles();
    }
  }, [userEmail]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.SERVER_ORIGIN}/api/vehicles/getVehicleunderadmin`,
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
          id: vehicle.id,
          name: vehicle.name,
        }));

        setVehicles(vehicleOptions);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      });
    }
  };

  const handleVehicleChange = async (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    try {
      const response = await fetch(`${import.meta.env.SERVER_ORIGIN}/api/groups/getGroupByVehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, email: userEmail })
      });
      const data = await response.json();
      setGroupId(data.groupId);
    } catch (error) {
      console.error('Error fetching group ID:', error);
      toast({
        title: "Error",
        description: "Failed to fetch group information",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          setSheetNames(workbook.SheetNames);
        } catch (error) {
          console.error('Error reading Excel file:', error);
          toast({
            title: "Error",
            description: "Failed to read Excel file",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!file || !selectedVehicle || !selectedSheet || !groupId) {
      toast({
        title: "Error",
        description: "Please select a file, vehicle, and sheet name first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', groupId);
    formData.append('sheetName', selectedSheet);

    try {
      const response = await fetch(`${import.meta.env.SERVER_ORIGIN}/api/refuelings/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: "Refueling data uploaded successfully!",
      });
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload refueling data",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (type !== "refueling") return null;

  return (
    <Dialog open={isOpen && type === "refueling"} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Import Refueling Data
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Vehicle</Label>
              <Select
                value={selectedVehicle}
                onValueChange={handleVehicleChange}
                disabled={isUploading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload Excel File</Label>
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full"
              />
            </div>

            {sheetNames.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Sheet</Label>
                <Select
                  value={selectedSheet}
                  onValueChange={setSelectedSheet}
                  disabled={isUploading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sheet" />
                  </SelectTrigger>
                  <SelectContent>
                    {sheetNames.map((sheet) => (
                      <SelectItem key={sheet} value={sheet}>
                        {sheet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            className="w-full"
            disabled={isUploading || !selectedVehicle || !file || !selectedSheet}
          >
            {isUploading ? "Uploading..." : "Import Data"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RefuelingImportModal;