import React, { useEffect, useState } from 'react';

interface WeatherInfoProps {
  className?: string;
}

const CACHE_KEY = "location_weather_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

const WeatherInfo: React.FC<WeatherInfoProps> = ({ className }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        // Try to get cached data
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { city, weather, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCity(city);
            setWeather(weather);
            return;
          }
        }

        // Get client IP from your backend
        const ipRes = await fetch(`${import.meta.env.REACT_APP_API_URL}/client-ip`);
        const { ip } = await ipRes.json();

        let locationData: any;
        if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
          // Fallback to external IP service for localhost testing
          const externalIpRes = await fetch('https://ipapi.co/json/');
          locationData = await externalIpRes.json();
        } else {
          // Use the IP to get location (normal case)
          const locationRes = await fetch(`https://ipapi.co/${ip}/json/`);
          locationData = await locationRes.json();
        }

        if (locationData.error) {
          throw new Error('Unable to get location from IP');
        }

        const { latitude, longitude, city: ipCity } = locationData;
        setCity(ipCity || 'Unknown');

        // Get weather using coordinates
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        const weatherStr = weatherData.current_weather
          ? `${weatherData.current_weather.temperature}°C`
          : 'N/A';
        setWeather(weatherStr);

        // Cache the result
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            city: ipCity || 'Unknown',
            weather: weatherStr,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.error('Location error:', err);
        setError('Unable to retrieve location and weather');
      }
    };

    getLocationAndWeather();
  }, []);

  if (error) return <div>{error}</div>;
  return (
    <span className={className} style={{ marginLeft: 8 }}>
      {city}, {weather}
    </span>
  );
};

export default WeatherInfo;