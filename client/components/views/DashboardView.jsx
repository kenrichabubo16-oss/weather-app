import React from "react";
import { MapPin, Heart, Gauge, Droplets, Wind } from "lucide-react";

export default function DashboardView({
  selectedLocation,
  setSelectedLocation,
  weatherData,
  settings,
  unitParam,
  isFavorite,
  toggleFavorite,
  weatherError,
  favorites,
  isLoggedIn,
}) {
  const convertTemp = (t) => t;

  return (
    <>
      {/* City selector - Show favorites */}
      {isLoggedIn && favorites.length > 0 && (
        <div className="city-selector">
          {favorites.map((loc) => (
            <button
              key={`${loc.lat},${loc.lon}`}
              onClick={() => setSelectedLocation(loc)}
              className={
                selectedLocation.lat === loc.lat &&
                selectedLocation.lon === loc.lon
                  ? "active"
                  : ""
              }
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}

      {isLoggedIn && favorites.length === 0 && (
        <div className="favorites-hint">
          <p>Add locations to your favorites to quick access them here!</p>
        </div>
      )}

      {!isLoggedIn && (
        <div className="favorites-hint">
          <p>Login to save your favorite locations for quick access!</p>
        </div>
      )}

      <div className="dashboard-grid">
        {/* ================= MAIN WEATHER CARD ================= */}
        <div className="weather-main-card">
          <div className="weather-card-header">
            <div>
              <div className="location">
                <MapPin />
                <span>{weatherData.city}</span>
              </div>
              <div className="time">
                Today{" "}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            {isLoggedIn && (
              <button
                onClick={() => toggleFavorite(selectedLocation)}
                className="favorite-btn"
              >
                <Heart
                  size={24}
                  fill={isFavorite(selectedLocation) ? "currentColor" : "none"}
                />
              </button>
            )}
          </div>

          <div className="weather-main-content">
            {/* Temperature */}
            <div className="temperature-display">
              <div className="temp-large">
                {convertTemp(weatherData.current.temp)}°
                <span className="temp-unit">
                  {settings.temperatureUnit === "celsius" ? "C" : "F"}
                </span>
              </div>

              <div className="condition">{weatherData.current.condition}</div>

              <div className="quick-stats">
                <div className="stat">
                  <Gauge size={16} />
                  <span>{weatherData.current.pressure} hPa</span>
                </div>
                <div className="stat">
                  <Droplets size={16} />
                  <span>{weatherData.current.humidity}%</span>
                </div>
                <div className="stat">
                  <Wind size={16} />
                  <span>
                    {weatherData.current.windSpeed}{" "}
                    {unitParam === "metric" ? "m/s" : "mph"}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= TEMP GRAPH ================= */}
            <div className="temperature-chart">
              <div className="chart-title">Temperature</div>

              <svg width="200" height="80" className="temp-graph">
                {weatherData.tempGraph.map((point, idx) => {
                  const x =
                    (idx / (weatherData.tempGraph.length - 1)) * 180 + 10;
                  const y = 70 - (convertTemp(point.temp) / 40) * 50;

                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="3" fill="white" />
                      {idx < weatherData.tempGraph.length - 1 && (
                        <line
                          x1={x}
                          y1={y}
                          x2={
                            ((idx + 1) / (weatherData.tempGraph.length - 1)) *
                              180 +
                            10
                          }
                          y2={
                            70 -
                            (convertTemp(weatherData.tempGraph[idx + 1].temp) /
                              40) *
                              50
                          }
                          stroke="white"
                          strokeWidth="2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="chart-labels">
                {weatherData.tempGraph.map((point, idx) => (
                  <div key={idx} className="chart-label">
                    <div>{point.time}</div>
                    <div className="label-temp">{convertTemp(point.temp)}°</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= DETAILS GRID ================= */}
        <div className="weather-details-grid">
          <div className="detail-card">
            <div className="detail-header">Wind</div>
            <div className="detail-subtitle">Today wind speed</div>
            <div className="detail-content">
              <div className="detail-value">
                {weatherData.current.windSpeed}{" "}
                {unitParam === "metric" ? "m/s" : "mph"}
              </div>
              <div className="detail-note">
                Direction: {weatherData.current.windDirection}
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-header">Rain Chance</div>
            <div className="detail-subtitle">Next forecast</div>
            <div className="detail-content">
              <div className="detail-value">
                {weatherData.current.rainChance}%
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-header">Pressure</div>
            <div className="detail-subtitle">Current pressure</div>
            <div className="detail-content">
              <div className="detail-value">
                {weatherData.current.pressure} hPa
              </div>
            </div>
          </div>
        </div>

        {/* ================= FORECAST ================= */}
        <div className="forecast-card">
          <div className="forecast-header">
            <h3>This Week</h3>
          </div>

          {/* Hourly */}
          <div className="hourly-forecast">
            <div className="forecast-label">Today</div>
            <div className="hourly-grid">
              {weatherData.hourly.map((hour, idx) => (
                <div
                  key={idx}
                  className={`hourly-item ${idx === 0 ? "active" : ""}`}
                >
                  <div className="hourly-time">{hour.time}</div>
                  <div className="hourly-icon">{hour.icon}</div>
                  <div className="hourly-temp">{convertTemp(hour.temp)}°</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily */}
          <div className="daily-forecast">
            {weatherData.daily.map((day, idx) => (
              <div key={idx} className="daily-item">
                <div className="daily-date">
                  <div className="daily-day">{day.day}</div>
                  <div className="daily-date-text">{day.date}</div>
                </div>
                <div className="daily-weather">
                  <span className="daily-icon">{day.icon}</span>
                  <span className="daily-temp">{convertTemp(day.temp)}°</span>
                </div>
              </div>
            ))}
          </div>

          {weatherError && (
            <div style={{ marginTop: 10, opacity: 0.8 }}>
              Note: {weatherError}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
