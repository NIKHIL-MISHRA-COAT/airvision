
import { fetchAQIHistoricalData } from '../services/aqiServices.js';
const getAQIData = async (req, res) => {
    const { location, timeRange } = req.query;
    console.log(`Location: ${location}, TimeRange: ${timeRange}`);

    // Check if location is provided
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    try {
        // Fetch AQI historical data
        const aqiData = await fetchAQIHistoricalData(timeRange, { location });

        // Log fetched data for debugging
        console.log(aqiData);

        res.json(aqiData);
        console.log("Data sent to frontend");

    } catch (error) {
        // Catch any errors during data fetching or processing
        console.error('Error fetching AQI data (controller):', error);
        res.status(500).json({ error: 'Failed to fetch AQI data' });
    }
};

export { getAQIData }; // Use export for ES module
