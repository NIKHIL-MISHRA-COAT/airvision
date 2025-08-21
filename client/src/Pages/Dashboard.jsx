
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
} from "@mui/material"
import { FiltersPanel } from "../components/FiltersPanel"
import { TrendsChart } from "../components/TrendsChart"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"
import Loader from "../components/Loader"
import PollutionVisualizer from "../components/PollutionVisualizer"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3ea6ff",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#0a0f1c",
      paper: "rgba(39, 44, 56, 0.8)",
    },
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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(31, 41, 55, 0.5)",
            },
          },
        },
      },
    },
  },
})

const pollutants = ["AQI", "PM2_5", "PM10", "CO", "NO", "NO2", "SO2", "O3"]

export default function Dashboard() {
  const [chartData, setChartData] = useState({})
  const [filters, setFilters] = useState({
    location: "",
    timeRange: "7",
  })
  const [loading, setLoading] = useState(false)
  const [selectedPollutants, setSelectedPollutants] = useState(["AQI"])

  const fetchData = useCallback(async (location, timeRange) => {
    setLoading(true)
    try {
      let url;
      if (timeRange == -7) {
        url = `http://localhost:5001/predict?location=${location}`;
      } else {
        url = `http://localhost:5001/api/aqi?location=${location}&timeRange=${timeRange}`;
      }

      const response = await fetch(url)

      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        throw new Error(data.message || "An error occurred while fetching data")
      }
      setChartData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "An error occurred while fetching data",
        confirmButtonColor: "#3ea6ff",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleApplyFilters = ({ location, timeRange }) => {
    setFilters({ location, timeRange })
  }

  useEffect(() => {
    if (filters.location && filters.timeRange) {
      fetchData(filters.location, filters.timeRange)
    }
  }, [filters.location, filters.timeRange, fetchData])

  const handlePollutantChange = (event) => {
    const { name, checked } = event.target
    if (name === "All") {
      setSelectedPollutants(checked ? pollutants : [])
    } else {
      setSelectedPollutants((prev) => {
        const newSelection = checked ? [...prev, name] : prev.filter((p) => p !== name)
        if (newSelection.length === pollutants.length - 1) {
          return pollutants
        } else if (newSelection.length === pollutants.length - 2 && prev.includes("All")) {
          return newSelection.filter((p) => p !== "All")
        }
        return newSelection
      })
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
        <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <Fade in={true} timeout={1000}>
            <Typography variant="h4" gutterBottom sx={{ color: "primary.main", mb: 3 }}>
              Air Quality Dashboard
            </Typography>
          </Fade>

         
            {/* Filters Panel */}
            <Grid item xs={12}>
              <Grow in={true} timeout={1000}>
                <Paper elevation={3} sx={{ p: 0.5, mb: 1 }}>
                  <FiltersPanel onApplyFilters={handleApplyFilters} />
                </Paper>
              </Grow>
            </Grid>
            {/* Pollutant Selection */}
            <Grid item xs={12} >
              <Grow in={true} timeout={2000}>
                <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
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
            </Grid>
            <Grid item xs={12} md={4}>
              <Grow in={true} timeout={1500}>
                <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                  <PollutionVisualizer />
                </Paper>
              </Grow>
            </Grid>
            {/* Main Content Area */}
            <Grid item xs={12} >
              <Grow in={true} timeout={1500}>
                <Paper elevation={3} sx={{ p: 2, height: "100%", bgcolor: "rgba(86, 37, 100, 0.24)" }}>
                  {loading ? (
                    <Box height="300px">
                      <Loader text="Fetching air quality data..." />
                    </Box>
                  ) : (
                    <TrendsChart data={chartData} pollutants={selectedPollutants} />
                  )}
                </Paper>
              </Grow>
            </Grid>

            {/* Visualization Area */}
            

          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

