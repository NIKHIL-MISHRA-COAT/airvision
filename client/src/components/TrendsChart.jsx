
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, TimeScale, Title, Tooltip, Legend)

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
    legend: {
      position: "top",
      labels: { color: "#fff" },
    },
    title: {
      display: true,
      text: title,
      color: "#fff",
      font: { size: 18 },
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
        tooltipFormat: "PP",
        displayFormats: { day: "MMM d" },
      },
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

const processData = (rawData, pollutant) => {
  if (!Array.isArray(rawData)) {
    console.error(`Invalid data structure for pollutant: ${pollutant}`, rawData)
    return []
  }

  return rawData
    .map((item) => {
      const date = new Date(item.date)
      const value = Number.parseFloat(item[pollutant])
      if (isNaN(date.getTime()) || isNaN(value)) {
        console.warn(`Invalid data point for ${pollutant}:`, item)
        return null
      }
      return { x: date, y: value }
    })
    .filter((item) => item !== null)
    .sort((a, b) => a.x - b.x)
}

const createChartData = (processedData, pollutant, chartType, colorIndex) => {
  const color = chartColors[colorIndex % chartColors.length]

  return {
    datasets: [
      {
        label: `${pollutant} Levels`,
        data: processedData,
        borderColor: color,
        backgroundColor: chartType === "bar" ? `${color}88` : color,
        tension: 0.1,
        pointRadius: chartType === "scatter" ? 4 : 2,
        pointHoverRadius: 6,
        borderWidth: chartType === "bar" ? 1 : 2,
      },
    ],
  }
}

export function TrendsChart({ data, pollutants }) {
  return (
    <Box sx={{ color: "white" }}>
      {pollutants.map((pollutant, pollutantIndex) => {
        const processedData = processData(data, pollutant)

        if (processedData.length === 0) {
          return (
            <Box key={pollutant} sx={{ mb: 6 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                {pollutant} Trends
              </Typography>
              <Typography>No data available for this pollutant.</Typography>
            </Box>
          )
        }

        return (
          <Box key={pollutant} sx={{ mb: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {pollutant} Trends
            </Typography>
            <Grid container spacing={3}>
              {["Line", "Scatter", "Bar"].map((chartType) => (
                <Grid item xs={12} md={4} key={chartType}>
                  <Box sx={{ height: 300, p: 2, bgcolor: "rgba(0, 0, 0, 0.2)", borderRadius: 1 }}>
                    {chartType === "Line" && (
                      <Line
                        options={createCommonOptions(`${pollutant} - Line Chart`)}
                        data={createChartData(processedData, pollutant, "line", pollutantIndex)}
                      />
                    )}
                    {chartType === "Scatter" && (
                      <Scatter
                        options={createCommonOptions(`${pollutant} - Scatter Plot`)}
                        data={createChartData(processedData, pollutant, "scatter", pollutantIndex)}
                      />
                    )}
                    {chartType === "Bar" && (
                      <Bar
                        options={createCommonOptions(`${pollutant} - Bar Chart`)}
                        data={createChartData(processedData, pollutant, "bar", pollutantIndex)}
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

