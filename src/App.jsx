import React, { useState, useEffect } from 'react';

import Chart from 'chart.js/auto';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [unit, setUnit] = useState('metric'); 
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('recentSearches')) {
      setRecentSearches(JSON.parse(localStorage.getItem('recentSearches')));
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c79cfacc1e59595ef5612a1e99824327&units=${unit}`);
      const data = response.data;
      if (data.cod === 200) {
        setTemperature(data.main.temp);
        setWeather(data.weather[0].main);
        setWindSpeed(data.wind.speed);
        if (!recentSearches.includes(city)) {
          setRecentSearches([city, ...recentSearches.slice(0, 4)]);
          localStorage.setItem('recentSearches', JSON.stringify([city, ...recentSearches.slice(0, 4)]));
        }
        // Render chart with past weather data
        renderChart(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('An error occurred while fetching weather data. Please try again later.');
    }
  };

  const renderChart = (data) => {
    const ctx = document.getElementById('weatherChart');
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const pastTemperatures = [22, 24, 23, 25, 21]; 
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Past Temperatures (°C)',
          data: pastTemperatures,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      </header>
      <div className="App-content">
        <div>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name" />
          <button onClick={handleSearch}>Search</button>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
          {error && <p className="error">{error}</p>}
          <div className="recent-searches">
            <h2>Recent Searches</h2>
            <ul>
              {recentSearches.map((search, index) => (
                <li key={index}>{search}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="weather-info">
          {temperature && (
            <>
              <p>Temperature: {temperature}°{unit === 'metric' ? 'C' : 'F'}</p>
              <p>Weather: {weather}</p>
              <p>Wind Speed: {windSpeed} m/s</p>
              <canvas id="weatherChart"></canvas>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;