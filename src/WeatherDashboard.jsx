
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'c79cfacc1e59595ef5612a1e99824327';
  const city = 'pune';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setWeatherData(response.data);
      } catch (error) {
        setError('Error fetching weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>{weatherData.name} Weather</h2>
      <p>Temperature: {weatherData.main.temp} K  
      
      </p>
   
      <p>Weather: {weatherData.weather[0].description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default WeatherDashboard;
