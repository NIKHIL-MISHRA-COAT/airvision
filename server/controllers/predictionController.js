import path from 'path';
import { spawn } from 'child_process';
import { fetchAQIHistoricalData } from '../services/aqiServices.js';
import { processPredictionOutput } from "../utils/aqi.js";

// If using ES Modules, get __dirname equivalent
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handlePrediction = async (req, res) => {
  const { location } = req.query || {};

  if (!location) {
    return res.status(400).json({ error: "Location parameter is required." });
  }

  try {
    const timeRange = 29;
    const inputData = await fetchAQIHistoricalData(timeRange, { location });

    if (!inputData || inputData.length === 0) {
      return res.status(404).json({ error: "No AQI data available for this location." });
    }

    // Format input data for Python
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
    formattedInputData.unshift(headers);

    // Correct path to Python script
    const scriptPath = path.join(__dirname, '../config/predict.py'); 
    console.log("Python script path:", scriptPath);
console.log(__filename);
// console.log(__dirname),"dirname";
// console.log(scriptPath,"scriptPath");
    const pythonProcess = spawn('python', [scriptPath]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdin.write(JSON.stringify(formattedInputData));
    // console.log(formattedInputData,"formattedInputData");
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', data => output += data.toString());
    pythonProcess.stderr.on('data', data => errorOutput += data.toString());

    pythonProcess.on('close', code => {
      if (code !== 0) {
        console.error("Python error output:", errorOutput);
        return res.status(500).json({ error: "Prediction script failed", details: errorOutput });
      }

      try {
        const parsedOutput = JSON.parse(output);
        const op = processPredictionOutput(parsedOutput);
        res.json(op);
      } catch (err) {
        console.error("Error parsing Python output:", err);
        console.error("Raw output:", output);
        res.status(500).json({ error: "Invalid response from Python script", details: output });
      }
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching AQI data", details: error.message });
  }
};
