import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Icon } from '@mui/material';
import { Air, HealthAndSafety, WbSunny, LocalHospital, SentimentVeryDissatisfied } from '@mui/icons-material';

const AirQualityHealthTips = ({ aqi }) => {
  const [healthTip, setHealthTip] = useState("");
  const [icon, setIcon] = useState(null);
  const [color, setColor] = useState('green');

  useEffect(() => {
    if (aqi <= 50) {
      setHealthTip("Good – Go outside and enjoy the fresh air.");
      setIcon(<WbSunny />);
      setColor('green');
    } else if (aqi <= 100) {
      setHealthTip("Moderate – Sensitive people may want to limit prolonged outdoor activities.");
      setIcon(<Air />);
      setColor('yellow');
    } else if (aqi <= 150) {
      setHealthTip("Unhealthy for Sensitive Groups – Children and people with respiratory conditions should limit outdoor activities.");
      setIcon(<HealthAndSafety />);
      setColor('orange');
    } else if (aqi <= 200) {
      setHealthTip("Unhealthy – Everyone may begin to experience health effects.");
      setIcon(<LocalHospital />);
      setColor('red');
    } else if (aqi <= 300) {
      setHealthTip("Very Unhealthy – Health alert: everyone may experience serious health effects.");
      setIcon(<SentimentVeryDissatisfied />);
      setColor('purple');
    } else {
      setHealthTip("Hazardous – Health warning of emergency conditions.");
      setIcon(<SentimentVeryDissatisfied />);
      setColor('brown');
    }
  }, [aqi]);

  return (
    <Card sx={{ backgroundColor: color, margin: '20px', padding: '20px', borderRadius: '8px', transition: 'transform 0.3s ease' }} elevation={3}>
      <CardContent>
        <Typography variant="h5" component="div" style={{ color: 'white', fontWeight: 'bold' }}>
          Health Tip
        </Typography>
        <Typography variant="body1" style={{ color: 'white', marginTop: '10px' }}>
          {healthTip}
        </Typography>
        <Icon sx={{ fontSize: 40, color: 'white', marginTop: '10px' }}>
          {icon}
        </Icon>
      </CardContent>
    </Card>
  );
};

export default AirQualityHealthTips;
