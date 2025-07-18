import React, { useEffect, useState } from 'react';

interface WeatherInfoProps {
  className?: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ className }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        // Get client IP from your backend
        const ipRes = await fetch(`${import.meta.env.REACT_APP_API_URL}/client-ip`);
        const { ip } = await ipRes.json();
        console.log('ip', ip);
        
        // Handle localhost/loopback IPs
        if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
          // Fallback to external IP service for localhost testing
          const externalIpRes = await fetch('https://ipapi.co/json/');
          const locationData = await externalIpRes.json();
          
          if (locationData.error) {
            throw new Error('Unable to get location from external service');
          }

          const { latitude, longitude, city: ipCity } = locationData;
          setCity(ipCity || 'Unknown');

          // Get weather using coordinates
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const weatherData = await weatherRes.json();
          
          setWeather(
            weatherData.current_weather
              ? `${weatherData.current_weather.temperature}°C`
              : 'N/A'
          );
        } else {
          // Use the IP to get location (normal case)
          const locationRes = await fetch(`https://ipapi.co/${ip}/json/`);
          const locationData = await locationRes.json();
          
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
          
          setWeather(
            weatherData.current_weather
              ? `${weatherData.current_weather.temperature}°C`
              : 'N/A'
          );
        }
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