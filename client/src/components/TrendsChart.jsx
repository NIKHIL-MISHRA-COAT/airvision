import React from "react"
import { Box, Typography, Grid } from "@mui/material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js"
import { Line, Scatter, Bar } from "react-chartjs-2"
import "chartjs-adapter-date-fns"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
)

const chartColors = [
  "rgb(15, 238, 238)",
  "rgb(255, 99, 132)",
  "rgb(53, 162, 235)",
  "rgb(255, 206, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(255, 159, 64)",
  "rgb(231, 233, 237)",
]

const createCommonOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top", labels: { color: "#fff" } },
    title: { display: true, text: title, color: "#fff", font: { size: 18 } },
  },
  scales: {
    x: {
      type: "time",
      time: { unit: "day", tooltipFormat: "PP", displayFormats: { day: "MMM d" } },
      ticks: { color: "#fff" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
      title: { display: true, text: "Date", color: "#fff" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#fff" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
      title: { display: true, text: "Value", color: "#fff" },
    },
  },
  animation: { duration: 2000, easing: "easeInOutQuart" },
})

// Process raw API data into {x: Date, y: number} array
const processData = (rawData, pollutant) => {
  if (!Array.isArray(rawData)) return []

  return rawData
    .map((item) => {
      const date = new Date(item.date)
      let value = item[pollutant]

      if (value === null || value === undefined) return null
      if (typeof value === "object") value = value.value || value.AQI || NaN

      const parsedValue = Number(value)
      if (isNaN(parsedValue) || isNaN(date.getTime())) return null

      return { x: date, y: parsedValue }
    })
    .filter((item) => item !== null)
    .sort((a, b) => a.x - b.x)
}

// Create datasets for multiple cities
const createDatasets = (data, pollutant, cities) => {
  return cities.map((city, idx) => {
    const cityDataRaw = data[city] || []
    const cityData = processData(cityDataRaw, pollutant)
    const color = chartColors[idx % chartColors.length]

    return {
      label: `${pollutant} - ${city}`,
      data: cityData,
      borderColor: color,
      backgroundColor: `${color.slice(0, -1)}88`, // semi-transparent for bars
      tension: 0.2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    }
  })
}

// Main Component
export function TrendsChart({ data, pollutants, cities }) {
  if (!data || Object.keys(data).length === 0)
    return <Typography>No data available.</Typography>

  return (
    <Box sx={{ color: "white" }}>
      {pollutants.map((pollutant, pollutantIndex) => {
        const datasets = createDatasets(data, pollutant, cities)

        if (datasets.every((ds) => ds.data.length === 0))
          return (
            <Box key={pollutant} sx={{ mb: 6 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                {pollutant} Trends
              </Typography>
              <Typography>No valid data points for this pollutant.</Typography>
            </Box>
          )

        return (
          <Box key={pollutant} sx={{ mb: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {pollutant} Trends
            </Typography>
            <Grid container spacing={3}>
              {["Line", "Scatter", "Bar"].map((chartType) => (
                <Grid item xs={12} md={4} key={chartType}>
                  <Box
                    sx={{
                      height: 300,
                      p: 2,
                      bgcolor: "rgba(0, 0, 0, 0.2)",
                      borderRadius: 1,
                    }}
                  >
                    {chartType === "Line" && (
                      <Line
                        options={createCommonOptions(`${pollutant} - Line Chart`)}
                        data={{ datasets }}
                      />
                    )}
                    {chartType === "Scatter" && (
                      <Scatter
                        options={createCommonOptions(`${pollutant} - Scatter Plot`)}
                        data={{ datasets }}
                      />
                    )}
                    {chartType === "Bar" && (
                      <Bar
                        options={createCommonOptions(`${pollutant} - Bar Chart`)}
                        data={{ datasets }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      })}
    </Box>
  )
}
