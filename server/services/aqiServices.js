
import axios from 'axios';
import { getCoordinatesFromOSM, getUnixRange } from '../utils/aqi.js'; // Ensure to include .js extension if needed


// Function to aggregate hourly data to daily data
export const aggregateToDailyData = (data, latitude, longitude) => {
  const groupedData = {};

  data.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];

    if (!groupedData[date]) {
      groupedData[date] = {
        count: 0,
        AQI: 0, CO: 0, NO: 0, NO2: 0,
        O3: 0, SO2: 0, PM2_5: 0,
        PM10: 0, NH3: 0
      };
    }

    groupedData[date].count++;
    groupedData[date].AQI += item.main.aqi || 0;
    groupedData[date].CO += item.components.co || 0;
    groupedData[date].NO += item.components.no || 0;
    groupedData[date].NO2 += item.components.no2 || 0;
    groupedData[date].O3 += item.components.o3 || 0;
    groupedData[date].SO2 += item.components.so2 || 0;
    groupedData[date].PM2_5 += item.components.pm2_5 || 0;
    groupedData[date].PM10 += item.components.pm10 || 0;
    groupedData[date].NH3 += item.components.nh3 || 0;
  });

  const dailyData = Object.keys(groupedData).map(date => {
    const dayData = groupedData[date];
    const count = dayData.count;

    return {
      date,
      AQI: dayData.AQI / count,
      CO: dayData.CO / count,
      NO: dayData.NO / count,
      NO2: dayData.NO2 / count,
      O3: dayData.O3 / count,
      SO2: dayData.SO2 / count,
      PM2_5: dayData.PM2_5 / count,
      PM10: dayData.PM10 / count,
      NH3: dayData.NH3 / count,
      // day_sin: Math.sin(new Date(date).getUTCDay() * (2 * Math.PI / 7)),
      // day_cos: Math.cos(new Date(date).getUTCDay() * (2 * Math.PI / 7)),
      // month_sin: Math.sin((new Date(date).getUTCMonth() + 1) * (2 * Math.PI / 12)),
      // month_cos: Math.cos((new Date(date).getUTCMonth() + 1) * (2 * Math.PI / 12)),
      latitude,
      longitude
    };
  });

  return dailyData;
};


export const fetchAQIHistoricalData = async (days , { location, latitude, longitude }) => {
  try{
  let coordinates;

  if (location) {
    coordinates = await getCoordinatesFromOSM(location);
  } else if(latitude && longitude){
    coordinates = {lat : latitude ,  lon: longitude};
  }
    const { start, end } = getUnixRange(days);

    console.log(`Location: ${location}`);
    console.log(`Latitude: ${coordinates.lat}, Longitude: ${coordinates.lon}`);
    console.log(`Date Range:${days} ${start} to ${end}`);

    const response = await axios.get("https://api.openweathermap.org/data/2.5/air_pollution/history", {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon,
        start,
        end,
        appid: "d79463e5057c72a90084c7fa379fc999"
      }
    });

    console.log("Data fetched successfully");

    // Aggregate the fetched data to daily data
    const dailyData = aggregateToDailyData(response.data.list, coordinates.lat, coordinates.lon);
  
    return dailyData;
  } catch (error) {
    console.error('Error fetching AQI data:' , 'fetch-service');
    throw error;
  }
};

// module.exports = { fetchAQIHistoricalData };
