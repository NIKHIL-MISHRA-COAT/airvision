import React, { useState } from "react"
import { TextField, MenuItem, Button, Box, Grid } from "@mui/material"

export function FiltersPanel({ onApplyFilters }) {
  const [location1, setLocation1] = useState("")
  const [location2, setLocation2] = useState("")
  const [timeRange, setTimeRange] = useState("7")

  const handleApplyFilters = () => {
    onApplyFilters({ location1, location2, timeRange })
  }

  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: "#3f51b5",
      padding: "0 4px",
      transform: "translate(10px, -2px) scale(0.7)",
      zIndex: 1,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: "rgba(31, 41, 55, 0.3)",
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "#3f51b5",
      },
    },
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* First City */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="City 1"
            variant="outlined"
            fullWidth
            value={location1}
            onChange={(e) => setLocation1(e.target.value)}
            sx={inputStyles}
          />
        </Grid>

        {/* Second City */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="City 2 (optional)"
            variant="outlined"
            fullWidth
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
            sx={inputStyles}
          />
        </Grid>

        {/* Time Range */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Select Time Range"
            select
            fullWidth
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={inputStyles}
          >
            <MenuItem value="1">Today's</MenuItem>
            <MenuItem value="7">Last 7 Days</MenuItem>
            <MenuItem value="31">Last Month</MenuItem>
            <MenuItem value="365">Last Year</MenuItem>
            <MenuItem value="730">Last 2 Years</MenuItem>
            <MenuItem value="-7">Next 7 Days (Forecasting)</MenuItem>
          </TextField>
        </Grid>

        {/* Apply Filters Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleApplyFilters}
            sx={{
              height: "56px",
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
