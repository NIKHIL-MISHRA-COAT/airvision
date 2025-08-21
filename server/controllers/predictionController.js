const { fetchAQIHistoricalData } = require('../services.js/aqiServices');
const { processPredictionOutput} = require('../utils/aqi')
const { spawn } = require('child_process');

const handlePrediction = async (req, res) => {
    const { location } = req.query || {};  // Safely destructuring with a fallback to an empty object

    // Validate location parameter
    if (!location) {
        console.error("Location parameter is missing in the query.");
        return res.status(400).json({ error: "Location parameter is required." });
    }

    console.log("Fetching data for location:", location);

    try {
        // Set the time range for fetching data (e.g., 29 days)
        const timeRange = 35;
        const inputData = await fetchAQIHistoricalData(timeRange, { location });

        // Check if the data is available
        if (!inputData || inputData.length === 0) {
            console.error("No data found for the given location.");
            return res.status(404).json({ error: "No AQI data available for this location." });
        }

        console.log("Data fetched successfully:", inputData.length, "entries");

        // Format the input data to a 2D array with headers (for the model)
        const headers = ['date', 'AQI', 'CO', 'NO', 'NO2', 'O3', 'SO2', 'PM2_5', 'PM10', 'NH3'];
        const formattedInputData = inputData.map(entry => [
            entry.date,
            entry.AQI,
            entry.CO,
            entry.NO,
            entry.NO2,
            entry.O3,
            entry.SO2,
            entry.PM2_5,
            entry.PM10,
            entry.NH3
        ]);

        // Prepend the headers to the data array
        formattedInputData.unshift(headers);

        // Start the Python script using spawn
        const pythonProcess = spawn('python', ['./config/predict.py']);

        let output = "";
        let errorOutput = "";

        // Write the raw input data to the Python process
        pythonProcess.stdin.write(JSON.stringify(formattedInputData));  

        pythonProcess.stdin.end();

        // Capture standard output and error
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Handle the closing of the Python process
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
                console.error("Python error output:", errorOutput);
                return res.status(500).json({ error: "Prediction script failed to execute", details: errorOutput });
            }

            try {
                // Attempt to parse the output from the Python script
                const parsedOutput = JSON.parse(output);
                
                const op = processPredictionOutput(parsedOutput);
                console.table(op);
                console.log(op)
                // Send the parsed JSON response
                res.json(op);

            } catch (jsonError) {
                console.error("Error parsing Python script output:", jsonError);
                console.error("Raw output:", output);  // Log the raw output for debugging
                res.status(500).json({ error: "Invalid response from prediction script", details: output });
            }
        });

    } catch (error) {
        // Handle errors related to data fetching
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching AQI data', details: error.message });
    }
};

module.exports = { handlePrediction };
