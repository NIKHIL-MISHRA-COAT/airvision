import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Button, Box, Typography
} from '@mui/material';
// import { Eco } from '@mui/icons-material';

const dataTypes = [
  { value: 'heatmap', label: '🌡️ Heat Map' },
  { value: 'windflow', label: '💨 Wind Flow' },
  { value: 'climate', label: '☁️ Climate' },
  { value: 'forecast', label: '☀️ Weather Forecast' },
  { value: 'airquality', label: '🌿 Air Quality Index' },
  { value: 'uv', label: '🔆 UV Index' },
];

function WelcomeModal({ open, onClose, onSubmit }) {
  const [city, setCity] = useState('');
  const [dataType, setDataType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city && dataType) {
      onSubmit(city, dataType);
      setCity('');
      setDataType('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 2 } }}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {/* <Eco sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} /> */}
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            🌍 Welcome to EcoVision
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Enter a city name and select the data type
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="City Name"
              placeholder="e.g., Mumbai"
              variant="outlined"
              required
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              sx={{ mt: 1 }}
            />
            <FormControl fullWidth required>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                label="Data Type"
              >
                {dataTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" size="large" disabled={!city || !dataType} sx={{ minWidth: 120 }}>
            Apply Filters
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default WelcomeModal;
