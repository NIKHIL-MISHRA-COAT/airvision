export const BASE_URL = "http://localhost:5001";
export const API_KEY ="95a4a6cb3d4959918f44e4b88b2b0bf4"

// utils.js
export const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'green';
    if (aqi <= 100) return 'yellow';
    if (aqi <= 150) return 'orange';
    if (aqi <= 200) return 'red';
    if (aqi <= 300) return 'purple';
    return 'brown';
  };
  