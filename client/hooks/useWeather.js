import { useEffect, useState } from "react";
import {
  buildDailyFromForecastList,
  buildTempGraphFromForecastList,
  degToCompass,
  formatHour,
  weatherToEmoji,
} from "../utils/weatherUtils";

export function useWeather({ isLoggedIn, selectedLocation, unitParam, apiKey }) {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    if (!apiKey) {
      setWeatherError("Missing API key. Add VITE_OWM_API_KEY in your .env file.");
      return;
    }

    const controller = new AbortController();

    async function loadWeather() {
      try {
        setWeatherLoading(true);
        setWeatherError("");

        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&units=${unitParam}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&units=${unitParam}&appid=${apiKey}`;

        const [cRes, fRes] = await Promise.all([
          fetch(currentUrl, { signal: controller.signal }),
          fetch(forecastUrl, { signal: controller.signal }),
        ]);

        if (!cRes.ok) {
          const text = await cRes.text();
          console.log("Current weather failed:", cRes.status, text);
          throw new Error(`Failed to load current weather (${cRes.status})`);
        }
        if (!fRes.ok) throw new Error("Failed to load forecast");

        const currentJson = await cRes.json();
        const forecastJson = await fRes.json();

        const tzOffsetSec = forecastJson.city?.timezone ?? 0;

        const hourly = (forecastJson.list || []).slice(0, 6).map((h, idx) => {
          const w = h.weather?.[0] || {};
          return {
            time: idx === 0 ? "Now" : formatHour(h.dt, tzOffsetSec),
            temp: Math.round(h.main?.temp ?? 0),
            icon: weatherToEmoji(w.main, w.id),
          };
        });

        const dailyAll = buildDailyFromForecastList(forecastJson.list || [], tzOffsetSec);
        const daily = dailyAll.slice(1, 8);
        const tempGraph = buildTempGraphFromForecastList(forecastJson.list || [], tzOffsetSec);

        const cw = currentJson.weather?.[0] || {};
        const rainChance = Math.round(((forecastJson.list?.[0]?.pop ?? 0) * 100));

        const normalized = {
          city: currentJson.name || selectedLocation.name,
          country: currentJson.sys?.country || selectedLocation.country,
          coordinates: {
            lat: currentJson.coord?.lat ?? selectedLocation.lat,
            lng: currentJson.coord?.lon ?? selectedLocation.lon,
          },
          current: {
            temp: Math.round(currentJson.main?.temp ?? 0),
            condition: cw.description || cw.main || "—",
            humidity: currentJson.main?.humidity ?? 0,
            pressure: currentJson.main?.pressure ?? 0,
            windSpeed: Math.round(currentJson.wind?.speed ?? 0),
            windDirection: degToCompass(currentJson.wind?.deg ?? 0),
            rainChance,
            feelsLike: Math.round(currentJson.main?.feels_like ?? 0),
            visibility: Math.round((currentJson.visibility ?? 0) / 1000),
          },
          hourly,
          daily,
          tempGraph,
          tzOffsetSec,
        };

        setWeatherData(normalized);
      } catch (err) {
        if (err.name !== "AbortError") setWeatherError(err.message || "Error loading weather");
      } finally {
        setWeatherLoading(false);
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [isLoggedIn, selectedLocation, unitParam, apiKey]);

  return { weatherData, weatherLoading, weatherError };
}
