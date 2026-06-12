// src/EnvrionmentDashboard/EnvMap.js

import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { BaseLayer, Overlay } = LayersControl;

const RecenterMap = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.setView([lat, lon], 10);
  }, [lat, lon, map]);
  return null;
};

const defaultPinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// FIX: Removed unused 'filter' prop
function EnvMap({ data, currentCity }) {
  // Now `data.lat` and `data.lon` will be correctly passed from the parent state
  const lat = parseFloat(data?.lat) || 19.07283; // Default to Mumbai
  const lon = parseFloat(data?.lon) || 72.88261; // Default to Mumbai

  // Show tooltip on layer labels (title attribute)
  const renderLayersControl = () => (
    <LayersControl position="topright">
      <BaseLayer checked name="OpenStreetMap" title="Standard OpenStreetMap tiles">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      </BaseLayer>
      <BaseLayer name="Topographic Map" title="Topographic map tiles">
        <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="© OpenTopoMap" />
      </BaseLayer>
      <Overlay name="Air Quality (AQICN)" title="Displays real-time Air Quality Index overlay">
        <TileLayer
          url="https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=a109ea80ea15e3002eeb17f1902cf61eb9b61451"
          opacity={0.5}
          attribution="© AQICN.org"
        />
      </Overlay>
      <Overlay checked name="📍 Location Marker" title="Marker for selected city location">
        <Marker position={[lat, lon]} icon={defaultPinIcon}>
          <Popup>📍 {currentCity || 'Selected Location'}</Popup>
        </Marker>
      </Overlay>
    </LayersControl>
  );

  return (
    <MapContainer center={[lat, lon]} zoom={10} style={{ height: '550px', width: '100%' }}>
      <RecenterMap lat={lat} lon={lon} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {renderLayersControl()}
    </MapContainer>
  );
}

export default EnvMap;