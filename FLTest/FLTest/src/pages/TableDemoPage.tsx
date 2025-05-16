import { useEffect, useState } from 'react';
// Import required styles and libraries
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Add type augmentation for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface TableEntry {
  date: string;
  pricePerLiter: number;
  amount: number;
  liters: number;
  kmStart: number;
  kmEnd: number;
  totalRun: number;
  average: number;
  avgCostPerKm: number;
  days: number;
  avgDailyRs: number;
}

interface Vehicle {
  id: string;
  name: string;
  model: string;
  registrationNumber: string;
}

const TableDemoPage = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableEntry; direction: 'asc' | 'desc' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getVehicles`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("vehicle", data);
        if (data.success) {
          setVehicles(data.data);
          if (data.data.length > 0) {
            setSelectedVehicle(data.data[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setError('Error fetching vehicles');
      }
    };

    fetchVehicles();
  }, []);

const fetchRefuelingData = async () => {
  if (!selectedVehicle) {
    console.log("No vehicle selected");
    return;
  }
  console.log("Fetching data for vehicle:", selectedVehicle);
  try {
    setLoading(true);
    setError(null);
    const response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/vehicles/getVehicledata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: selectedVehicle, email: localStorage.getItem('email') }),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch vehicle data');
    }

    // Ensure refueling data exists and is an array before mapping
    const refuelingData = data.data?.refueling || [];
    if (!Array.isArray(refuelingData)) {
      throw new Error("Invalid refueling data format");
    }

    const transformedData = refuelingData.map((item: any) => {
      // Format date from ISO string to DD/MM/YYYY
      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        return date.toLocaleDateString('en-GB', { // en-GB gives DD/MM/YYYY format
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };

      return {
        date: formatDate(item.date),
        pricePerLiter: Number(item.pricePerLiter) || 0,
        amount: Number(item.amount) || 0,
        liters: Number(item.liters) || 0,
        kmStart: Number(item.kmStart) || 0,
        kmEnd: Number(item.kmEnd) || 0,
        totalRun: Number(item.totalRun) || 0,
        average: (item.kmEnd && item.kmStart && item.liters) 
          ? Number(((item.kmEnd - item.kmStart) / item.liters).toFixed(2)) 
          : 0,
        avgCostPerKm: (item.kmEnd && item.kmStart && item.amount) 
          ? Number((item.amount / (item.kmEnd - item.kmStart)).toFixed(2)) 
          : 0,
        days: Number(item.days) || 0,
        avgDailyRs: Number(item.avgDailyExpense) || 0,
      };
    });

    console.log("Transformed data:", transformedData);
    setTableData(transformedData);
  } catch (error) {
    console.error('Error fetching refueling data:', error);
    setError(error instanceof Error ? error.message : 'Error fetching refueling data');
    setTableData([]); // Clear table data on error
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchRefuelingData();
}, [selectedVehicle]);  

  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicle(event.target.value);
  };

  const sortData = (data: TableEntry[]): TableEntry[] => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key: keyof TableEntry) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const filteredData = sortData(tableData.filter((entry) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      entry.pricePerLiter.toString().includes(searchLower) ||
      entry.amount.toString().includes(searchLower) ||
      entry.liters.toString().includes(searchLower) ||
      entry.kmStart.toString().includes(searchLower) ||
      entry.kmEnd.toString().includes(searchLower) ||
      entry.totalRun.toString().includes(searchLower) ||
      entry.average.toString().includes(searchLower) ||
      entry.avgCostPerKm.toString().includes(searchLower) ||
      entry.days.toString().includes(searchLower) ||
      entry.avgDailyRs.toString().includes(searchLower)
    );
  }));

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); 
  };

  const handleCopy = async () => {
    try {
      const headers = ['Date', 'Price/Liter', 'Amount', 'Liters', 'Km Start', 'Km End', 'Total Run', 'Average', 'Avg Cost/Km', 'Days', 'Avg Daily Rs'];
      const rows = filteredData.map(row => Object.values(row));
      const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
      await navigator.clipboard.writeText(text);
      alert('Data copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy data');
    }
  };

  const handleExcel = () => {
    const headers = ['Date', 'Price/Liter', 'Amount', 'Liters', 'Km Start', 'Km End', 'Total Run', 'Average', 'Avg Cost/Km', 'Days', 'Avg Daily Rs'];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...filteredData.map(row => Object.values(row))]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fleet Data');
    
    // Adjust column widths
    const columnWidths = [
      { wch: 12 }, // Date
      { wch: 10 }, // Price/Liter
      { wch: 10 }, // Amount
      { wch: 8 },  // Liters
      { wch: 10 }, // Km Start
      { wch: 10 }, // Km End
      { wch: 10 }, // Total Run
      { wch: 8 },  // Average
      { wch: 12 }, // Avg Cost/Km
      { wch: 8 },  // Days
      { wch: 12 }  // Avg Daily Rs
    ];
    ws['!cols'] = columnWidths;
    
    XLSX.writeFile(wb, 'fleet-data.xlsx');
  };

  const handleCSV = () => {
    const headers = ['Date', 'Price/Liter', 'Amount', 'Liters', 'Km Start', 'Km End', 'Total Run', 'Average', 'Avg Cost/Km', 'Days', 'Avg Daily Rs'];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...filteredData.map(row => Object.values(row))]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fleet Data');
    XLSX.writeFile(wb, 'fleet-data.csv');
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Price/Liter', 'Amount', 'Liters', 'Km Start', 'Km End', 'Total Run', 'Average', 'Avg Cost/Km', 'Days', 'Avg Daily Rs']],
      body: filteredData.map(row => Object.values(row)),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
      margin: { top: 10 }
    });
    doc.save('fleet-data.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-1 max-w-full">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Table</h1>
            <div className="flex items-center w-full sm:w-auto">
              <label className="mr-2 text-sm text-gray-700 dark:text-neutral-200 whitespace-nowrap">Select Vehicle:</label>
              <select
                className="w-full sm:w-auto py-1.5 px-3 border rounded-lg text-sm text-gray-800 bg-white dark:bg-neutral-900 dark:text-neutral-200"
                value={selectedVehicle}
                onChange={handleVehicleChange}
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.name}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 shadow rounded-lg p-5 overflow-hidden">
            <div id="hs-datatable-with-export" className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="grow">
                  <div className="relative max-w-xs w-full">
                    <label htmlFor="hs-table-export-search" className="sr-only">Search</label>
                    <input 
                      type="text" 
                      name="hs-table-export-search" 
                      id="hs-table-export-search" 
                      className="py-1.5 sm:py-2 px-3 ps-9 block w-full border-gray-200 shadow-2xs rounded-lg sm:text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                      placeholder="Search for items"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                      <svg className="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-700 dark:text-neutral-200">Rows per page:</label>
                    <select
                      className="py-1 px-3 border rounded-lg text-sm text-gray-800 bg-white dark:bg-neutral-900 dark:text-neutral-200"
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                    >
                      {[5, 10, 15, 20, 25, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-neutral-200">
                    {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative inline-flex">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    >
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      Export
                      <svg className={`size-4 transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 bg-transparent" onClick={() => setIsDropdownOpen(false)} />
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl dark:bg-neutral-900 z-50" onClick={e => e.stopPropagation()}>
                          <div className="p-1 space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                handleCopy();
                                setIsDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                            >
                              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handlePrint();
                                setIsDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                            >
                              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
                                <rect x="6" y="14" width="12" height="8" rx="1" />
                              </svg>
                              Print
                            </button>
                          </div>
                          <div className="p-1 space-y-0.5 border-t border-gray-200 dark:border-neutral-800">
                            <button
                              type="button"
                              onClick={() => {
                                handleExcel();
                                setIsDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                            >
                              <svg className="shrink-0 size-3.5" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.0324 1.91994H9.45071C9.09999 1.91994 8.76367 2.05926 8.51567 2.30725C8.26767 2.55523 8.12839 2.89158 8.12839 3.24228V8.86395L20.0324 15.8079L25.9844 18.3197L31.9364 15.8079V8.86395L20.0324 1.91994Z" fill="#21A366"/>
                                <path d="M8.12839 8.86395H20.0324V15.8079H8.12839V8.86395Z" fill="#107C41"/>
                                <path d="M30.614 1.91994H20.0324V8.86395H31.9364V3.24228C31.9364 2.89158 31.7971 2.55523 31.5491 2.30725C31.3011 2.05926 30.9647 1.91994 30.614 1.91994Z" fill="#33C481"/>
                              </svg>
                              Excel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleCSV();
                                setIsDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                            >
                              <svg className="shrink-0 size-3.5" width="400" height="461" viewBox="0 0 400 461" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M342.544 460.526H57.4563C39.2545 460.526 24.5615 445.833 24.5615 427.632V32.8947C24.5615 14.693 39.2545 0 57.4563 0H265.79L375.439 109.649V427.632C375.439 445.833 360.746 460.526 342.544 460.526Z" fill="#E7EAF3"/>
                              </svg>
                              CSV
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="min-h-[400px] overflow-x-auto max-w-full -mx-5 px-5">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('date')}
                      >
                        Date
                        {sortConfig?.key === 'date' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('pricePerLiter')}
                      >
                        Price/Liter
                        {sortConfig?.key === 'pricePerLiter' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        {sortConfig?.key === 'amount' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('liters')}
                      >
                        Liters
                        {sortConfig?.key === 'liters' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('kmStart')}
                      >
                        Km Start
                        {sortConfig?.key === 'kmStart' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('kmEnd')}
                      >
                        Km End
                        {sortConfig?.key === 'kmEnd' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('totalRun')}
                      >
                        Total Run
                        {sortConfig?.key === 'totalRun' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('average')}
                      >
                        Average
                        {sortConfig?.key === 'average' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('avgCostPerKm')}
                      >
                        Avg Cost/Km
                        {sortConfig?.key === 'avgCostPerKm' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('days')}
                      >
                        Days
                        {sortConfig?.key === 'days' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleSort('avgDailyRs')}
                      >
                        Avg Daily Rs
                        {sortConfig?.key === 'avgDailyRs' && (
                          <span className="ms-2">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-900 dark:divide-neutral-700">
                    {paginatedData.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.pricePerLiter}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.liters}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.kmStart}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.kmEnd}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.totalRun}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.average}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.avgCostPerKm}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.days}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{entry.avgDailyRs}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 gap-4">
                <div className="text-sm text-gray-700 dark:text-neutral-200">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    type="button" 
                    className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span aria-hidden="true">«</span>
                    <span className="sr-only">Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show first page, last page, current page, and pages around current page
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            className={`p-2.5 min-w-10 inline-flex justify-center items-center text-sm rounded-full ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700'
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 3 ||
                        pageNum === currentPage + 3
                      ) {
                        return <span key={pageNum}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button 
                    type="button" 
                    className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true">»</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="grow">
              <div className="relative max-w-xs w-full">
                <label htmlFor="vehicle-select" className="sr-only">Select Vehicle</label>
                <select
                  id="vehicle-select"
                  className="py-1.5 sm:py-2 px-3 ps-9 block w-full border-gray-200 shadow-2xs rounded-lg sm:text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  value={selectedVehicle}
                  onChange={handleVehicleChange}
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
};

export default TableDemoPage;