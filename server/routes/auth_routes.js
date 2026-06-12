// routes/authRoute.js
import express from "express";
import { registerUser, loginUser, homeRoute } from "../controller/auth_cont.js";
// import axios from "axios";
import dotenv from "dotenv";
// import authenticateJWT from "../middleware/auth.js";  // Correct import for authenticateJWT
// routes/airQualityRoute.js
// import express from "express";
import fetch from "node-fetch";
// import dotenv from "dotenv";


dotenv.config(); // Load environment variables
const authRoute = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;

authRoute.post("/register", registerUser);
authRoute.post("/", loginUser);
authRoute.get("/home/:id", homeRoute);


authRoute.get("/air-quality/city", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon } = geoData[0];

    const pollutionRes = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );
    const pollutionData = await pollutionRes.json();

    res.json(pollutionData);
  } catch (error) {
    console.error("❌ Error in air-quality/city:", error.message);
    res.status(500).json({ error: "Failed to fetch air pollution data" });
  }
});

export default authRoute;
