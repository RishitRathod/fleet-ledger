/**
 * Refueling Service
 * Handles API calls related to refueling operations
 */

const API_BASE = import.meta.env.VITE_SERVER_ORIGIN;

/**
 * Interface for refueling entry data
 */
export interface RefuelingEntryData {
  id?: string;
  date?: string;
  pricePerLiter?: number;
  amount?: number;
  liters?: number;
  kmStart?: number;
  kmEnd?: number;
  totalRun?: number;
  average?: number;
  avgCostPerKm?: number;
  location?: string;
  days?: number;
  avgDailyExpense?: number;
  fuelUtilization?: number;
  fuelType?: string;
  groupId?: string;
}

/**
 * Get all refueling entries for a vehicle
 * @param vehicleName - Name of the vehicle
 * @param email - User email
 */
export const getVehicleRefuelingData = async (vehicleName: string, email: string | null) => {
  try {
    const response = await fetch(`${API_BASE}/api/vehicles/getVehicledata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: vehicleName, email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vehicle refueling data:', error);
    throw error;
  }
};

/**
 * Delete a refueling entry
 * @param id - ID of the refueling entry to delete
 */
export const deleteRefuelingEntry = async (id: string) => {
  try {
    // First try the /api/refuel/:id endpoint
    let response = await fetch(`${API_BASE}/api/refuel/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If that fails with 404, try the alternative endpoint
    if (response.status === 404) {
      console.log('First endpoint failed, trying alternative endpoint...');
      response = await fetch(`${API_BASE}/api/refuelings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting refueling entry:', error);
    throw error;
  }
};

/**
 * Update a refueling entry
 * @param id - ID of the refueling entry to update
 * @param data - Updated data for the refueling entry
 */
export const updateRefuelingEntry = async (id: string, data: RefuelingEntryData) => {
  try {
    // First try the /api/refuel/:id endpoint
    let response = await fetch(`${API_BASE}/api/refuel/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // If that fails with 404, try the alternative endpoint
    if (response.status === 404) {
      console.log('First update endpoint failed, trying alternative endpoint...');
      response = await fetch(`${API_BASE}/api/refuelings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating refueling entry:', error);
    throw error;
  }
};
