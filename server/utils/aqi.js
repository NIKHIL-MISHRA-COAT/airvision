import axios from 'axios';

// Function to fetch latitude and longitude using OpenStreetMap's Nominatim API
export async function getCoordinatesFromOSM(location) {
  const endpoint = `https://nominatim.openstreetmap.org/search`;

  try {
    const response = await axios.get(endpoint, {
      params: {
        q: location,  // The location to search for
        format: 'json', // Specify the response format as JSON
        addressdetails: 1, // Include address details
      },
    });

    if (response.data.length > 0) {
      const result = response.data[0];
      const { lat, lon } = result;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return { lat, lon };
    } else {
      console.error('Location not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}

// Example usage
getCoordinatesFromOSM('Mumbai');

export const unixToDateTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  return date.toISOString().replace('T', ' ').split('.')[0]; // Format: "YYYY-MM-DD HH:mm:ss"
};

export const getUnixRange = (durationInDays) => {
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const past = now - durationInDays * 24 * 60 * 60; // Subtract days in seconds
  return { start: past, end: now };
};

export const processPredictionOutput = (output) => {
  // Ensure output is an array
  if (!Array.isArray(output)) {
    console.error("Invalid prediction output:", output);
    return []; // return empty array instead of crashing
  }

  const headers = ['CO', 'NO', 'NO2', 'O3', 'SO2', 'PM2_5', 'PM10', 'NH3', 'AQI'];

  // Generate dates from today + 1 to today + 7
  const today = new Date();
  const dateRange = [];
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dateRange.push(nextDate.toISOString().split('T')[0]); // YYYY-MM-DD
  }

  return output.map((row, index) => {
    const rowData = {};
    headers.forEach((header, headerIndex) => {
      rowData[header] = Array.isArray(row) ? row[headerIndex] : null;
    });
    rowData["date"] = dateRange[index] || "";
    return rowData;
  });
};
