// weatherService.js


import { API_KEY } from './helper'; // Replace with your actual API key

// weatherService.js
export const fetchWeatherData = async (city) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();
  return {
    ...data,
    coord: data.coord, // contains { lat, lon }
  };
};




