// src/EnvrionmentDashboard/EnvMain.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, AppBar, Toolbar, Chip, LinearProgress, CircularProgress
} from '@mui/material';
import {
  Thermostat, Air, Visibility, Opacity, Speed, WbSunny
} from '@mui/icons-material';
import MapComponent from '../EnvrionmentDashboard/EnvMap';
import WeatherChart from '../EnvrionmentDashboard/EnvWeatherChart';

// FIX #1: Added the chartColors array you provided.
const chartColors = [
  "rgb(15, 238, 238)",
  "rgb(255, 99, 132)",
  "rgb(53, 162, 235)",
  "rgb(255, 206, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(255, 159, 64)",
  "rgb(231, 233, 237)",
];

const getAqiInfoFromScale = (aqi) => {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return { label: 'N/A', color: '#95a5a6' };
  }
  switch (aqi) {
    case 1: return { label: 'Good', color: '#27ae60' };
    case 2: return { label: 'Fair', color: '#f39c12' };
    case 3: return { label: 'Moderate', color: '#e67e22' };
    case 4: return { label: 'Poor', color: '#e74c3c' };
    case 5: return { label: 'Very Poor', color: '#8e44ad' };
    default: return { label: 'Unknown', color: '#95a5a6' };
  }
};

function EnvMain({ currentCity, currentDataType, weatherData, loading, error }) {
  const getUVIndexColor = (uvIndex) => {
    if (uvIndex <= 2) return '#27ae60';
    if (uvIndex <= 5) return '#f39c12';
    if (uvIndex <= 7) return '#e67e22';
    if (uvIndex <= 10) return '#e74c3c';
    return '#8e44ad';
  };

  const getUVIndexLabel = (uvIndex) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  const [localPollutionData, setLocalPollutionData] = useState(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const fetchLocalPollution = useCallback(async (location) => {
    if (!location) return;
    setIsLocalLoading(true);
    try {
      const timeRange = "7";
      const url = `http://localhost:5001/api/aqi?location=${location}&timeRange=${timeRange}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(data.message || "Failed to fetch local pollution data: Invalid format");
      }
      setLocalPollutionData(data);
    } catch (error) {
      console.error("Error fetching local pollution data:", error);
      setLocalPollutionData(null);
    } finally {
      setIsLocalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalPollution(currentCity);
  }, [currentCity, fetchLocalPollution]);

  const todaysPollutionData = localPollutionData && localPollutionData.length > 0
    ? localPollutionData[localPollutionData.length - 1]
    : null;

  let pollutantsToDisplay = {};
  if (todaysPollutionData) {
    const { date, AQI, ...rest } = todaysPollutionData;
    pollutantsToDisplay = rest;
  }
  const aqiInfo = getAqiInfoFromScale(todaysPollutionData?.AQI);

  if (loading) {
    return <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {currentCity || 'Unknown City'} - {currentDataType ? currentDataType.replace(/([A-Z])/g, ' $1').trim() : 'Loading...'}
          </Typography>
        </Toolbar>
      </AppBar>

      {todaysPollutionData && todaysPollutionData.AQI > 3 && (
        <Box sx={{ bgcolor: 'warning.light', p: 1 }}>
          <Typography variant="body2" color="warning.contrastText" fontWeight="bol" align="center">
             Air Quality Alert: Current AQI is {todaysPollutionData.AQI.toFixed(2)} - Consider limiting outdoor activities
          </Typography>
        </Box>
      )}

      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Grid container spacing={3}>
          {weatherData ? (
            <>
              {/* Map */}
              <Grid item xs={12} md={8}>
                <Card sx={{ height: 615, mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Interactive Map</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label="Live Data" color="success" size="small" />
                        <Chip label={currentDataType} color="primary" size="small" />
                      </Box>
                    </Box>
                    <MapComponent currentCity={currentCity} dataType={currentDataType} data={weatherData} />
                  </CardContent>
                </Card>
              </Grid>

              {/* Weather Cards */}
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Thermostat color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Temperature</Typography>
                        </Box>
                        <Typography variant="h3" color="primary">
                          {weatherData.temperature?.toFixed(1) ?? '--'}°C
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Feels like {weatherData.feelsLike?.toFixed(1) ?? '--'}°C
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Air color="info" sx={{ mb: 1 }} />
                        <Typography variant="h6">{weatherData.windSpeed ?? '--'}</Typography>
                        <Typography variant="body2" color="text.secondary">Wind (m/s)</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Opacity color="info" sx={{ mb: 1 }} />
                        <Typography variant="h6">{weatherData.humidity ?? '--'}%</Typography>
                        <Typography variant="body2" color="text.secondary">Humidity</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Visibility color="info" sx={{ mb: 1 }} />
                        <Typography variant="h6">{weatherData.visibility ?? '--'}</Typography>
                        <Typography variant="body2" color="text.secondary">Visibility (km)</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Speed color="info" sx={{ mb: 1 }} />
                        <Typography variant="h6">{weatherData.pressure ?? '--'}</Typography>
                        <Typography variant="body2" color="text.secondary">Pressure (hPa)</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WbSunny sx={{ color: getUVIndexColor(weatherData.uvIndex), mr: 1 }} />
                            <Typography variant="h6">UV Index</Typography>
                          </Box>
                          <Chip
                            label={getUVIndexLabel(weatherData.uvIndex)}
                            sx={{ bgcolor: getUVIndexColor(weatherData.uvIndex), color: 'white', fontWeight: 'bold' }}
                          />
                        </Box>
                        <Typography variant="h4" sx={{ color: getUVIndexColor(weatherData.uvIndex), mb: 1 }}>
                          {weatherData.uvIndex ?? '--'}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(weatherData.uvIndex / 11) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': { backgroundColor: getUVIndexColor(weatherData.uvIndex) },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Air Quality Breakdown */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    {isLocalLoading ? (
                      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150}}>
                        <CircularProgress />
                      </Box>
                    ) : todaysPollutionData ? (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Box>
                            <Typography variant="h6">Today's Air Quality Breakdown</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Overall AQI: <span style={{color: aqiInfo.color, fontWeight: 'bold'}}>{todaysPollutionData.AQI}</span>
                            </Typography>
                          </Box>
                          <Chip label={aqiInfo.label} sx={{ bgcolor: aqiInfo.color, color: 'white', fontWeight: 500 }}/>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          {Object.entries(pollutantsToDisplay).map(([pollutant, value], index) => (
                            <Card
                              key={pollutant}
                              variant="outlined"
                              sx={{
                                flex: '1 1 100px',
                                p: 1,
                                textAlign: 'center',
                                borderTop: `4px solid ${chartColors[index % chartColors.length]}`,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: chartColors[index % chartColors.length],
                                }}
                              >
                                {typeof value === 'number' ? value.toFixed(2) : value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                {pollutant.replace('_', '.')}
                              </Typography>
                            </Card>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Typography color="text.secondary" variant="body2">
                        No detailed air quality breakdown data available.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Historical Trends */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Historical Trends</Typography>
                    <WeatherChart city={currentCity} />
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No data available for {currentCity || 'this location'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default EnvMain;
