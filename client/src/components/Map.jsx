import React from 'react';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapIcon } from 'lucide-react';
import Navbar from './navbar';
import MapComponent from './mapComponent';
import Footer from './footer';

function Map() {
  const position = [51.505, -0.09] // Example coordinates (London)

  return (
    <Box sx={{ height: '400px', width: '100%' }}>
      <Typography variant="h6" gutterBottom>Air Quality Map</Typography>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            A sample location. <br /> Air Quality: Good.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}

export default Map;

