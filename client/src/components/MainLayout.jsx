import { useState, useEffect } from "react";
import AirIcon from "@mui/icons-material/Air";
import {
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { fetchAirPollutionDataByCity } from "../services/pollutionService";
import { TrendingUp } from "lucide-react";
import PollutionVisualizer from "../components/PollutionVisualizer";
import PollutionTable from "../components/PollutionTable";
// import Navbar from "../components/Navbar"; // Assuming Navbar is here
import "../styles/main.css";

function MainLayout({ searchQuery, setSearchQuery }) {
  const [location, setLocation] = useState("");
  const [airQualityData, setAirQualityData] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const defaultData = {
    lat: 19.07283,
    lon: 72.88261,
    city: "Mumbai",
    aqi: "N/A",
    pollutant: "N/A",
    type: "pollution",
    payload: {},
  };

  useEffect(() => {
    if (searchQuery && !airQualityData) {
      handleFetchData(searchQuery);
    }
  }, [searchQuery]);

  const handleFetchData = async (city) => {
    if (!city || city.trim().length < 3) {
      setError("Enter a valid city (min 3 chars).");
      return;
    }

    const formattedCity = city.trim().replace(/\s+/g, "+");
    setLoading(true);
    setError("");

    try {
      const data = await fetchAirPollutionDataByCity(formattedCity);
      if (!data || data.error || data.city_not_found) {
        throw new Error(data.error || "City not found.");
      }
      setAirQualityData({ ...data, type: "pollution" });
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError(error.message || "Error fetching data.");
      setAirQualityData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(location.trim());
    setSearchOpen(false);
    setLocation("");
  };

  return (
    <div className="landing-page">
      {/* <Navbar /> */}

      <main className="landing-main">
        <section className="landing-info-card">
          <Card className="info-card" elevation={6}>
            <CardContent>
              <Typography variant="h4" component="h1" className="title" gutterBottom>
                Air Vision <AirIcon fontSize="large" className="icon" />
              </Typography>
              <Typography variant="body1" className="subtitle" paragraph>
                Real-time air quality insights to help you breathe better and live healthier.
              </Typography>

              <div className="search-actions">
                <IconButton
                  aria-label="open search"
                  color="primary"
                  onClick={() => setSearchOpen(true)}
                  disabled={loading}
                  size="large"
                >
                  <SearchIcon />
                </IconButton>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<TrendingUp />}
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                >
                  Trends
                </Button>
              </div>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="filter-label">Data Filter</InputLabel>
                <Select
                  labelId="filter-label"
                  value={filter}
                  label="Data Filter"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="heat">Heatmap</MenuItem>
                  <MenuItem value="wind">Wind Flow</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
            <CardActions>
              {loading && (
                <Typography variant="body2" color="textSecondary" className="loading-text">
                  Loading data...
                </Typography>
              )}
              {error && (
                <Typography variant="body2" color="error" className="error-text">
                  {error}
                </Typography>
              )}
            </CardActions>
          </Card>

          <PollutionVisualizer data={airQualityData || defaultData} />
        </section>

        <section className="landing-table-card">
          <PollutionTable data={airQualityData || defaultData} />
        </section>
      </main>

      {/* Search Modal */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} aria-labelledby="search-city-modal">
        <Box className="modal-box" component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" id="search-city-modal" gutterBottom>
            Enter City Name
          </Typography>
          <TextField
            fullWidth
            placeholder="City name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={loading}
            autoFocus
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default MainLayout;
