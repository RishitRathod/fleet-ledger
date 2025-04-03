import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface Vehicle {
    id: string;
    name: string;
}

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [sheetNames, setSheetNames] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string>('');
    const [groupId, setGroupId] = useState<string>('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const email = localStorage.getItem('email');
                if (!email) {
                    setMessage('❌ User not authenticated');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/vehicles/getVehicleunderadmin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                if (data.success && data.vehicles) {
                    const vehicleOptions = data.vehicles.map((vehicle: any) => ({
                        id: vehicle.id,
                        name: vehicle.name
                    }));
                    setVehicles(vehicleOptions);
                } else {
                    console.error('Invalid response format:', data);
                    setMessage('❌ Error loading vehicles');
                }
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setMessage('❌ Error loading vehicles');
            }
        };

        fetchVehicles();
    }, []);

    const handleVehicleChange = async (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        try {
            const response = await fetch('http://localhost:5000/api/groups/getGroupByVehicle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vehicleId: vehicle.id, email: localStorage.getItem('email') })
            });
            const data = await response.json();
            setGroupId(data.groupId);
        } catch (error) {
            console.error('Error fetching group ID:', error);
            setMessage('❌ Error fetching group information');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setMessage('');

            // Read Excel sheet names
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    setSheetNames(workbook.SheetNames);
                } catch (error) {
                    console.error('Error reading Excel file:', error);
                    setMessage('❌ Error reading Excel file');
                }
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!file || !selectedVehicle || !selectedSheet || !groupId) {
            setMessage('❌ Please select a file, vehicle, and sheet name first.');
            return;
        }

        setIsUploading(true);
        setMessage('⏳ Uploading...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('groupId', groupId);
        formData.append('sheetName', selectedSheet);

        try {
            const response = await fetch('http://localhost:5000/api/refuelings/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const result = await response.json();
            setMessage('✅ Upload successful!');
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('❌ Error uploading file:', error);
            setMessage('❌ Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="card p-4">
            <h2>Upload Refueling Data</h2>

            <div className="mb-3">
                <label className="block mb-2">Select Vehicle:</label>
                <select
                    value={selectedVehicle?.id}
                    onChange={(e) => {
                        const selectedId = e.target.value;
                        const vehicle = vehicles.find(v => v.id === selectedId);
                        handleVehicleChange(vehicle as Vehicle);
                    }}
                    className="w-full p-2 border rounded"
                    disabled={isUploading}
                >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="block mb-2">Upload Excel File:</label>
                <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileChange} 
                    disabled={isUploading} 
                    className="w-full p-2 border rounded"
                />
            </div>

            {sheetNames.length > 0 && (
                <div className="mb-3">
                    <label className="block mb-2">Select Sheet:</label>
                    <select
                        value={selectedSheet}
                        onChange={(e) => setSelectedSheet(e.target.value)}
                        className="w-full p-2 border rounded"
                        disabled={isUploading}
                    >
                        <option value="">Select a sheet</option>
                        {sheetNames.map((sheet) => (
                            <option key={sheet} value={sheet}>
                                {sheet}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <button 
                onClick={handleUpload} 
                disabled={isUploading || !selectedVehicle || !file || !selectedSheet}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-3 hover:bg-blue-600"
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>

            {message && (
                <div className={`mt-3 p-3 ${message.includes('❌') ? 'bg-red-100' : 'bg-green-100'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileUpload;