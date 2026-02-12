import { useEffect, useState } from "react";

export function useFavoritesWeather({ favorites, unitParam, apiKey }) {
  const [favoritesWeather, setFavoritesWeather] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiKey || !favorites || favorites.length === 0) {
      setFavoritesWeather({});
      return;
    }

    const controller = new AbortController();

    async function loadFavoritesWeather() {
      try {
        setLoading(true);
        
        const weatherPromises = favorites.map(async (loc) => {
          try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=${unitParam}&appid=${apiKey}`;
            const response = await fetch(url, { signal: controller.signal });
            
            if (!response.ok) return null;
            
            const data = await response.json();
            const weather = data.weather?.[0] || {};
            
            return {
              key: `${loc.lat},${loc.lon}`,
              temp: Math.round(data.main?.temp ?? 0),
              condition: weather.description || weather.main || "—",
              humidity: data.main?.humidity ?? 0,
              windSpeed: Math.round(data.wind?.speed ?? 0),
            };
          } catch (err) {
            return null;
          }
        });

        const results = await Promise.all(weatherPromises);
        
        const weatherMap = {};
        results.forEach((result, index) => {
          if (result) {
            weatherMap[result.key] = result;
          }
        });
        
        setFavoritesWeather(weatherMap);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error loading favorites weather:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadFavoritesWeather();
    return () => controller.abort();
  }, [favorites, unitParam, apiKey]);

  return { favoritesWeather, loading };
}
