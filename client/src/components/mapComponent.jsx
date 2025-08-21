import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BasicTable from "./table";
import L from "leaflet";

import { fetchAirPollutionData } from "../services/pollutionService";
import "../Styles/map.css"; // Import custom CSS for styling

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = ({ showTable = true }) => {
  const defaultPosition = [19.076, 72.8777]; // Default map center position (Mumbai)
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAirQualityData = async () => {
      try {
        setLoading(true);
        const data = await fetchAirPollutionData();
        if (data) {
          setStation({
            city: data.city,
            lat: data.location.coordinates[1], // Latitude
            lon: data.location.coordinates[0], // Longitude
            aqi: data.current.pollution.aqius,
            pollutant: data.current.pollution.mainus,
          });
          localStorage.setItem("aqi",data.current.pollution.aqius );

        } else {
          console.error("Failed to fetch air quality data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getAirQualityData();
  }, []);

  return (
    <>
      <div className="map-container">
        {loading ? (
          <div className="loading-message">Loading air quality data...</div>
        ) : (
          <MapContainer
            center={
              station && station.lat && station.lon
                ? [station.lat, station.lon]
                : defaultPosition
            }
            zoom={13}
            style={{ height: "100%", width: "700px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {station && station.lat && station.lon && (
              <Marker position={[station.lat, station.lon]}>
                <Popup>
                  <strong>{station.city}</strong> <br />
                  AQI: {station.aqi} <br />
                  Main Pollutant: {station.pollutant}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
      {/* Conditionally render the table */}
      {showTable && station && <BasicTable stationData={station} />}
    </>
  );
};

export default MapComponent;
