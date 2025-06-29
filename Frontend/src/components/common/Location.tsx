import React, { useEffect, useState } from 'react';

interface WeatherInfoProps {
  className?: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ className }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // Get city name using Nominatim
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const geoData = await geoRes.json();
      setCity(geoData.address.city || geoData.address.town || geoData.address.village || 'Unknown');

      // Get weather using Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      setWeather(
        weatherData.current_weather
          ? `${weatherData.current_weather.temperature}°C`
          : 'N/A'
      );
    }, () => setError('Unable to retrieve location'));
  }, []);

  if (error) return <div>{error}</div>;
  return (
    <span className={className} style={{ marginLeft: 8 }}>
      {city}, {weather}
    </span>
  );
};

export default WeatherInfo;