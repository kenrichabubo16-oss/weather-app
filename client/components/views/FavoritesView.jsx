import React from "react";
import { Heart, X, Droplets, Wind } from "lucide-react";
import { useFavoritesWeather } from "../../hooks/useFavoritesWeather";

const OWM_KEY = import.meta.env.VITE_OWM_API_KEY;

export default function FavoritesView({
  favorites,
  onSelectLocation,
  toggleFavorite,
  settings,
  unitParam,
}) {
  const { favoritesWeather, loading } = useFavoritesWeather({
    favorites,
    unitParam,
    apiKey: OWM_KEY,
  });

  const convertTemp = (t) => t;

  return (
    <div className="view-container">
      <h2 className="view-title">Saved Locations</h2>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={64} />
          <h3>No Saved Locations</h3>
          <p>Start adding your favorite cities to quick access</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((loc) => {
            const key = `${loc.lat},${loc.lon}`;
            const weather = favoritesWeather[key];
            
            return (
              <div
                key={key}
                className="favorite-card"
                onClick={() => onSelectLocation(loc)}
              >
                <div className="favorite-header">
                  <span className="favorite-name">
                    {loc.name}, {loc.country}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(loc);
                    }}
                    className="remove-favorite"
                  >
                    <X size={16} />
                  </button>
                </div>

                {loading && !weather ? (
                  <div className="favorite-loading">Loading...</div>
                ) : weather ? (
                  <>
                    <div className="favorite-temp">
                      {convertTemp(weather.temp)}°
                      <span className="temp-unit">
                        {settings.temperatureUnit === "celsius" ? "C" : "F"}
                      </span>
                    </div>
                    <div className="favorite-condition">{weather.condition}</div>
                    <div className="favorite-stats">
                      <span>
                        <Droplets size={14} />{" "}
                        <span>{weather.humidity}%</span>
                      </span>
                      <span>
                        <Wind size={14} />{" "}
                        <span>
                          {weather.windSpeed}{" "}
                          {unitParam === "metric" ? "m/s" : "mph"}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="favorite-error">Loading...</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
