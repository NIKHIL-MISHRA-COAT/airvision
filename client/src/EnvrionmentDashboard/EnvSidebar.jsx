import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent,
  IconButton, Chip, Button, CircularProgress, TextField
} from '@mui/material';
import {
  LocationOn, FilterAlt, Refresh, CompareArrows, Clear
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

function EnvSideBar({
  currentCity,
  currentWeatherData,
  onOpenModal,
  comparisonCity,
  onSetComparisonCity,
  onClearComparison,
}) {
  const [localAqiData, setLocalAqiData] = useState(null);
  const [isAqiLoading, setIsAqiLoading] = useState(false);
  const [comparisonInput, setComparisonInput] = useState('');
  const navigate = useNavigate();

  const fetchSidebarAQI = useCallback(async (location) => {
    if (!location) return;
    setIsAqiLoading(true);
    try {
      const timeRange = "7";
      const url = `http://localhost:5001/api/aqi?location=${location}&timeRange=${timeRange}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) { throw new Error("Invalid data format"); }
      setLocalAqiData(data);
    } catch (error) {
      console.error("Error fetching sidebar-specific AQI:", error);
      setLocalAqiData(null);
    } finally {
      setIsAqiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSidebarAQI(currentCity);
  }, [currentCity, fetchSidebarAQI]);

  const todaysData = localAqiData && localAqiData.length > 0 ? localAqiData[localAqiData.length - 1] : null;
  
  const finalAqiValue = todaysData?.AQI ?? currentWeatherData?.aqi ?? null;
  // const aqiInfo = getAqiInfoFromScale(finalAqiValue);
  const roundedAqi = finalAqiValue !== null && !isNaN(finalAqiValue) ? Math.round(finalAqiValue) : null;
const aqiInfo = getAqiInfoFromScale(roundedAqi);
  
  const handleCompareClick = () => {
    if (comparisonInput.trim()) {
        onSetComparisonCity(comparisonInput.trim());
        setComparisonInput(''); // Clear the input after submitting
    }
  };

  return (
    <Box sx={{
      width: 300, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider',
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)',
    }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>EcoVision</Typography>
        <Typography variant="body2" color="text.secondary">Environmental Intelligence Platform</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn sx={{ mr: 1, color: 'black' }} />
                <Typography variant="h6" color='black'>{currentCity || 'Unknown Location'}</Typography>
                <IconButton size="small" sx={{ ml: 'auto', color: 'black' }} onClick={onOpenModal}><FilterAlt /></IconButton>
              </Box>
              {currentWeatherData ? (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 300, mb: 1, color: "black" }}>{currentWeatherData.temperature?.toFixed(1) ?? '--'}°C</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'capitalize', color: "black" }}>{currentWeatherData.condition || 'N/A'}</Typography>
                </Box>
              ) : (<CircularProgress size={20} color="inherit" />)}
            </CardContent>
          </Card>
        </Box>
        
        {currentWeatherData && (
          <Box sx={{ px: 2, mb: 2 }}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
              <Card><CardContent sx={{p: 1.5}}><Typography variant="body2" color="text.secondary">Humidity</Typography><Typography variant="h6">{currentWeatherData.humidity ?? '--'}%</Typography></CardContent></Card>
              <Card><CardContent sx={{p: 1.5}}><Typography variant="body2" color="text.secondary">Wind</Typography><Typography variant="h6">{currentWeatherData.windSpeed ?? '--'} m/s</Typography></CardContent></Card>
            </Box>
            <Card sx={{ mt: 1 }}>
              <CardContent sx={{ p: 1.5 }}>
                 <Box display="flex" alignItems="center" justifyContent="space-between">
                     <Typography variant="body2" color="text.secondary">Air Quality</Typography>
                     {isAqiLoading ? <CircularProgress size={16} /> : <Chip label={aqiInfo.label} size="small" sx={{ bgcolor: aqiInfo.color, color: 'white', fontWeight: 500 }}/>}
                 </Box>
                 <Typography variant="h6" sx={{ color: aqiInfo.color, mt: 0.5 }}>AQI {isAqiLoading ? '...' : finalAqiValue.toFixed(2) ?? '--'}</Typography>
                 <Button fullWidth color='primary' variant='contained' onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>AQI Dashboard</Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Compare Cities</Typography>
        {comparisonCity ? (
            <Card variant="outlined" sx={{ p: 1.5 }}>
                 <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="body2">Comparing with:</Typography>
                        <Typography fontWeight="bold">{comparisonCity}</Typography>
                    </Box>
                    <Button variant="outlined" color="error" onClick={onClearComparison} startIcon={<Clear />}>Remove</Button>
                 </Box>
            </Card>
        ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField fullWidth size="small" label="Compare with..." variant="outlined" value={comparisonInput} onChange={(e) => setComparisonInput(e.target.value)} />
                <Button variant="contained" onClick={handleCompareClick} disabled={!comparisonInput.trim()} sx={{ minWidth: 'auto', px: 2 }}><CompareArrows /></Button>
            </Box>
        )}
      </Box>
    </Box>
  );
}

export default EnvSideBar;