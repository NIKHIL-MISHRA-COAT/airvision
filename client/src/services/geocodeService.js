export const geocodeLocation = async (location) => {
  const encodedLocation = encodeURIComponent(location);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`;

  try {
    const response = await fetch(url, {
      headers: {
        // 'User-Agent': 'YourAppName/1.0 (your.email@example.com)', // Add your app info
        'Accept-Language': 'en-US', // Optional
      }
    });
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
        display_name: data[0].display_name,
      };
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};
