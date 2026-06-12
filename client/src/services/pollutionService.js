import axios from "axios";
export const fetchAirPollutionDataByCity = async (city) => {
  try {
    const response = await axios.get(`http://localhost:5001/air-quality/city?city=${city}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching pollution data:", error);
    throw new Error("API error: Failed to fetch air pollution data");
  }
};
