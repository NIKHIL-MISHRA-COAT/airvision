import { useState, useEffect } from "react";
import {
  Filter,
  Thermometer,
  Wind,
  Sun,
  ChevronLeft,
  Cloud,
  Droplets,
  Gauge,
  // Loader,
} from "lucide-react";
import Navbar from "./navbar";
import MapComponent from "./mapComponent";
import Footer from "./footer";
import {
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { fetchAirPollutionDataByCity } from "../services/pollutionService";
import { fetchWeatherData } from "../services/weatherService";
import "../styles/dashboard.css"; // Make sure to use the new CSS file

function Map() {
  const pollutantOptions = {
    pm2_5: { name: "PM2.5", unit: "µg/m³" },
    pm10: { name: "PM10", unit: "µg/m³" },
    co: { name: "CO", unit: "µg/m³" },
    no2: { name: "NO2", unit: "µg/m³" },
    o3: { name: "O3", unit: "µg/m³" },
    so2: { name: "SO2", unit: "µg/m³" },
  };

  const filterOptions = ["Air Quality", "Heat Map", "Wind Speed", "Climate"];

  // --- State Management ---
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [location, setLocation] = useState("Mumbai");
  const [pollutant, setPollutant] = useState("pm2_5");
  const [filterType, setFilterType] = useState("Air Quality");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userDashboardData"));
    const savedLocation = saved?.location || "Mumbai";
    const savedFilter = saved?.filterType || "Air Quality";
    const savedPollutant = saved?.pollutant || "pm2_5";

    setLocation(savedLocation);
    setFilterType(savedFilter);
    setPollutant(savedPollutant);
    fetchData(savedLocation, savedFilter, savedPollutant);
  }, []);

  const fetchData = async (city, filter, pollutantKey) => {
    if (!city) {
      setData({ error: "Please enter a city name." });
      return;
    }
    setIsLoading(true);
    setData(null); // Clear previous data
    try {
      let fetchedData;
      if (filter === "Air Quality") {
        const pollutionData = await fetchAirPollutionDataByCity(city);
        fetchedData = {
          type: "pollution",
          payload: pollutionData,
          pollutant: pollutantOptions[pollutantKey]?.name || "N/A",
          city,
        };
      } else {
        const weatherData = await fetchWeatherData(city);
        fetchedData = {
          type: filter.toLowerCase().replace(" ", ""),
          payload: weatherData,
          city,
        };
      }
      setData(fetchedData);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setData({ error: "Could not fetch data. Please check the city name." });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Event Handlers ---
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newEntry = { location, pollutant, filterType };
    localStorage.setItem("userDashboardData", JSON.stringify(newEntry));
    fetchData(location, filterType, pollutant);
  };

  // --- Render Helper for Info Panel ---
  const renderInfoPanelContent = () => {
    if (isLoading) {
      return (
        <div className="panel-message">
          <CircularProgress size={24} />
          <Typography>Fetching latest data...</Typography>
        </div>
      );
    }
    if (data?.error) {
      return <p className="panel-message error">{data.error}</p>;
    }
    if (data?.payload) {
      return (
        <ul className="info-list">
          {data.type === "pollution" && data.payload.list && (
            <>
              <li>
                <Gauge size={18} /> Air Quality Index:{" "}
                <strong>{data.payload.list[0].main.aqi}</strong>
              </li>
              {Object.entries(data.payload.list[0].components).map(([key, value]) => (
                <li key={key}>
                  🧪 {pollutantOptions[key]?.name || key.toUpperCase()}:{" "}
                  <strong>{value.toFixed(2)}</strong> {pollutantOptions[key]?.unit}
                </li>
              ))}
            </>
          )}
          {data.payload.main && (
            <>
              <li><Thermometer size={18} /> Temp: <strong>{data.payload.main.temp}°C</strong></li>
              <li><Sun size={18} /> Feels Like: <strong>{data.payload.main.feels_like}°C</strong></li>
              <li><Wind size={18} /> Wind: <strong>{data.payload.wind?.speed} m/s</strong></li>
              <li><Droplets size={18} /> Humidity: <strong>{data.payload.main.humidity}%</strong></li>
              <li><Cloud size={18} /> Condition: <strong>{data.payload.weather?.[0]?.description}</strong></li>
            </>
          )}
        </ul>
      );
    }
    return <p className="panel-message">Apply filters to see data.</p>;
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className={`dashboard-main ${!isSidebarOpen ? "sidebar-closed" : ""}`}>
        {/* --- Sidebar for Filters --- */}
        <Paper component="aside" className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <Typography variant="h6" component="h2"><Filter size={20} /> Filters</Typography>
            <Tooltip title={isSidebarOpen ? "Hide Filters" : "Show Filters"}>
              <IconButton onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <ChevronLeft className={`chevron-icon ${!isSidebarOpen ? "closed" : ""}`} />
              </IconButton>
            </Tooltip>
          </div>
          <form className="filter-form" onSubmit={handleFilterSubmit}>
            <TextField fullWidth label="City Name" variant="outlined" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Typography component="label" gutterBottom sx={{ mt: 2, fontSize: '0.9rem', color: '#666' }}>Data Layer</Typography>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} fullWidth>
              {filterOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </Select>

            {filterType === "Air Quality" && (
              <>
                <Typography component="label" gutterBottom sx={{ mt: 2, fontSize: '0.9rem', color: '#666' }}>Pollutant</Typography>
                <Select value={pollutant} onChange={(e) => setPollutant(e.target.value)} fullWidth>
                  {Object.entries(pollutantOptions).map(([key, { name }]) => <MenuItem key={key} value={key}>{name}</MenuItem>)}
                </Select>
              </>
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>Apply</Button>
          </form>
        </Paper>

        {/* --- Main Content: Map and Info --- */}
        <main className="main-content">
          <Typography variant="h4" component="h1" gutterBottom>Environment Dashboard</Typography>
          <div className="map-info-container">
            <div className="map-wrapper">
              <MapComponent data={data} isLoading={isLoading} />
            </div>
            <Paper className="info-panel">
              <Typography variant="h6" component="h3" gutterBottom>📊 {location} Overview</Typography>
              {renderInfoPanelContent()}
            </Paper>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Map;