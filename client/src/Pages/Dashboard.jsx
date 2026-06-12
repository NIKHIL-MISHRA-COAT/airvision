import React, { useState, useEffect, useCallback } from "react"
import {
  Grid,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Fade,
  Grow,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material"
import { FiltersPanel } from "../components/FiltersPanel"
import { TrendsChart } from "../components/TrendsChart"
import Navbar from "../components/navbar"
import Loader from "../components/Loader"
import PollutionVisualizer from "../components/PollutionVisualizer"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import CloseIcon from "@mui/icons-material/Close"

const MySwal = withReactContent(Swal)

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3ea6ff" },
    secondary: { main: "#f50057" },
    background: { default: "#0a0f1c", paper: "rgba(39, 44, 56, 0.8)" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(36, 42, 51, 0.5)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
            transform: "translateY(-5px)",
          },
        },
      },
    },
  },
})

const pollutants = ["AQI", "PM2.5", "PM10", "CO", "NO", "NO2", "SO2", "O3"]

export default function Dashboard() {
  const [chartData, setChartData] = useState([]) // array of datasets for 1 or 2 cities
  const [filters, setFilters] = useState({ location1: "", location2: "", timeRange: "7" })
  const [loading, setLoading] = useState(false)
  const [selectedPollutants, setSelectedPollutants] = useState(["AQI"])
  const [openZoom, setOpenZoom] = useState(false)

  const handleZoomOpen = () => setOpenZoom(true)
  const handleZoomClose = () => setOpenZoom(false)

  // Fetch data for both cities
const fetchData = useCallback(async (location1, location2, timeRange) => {
  setLoading(true)
  try {
    const urls = [
      timeRange === "-7"
        ? `http://localhost:5001/predict?location=${location1}`
        : `http://localhost:5001/api/aqi?location=${location1}&timeRange=${timeRange}`,
      location2
        ? timeRange === "-7"
          ? `http://localhost:5001/predict?location=${location2}`
          : `http://localhost:5001/api/aqi?location=${location2}&timeRange=${timeRange}`
        : null,
    ]

    const responses = await Promise.all(urls.filter(Boolean).map((url) => fetch(url)))
    const dataArray = await Promise.all(responses.map((res) => res.json()))

    // Convert to nested object by city
    const structuredData = {}
    if (dataArray[0]) structuredData[location1] = dataArray[0]
    if (dataArray[1] && location2) structuredData[location2] = dataArray[1]

    setChartData(structuredData)
  } catch (error) {
    console.error("Error fetching data:", error)
    MySwal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message || "An error occurred while fetching data",
      confirmButtonColor: "#3ea6ff",
    })
    setChartData({})
  } finally {
    setLoading(false)
  }
}, [])

  // Apply filters from FiltersPanel
  const handleApplyFilters = ({ location1, location2, timeRange }) => {
    setFilters({ location1, location2, timeRange })
  }

  useEffect(() => {
    if (filters.location1) {
      fetchData(filters.location1, filters.location2, filters.timeRange)
    }
  }, [filters, fetchData])

  const handlePollutantChange = (event) => {
    const { name, checked } = event.target
    if (name === "All") {
      setSelectedPollutants(checked ? pollutants : [])
    } else {
      setSelectedPollutants((prev) => {
        const updated = checked ? [...prev, name] : prev.filter((p) => p !== name)
        return updated.length === pollutants.length - 1 ? pollutants : updated
      })
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Fade in timeout={1000}>
            <Typography variant="h4" gutterBottom sx={{ color: "primary.main", mb: 3 }}>
              Air Quality Dashboard
            </Typography>
          </Fade>

          <Grid container spacing={2}>
            {/* Filters Panel */}
            <Grid item xs={12}>
              <Grow in timeout={1000}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <FiltersPanel onApplyFilters={handleApplyFilters} />
                </Paper>
              </Grow>
            </Grid>

            {/* Pollutant Selection */}
            <Grid item xs={12}>
              <Grow in timeout={1500}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Select Pollutants
                  </Typography>
                  <FormGroup row>
                    {pollutants.map((pollutant) => (
                      <FormControlLabel
                        key={pollutant}
                        control={
                          <Checkbox
                            checked={selectedPollutants.includes(pollutant)}
                            onChange={handlePollutantChange}
                            name={pollutant}
                          />
                        }
                        label={pollutant}
                      />
                    ))}
                  </FormGroup>
                </Paper>
              </Grow>
            </Grid>

            {/* Trends Chart */}
            <Grid item xs={12} md={8}>
              <Grow in timeout={1500}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    height: "100%",
                    position: "relative",
                    bgcolor: "rgba(86, 37, 100, 0.24)",
                  }}
                >
                  <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                    <IconButton color="primary" onClick={handleZoomOpen}>
                      <ZoomInIcon />
                    </IconButton>
                  </Box>
                  {loading ? (
                    <Box height="300px">
                      <Loader text="Fetching air quality data..." />
                    </Box>
                  ) : (
                    <TrendsChart
  data={chartData} // now an object { cityName: [...data] }
  pollutants={selectedPollutants}
  cities={[filters.location1, filters.location2].filter(Boolean)}
  large
/>
                  )}
                </Paper>
              </Grow>
            </Grid>

            {/* Zoom Dialog */}
            <Dialog open={openZoom} onClose={handleZoomClose} maxWidth="xl" fullWidth>
              <DialogContent sx={{ position: "relative", p: 3, backgroundColor: "#0a0f1c" }}>
                <IconButton
                  onClick={handleZoomClose}
                  sx={{ position: "absolute", top: 10, right: 10, color: "#fff" }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom color="primary">
                  Detailed Air Quality Trends
                </Typography>

                <TrendsChart
                  data={chartData}
                  pollutants={selectedPollutants}
                  cities={[filters.location1, filters.location2].filter(Boolean)}
                  large
                />
              </DialogContent>
            </Dialog>

            {/* Pollution Visualizer */}
            <Grid item xs={12} md={4}>
              <Grow in timeout={1000}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    height: "100%",
                    backgroundColor: "rgba(25, 25, 112, 0.2)",
                    backdropFilter: "blur(5px)",
                    borderRadius: 4,
                  }}
                >
                  {loading ? (
                    <Box height="400px">
                      <Loader text="Loading real-time AQI data..." />
                    </Box>
                  ) : (
                    <>
                      {chartData[0] && (
                        <PollutionVisualizer
                          aqi={chartData[0][chartData[0].length - 1]?.AQI || 50}
                          city={filters.location1}
                        />
                      )}
                      {chartData[1] && filters.location2 && (
                        <PollutionVisualizer
                          aqi={chartData[1][chartData[1].length - 1]?.AQI || 50}
                          city={filters.location2}
                        />
                      )}
                    </>
                  )}
                </Paper>
              </Grow>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
