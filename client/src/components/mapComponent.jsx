/* eslint-disable react/prop-types */
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  Polyline,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/new_map.css";
import { useEffect } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  CardContent,
  Typography,
  Fade,
} from "@mui/material";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

import AirIcon from "@mui/icons-material/Air";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

const { BaseLayer, Overlay } = LayersControl;

const RecenterMap = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 10);
  }, [lat, lon, map]);
  return null;
};

const arrowIcon = (angle) =>
  L.divIcon({
    className: "wind-arrow",
    html: `<div style="transform: rotate(${angle}deg);">➤</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const getHeatColor = (temp) => {
  if (temp < 10) return "#2196f3";
  if (temp < 20) return "#00bcd4";
  if (temp < 30) return "#ffc107";
  return "#f44336";
};

const defaultPinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const WeatherTable = ({ weather }) => {
  if (!weather || !weather.main) return null;

  const rows = [
    {
      label: "Temperature",
      value: `${weather.main.temp} °C`,
      icon: <WhatshotIcon color="error" />,
    },
    {
      label: "Feels Like",
      value: `${weather.main.feels_like} °C`,
      icon: <WbSunnyIcon color="warning" />,
    },
    {
      label: "Humidity",
      value: `${weather.main.humidity} %`,
      icon: <OpacityIcon color="primary" />,
    },
    {
      label: "Wind Speed",
      value: `${weather.wind?.speed || "N/A"} m/s`,
      icon: <AirIcon color="info" />,
    },
    {
      label: "Condition",
      value: weather.weather?.[0]?.description || "N/A",
    },
  ];

  return (
    <Fade in timeout={600}>
      <Box mt={4} px={2}>
        <Card elevation={5} sx={{ borderRadius: 3, boxShadow: 6 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🌤 Weather Data Overview
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Attribute</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Badge</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.label}</TableCell>
                      <TableCell align="right">{row.value}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={row.label}
                          icon={row.icon || null}
                          color="secondary"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

const MapComponent = ({ data , filter}) => {
  const defaultPosition = { lat: 19.07283, lon: 72.88261 };
  const lat = parseFloat(data?.lat || defaultPosition.lat);
  const lon = parseFloat(data?.lon || defaultPosition.lon);
  const weather = data?.payload;
// Sample points for heatmap [lat, lon, intensity]
const heatmapPoints = [
  [lat, lon, weather?.main?.temp || 20], // center point
  [lat + 0.05, lon + 0.03, 28],
  [lat - 0.04, lon - 0.02, 30],
  [lat + 0.02, lon - 0.04, 22],
];

  return (
    <Box>
     <MapContainer center={[19.07283, 72.88261]} zoom={10} className="leaflet-map">
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="© OpenStreetMap contributors"
  />
</MapContainer>

      {/* 🌤 Table below map */}
      <WeatherTable weather={weather} />
    </Box>
  );
};

export default MapComponent;
