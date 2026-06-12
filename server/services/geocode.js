const express = require('express');
const axios = require('axios');

const app = express();

app.get('/api/geocode', async (req, res) => {
  const { location } = req.query;
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'json', q: location },
      headers: { 'User-Agent': 'YourAppName/1.0 (your-email@example.com)' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
