import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { API_KEY } from '../services/helper'; // Your API key management
import axios from 'axios';

function WeatherChart({ city }) {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    const fetchHourlyForecast = async () => {
      try {
        setLoading(true);
        // Fetch coordinates from city name using OpenWeatherMap Geo API
        const geoRes = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        if (!geoRes.data || geoRes.data.length === 0) throw new Error('City not found');
        const { lat, lon } = geoRes.data[0];

        // Fetch 5-day/3-hour forecast data
        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        // Extract next 8 forecasts (24 hours)
        const next24h = forecastRes.data.list.slice(0, 8).map(entry => ({
          time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: entry.main.temp,
        }));

        setHourlyData(next24h);
      } catch (err) {
        console.error('Error fetching forecast:', err);
        setHourlyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyForecast();
  }, [city]);

  if (loading) return <Typography sx={{ textAlign: 'center', py: 4 }}>Loading chart...</Typography>;
  if (hourlyData.length === 0) return <Typography sx={{ textAlign: 'center', py: 4 }}>No forecast data available for {city}</Typography>;

  const currentTemp = hourlyData[hourlyData.length - 1].temp;
  const previousTemp = hourlyData.length > 1 ? hourlyData[hourlyData.length - 2].temp : currentTemp;
  const tempTrend = currentTemp > previousTemp;

  return (
    <Box sx={{ height: 200 }}>
      {/* Chart Visualization */}
      <Box sx={{ display: 'flex', alignItems: 'end', height: 120, gap: 2, mb: 2 }}>
        {hourlyData.map((data, index) => (
          <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
            <Box
              sx={{
                height: `${(data.temp / 40) * 100}px`, // scale by max 40°C
                bgcolor: 'primary.main',
                borderRadius: 1,
                mb: 1,
                opacity: 0.7 + (index * 0.03),
              }}
            />
            <Typography variant="caption">{data.time}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {tempTrend ? (
            <TrendingUp color="success" sx={{ mr: 1 }} />
          ) : (
            <TrendingDown color="error" sx={{ mr: 1 }} />
          )}
          <Typography variant="body2" color="text.secondary">
            Temperature {tempTrend ? 'Rising' : 'Falling'}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">Last 24 hours in {city}</Typography>
      </Box>
    </Box>
  );
}

export default WeatherChart;
