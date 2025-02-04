import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import AirIcon from '@mui/icons-material/Air';// Import the Sidebar component
import MapComponent from './mapComponent'; // Import the Map component
// import { Typography , Button } from '@mui/material';
import { FilterIcon, TrendingUpIcon, ChevronLeftIcon } from "lucide-react";
// import AirIcon from '@mui/icons-material/Air';
// import MapComponent from './mapComponent';
import { Typography, Button, Modal, Box, Select, MenuItem } from '@mui/material';
// import { FilterIcon, TrendingUpIcon } from "lucide-react";
import '../styles/base_ui.css';


import { Input } from '@base-ui-components/react/input';
function MainLayout() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [location, setLocation] = useState('');
  const [pollutant, setPollutant] = useState('');
  const [timeRange, setTimeRange] = useState('');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
  };
  const navigate = useNavigate();
  return (
    <div className="main-layout flex h-screen bg-gray-100">
      <div className="left">
        <Typography
          sx={{
            background: 'linear-gradient(90deg, #42a5f5 5%, #1976d2 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Roboto',
            fontSize: '40px',
            fontWeight: 'bold',
          }}
        >
          Air Vision <AirIcon sx={{ color: '#42a5f5', fontSize: 40, verticalAlign: 'middle' }} />
        </Typography>

        <Typography sx={{ color: 'white', fontSize: '20px', mt: 2 }}>
          AirVision provides real-time air quality maps to help you monitor and
          understand environmental data for healthier living.
        </Typography>

        <div className="button_div">
          <Button variant="contained" color="primary" className='m-3' onClick={handleOpen} startIcon={<FilterIcon />}>
            Filters
          </Button>

          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
                Filter Air Quality Data
              </Typography>

              {/* Latitude & Longitude Inputs */}
              <div className="flec">
                <Typography variant="subtitle1">Enter Latitude & Longitude:</Typography>
                <Input placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="Input" />
                <Input placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="Input" />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>OR Enter Location Name:</Typography>
                <Input placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} className="Input" />
              </div>

              {/* Pollutant Dropdown */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Select Pollutant:</Typography>
              <Select value={pollutant} onChange={(e) => setPollutant(e.target.value)} className="Input">
                <MenuItem value="PM2.5">PM2.5</MenuItem>
                <MenuItem value="PM10">PM10</MenuItem>
                <MenuItem value="CO">Carbon Monoxide (CO)</MenuItem>
                <MenuItem value="NO2">Nitrogen Dioxide (NO2)</MenuItem>
                <MenuItem value="O3">Ozone (O3)</MenuItem>
              </Select>

              {/* Time Range Dropdown */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Select Time Range:</Typography>
              <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="Input">
                <MenuItem value="1h">Last 1 Hour</MenuItem>
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
              </Select>

              {/* Close Button */}
              <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleClose}>
                Apply Filters
              </Button>
            </Box>
          </Modal>

          <Button variant="contained" color="primary" className='m-3' startIcon={<TrendingUpIcon />}>
            Trends
          </Button>
        </div>
      </div>

      {/* Subtitle */}
      <Typography
        sx={{
          color: 'white',
          fontSize: '20px',
          mt: 2, // Add margin-top
        }}
      >
        AirVision provides real-time air quality maps to help you monitor and
        understand environmental data for healthier living.
      </Typography>
      <div className="button_div">
        <Button
          variant="contained"
          color="primary"
          className='m-3'
          // onClick={() => setActiveTab("filters")}
          startIcon={<FilterIcon />}
        >
          Filters
        </Button>

        <Button
          variant="contained"
          color="primary"
          className="m-3"
          onClick={() => navigate("/dashboard")} // Navigate to /dashboard
          startIcon={<TrendingUpIcon />}
        >
          Trends
        </Button>
      </div>

      {/* Map Section */}
      <div className="right">
        <MapComponent showTable={true} />
      </div>
    </div >
  );
}

export default MainLayout;
