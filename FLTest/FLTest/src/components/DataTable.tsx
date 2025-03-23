import React, { useState } from "react";
import DataTable, { TableColumn, TableStyles } from "react-data-table-component";
import { Card } from "./ui/card";

interface Vehicle {
  id: string;
  name: string;
}

interface FuelData {
  date: string;
  pPrice: number;
  amount: number;
  liters: number;
  kmStart: number;
  kmEnd: number;
  totalRun: number;
  average: number;
  avgCostPerKm: number;
  where: string;
  days: number;
  avgDailyRs: number;
  fuelUtilize: number;
}

const vehicles: Vehicle[] = [
  { id: "1", name: "Car A" },
  { id: "2", name: "Car B" },
  { id: "3", name: "Bike X" },
];

const fuelDataMap: Record<string, FuelData[]> = {
  "1": [
    {
      date: "2025-03-10",
      pPrice: 100,
      amount: 500,
      liters: 5,
      kmStart: 1000,
      kmEnd: 1200,
      totalRun: 200,
      average: 20,
      avgCostPerKm: 5,
      where: "City A",
      days: 5,
      avgDailyRs: 100,
      fuelUtilize: 80,
    },
    {
      date: "2025-03-10",
      pPrice: 100,
      amount: 500,
      liters: 5,
      kmStart: 1000,
      kmEnd: 1200,
      totalRun: 200,
      average: 20,
      avgCostPerKm: 5,
      where: "City A",
      days: 5,
      avgDailyRs: 100,
      fuelUtilize: 80,
    },    {
      date: "2025-03-10",
      pPrice: 100,
      amount: 500,
      liters: 5,
      kmStart: 1000,
      kmEnd: 1200,
      totalRun: 200,
      average: 20,
      avgCostPerKm: 5,
      where: "City A",
      days: 5,
      avgDailyRs: 100,
      fuelUtilize: 80,
    },    {
      date: "2025-03-10",
      pPrice: 100,
      amount: 500,
      liters: 5,
      kmStart: 1000,
      kmEnd: 1200,
      totalRun: 200,
      average: 20,
      avgCostPerKm: 5,
      where: "City A",
      days: 5,
      avgDailyRs: 100,
      fuelUtilize: 80,
    },
    
  ],
  "2": [
    {
      date: "2025-03-08",
      pPrice: 102,
      amount: 600,
      liters: 5.8,
      kmStart: 1500,
      kmEnd: 1700,
      totalRun: 200,
      average: 19,
      avgCostPerKm: 5.3,
      where: "City C",
      days: 4,
      avgDailyRs: 120,
      fuelUtilize: 85,
    },
  ],
  "3": [],
};

const customStyles: TableStyles = {
  headRow: {
    style: {
      backgroundColor: "#333", // Dark background for header
      color: "#ffffff", // White text color
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      padding: "12px",
    },
  },
  headCells: {
    style: {
      backgroundColor: "#444", // Slightly lighter header background
      color: "#ffffff", // Ensure text is visible
      borderRight: "1px solid rgba(255, 255, 255, 0.2)",
      fontSize: "14px",
      fontWeight: "bold",
      padding: "12px",
    },
  },
  rows: {
    style: {
      backgroundColor: "#1e1e1e", // Dark row background
      color: "#ffffff", // White text for readability
      minHeight: "40px",
    },
  },
  cells: {
    style: {
      borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "12px",
    },
  },
};

const columns: TableColumn<FuelData>[] = [
  { name: "Date", selector: (row) => row.date, sortable: true },
  { name: "P. Price", selector: (row) => row.pPrice, sortable: true, format: (row) => `₹${row.pPrice.toFixed(2)}` },
  { name: "Amount", selector: (row) => row.amount, sortable: true, format: (row) => `₹${row.amount.toFixed(2)}` },
  { name: "Liters", selector: (row) => row.liters, sortable: true, format: (row) => `${row.liters.toFixed(2)} L` },
  { name: "KM Start", selector: (row) => row.kmStart, sortable: true },
  { name: "KM End", selector: (row) => row.kmEnd, sortable: true },
  { name: "Total Run", selector: (row) => row.totalRun, sortable: true, format: (row) => `${row.totalRun} km` },
  { name: "Average (km/L)", selector: (row) => row.average, sortable: true, format: (row) => `${row.average.toFixed(2)}` },
  { name: "Avg. Cost/KM", selector: (row) => row.avgCostPerKm, sortable: true, format: (row) => `₹${row.avgCostPerKm.toFixed(2)}` },
  { name: "Location", selector: (row) => row.where, sortable: true },
  { name: "Days", selector: (row) => row.days, sortable: true },
  { name: "Avg. Daily ₹", selector: (row) => row.avgDailyRs, sortable: true, format: (row) => `₹${row.avgDailyRs.toFixed(2)}` },
  { name: "Fuel Utilize (%)", selector: (row) => row.fuelUtilize, sortable: true, format: (row) => `${row.fuelUtilize}%` },
];


const FuelDataTable: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const data = selectedVehicle
    ? (fuelDataMap[selectedVehicle] || []).filter(row =>
        Object.values(row).some(value =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  return (
    <Card className="p-6 bg-white rounded-lg shadow-lg max-w-[95%] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a vehicle</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {selectedVehicle && data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No data available for this vehicle</p>
        </div>
      )}

      {data.length > 0 && (
        <div className="overflow-x-auto w-full max-w-[1200px]">
          <DataTable
            title="Fuel Records"
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            dense
            striped
            persistTableHead
          />
        </div>
      )}
    </Card>
  );
};

export default FuelDataTable;