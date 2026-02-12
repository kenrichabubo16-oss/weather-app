import { useState } from "react";

export function useCitySearch({ apiKey, unitParam }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (!apiKey) {
      setSearchResults([]);
      setShowSearchResults(true);
      return;
    }

    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${apiKey}`;

      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) throw new Error("Geocoding failed");
      const places = await geoRes.json();

      const enriched = await Promise.all(
        places.map(async (p) => {
          const wUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${p.lat}&lon=${p.lon}&units=${unitParam}&appid=${apiKey}`;
          const wRes = await fetch(wUrl);
          const w = wRes.ok ? await wRes.json() : null;

          return {
            key: `${p.lat},${p.lon}`,
            name: p.name,
            country: p.country,
            state: p.state,
            lat: p.lat,
            lon: p.lon,
            temp: w ? Math.round(w.main?.temp ?? 0) : null,
          };
        })
      );

      setSearchResults(enriched);
      setShowSearchResults(true);
    } catch {
      setSearchResults([]);
      setShowSearchResults(true);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return {
    searchQuery,
    searchResults,
    showSearchResults,
    handleSearch,
    setShowSearchResults,
    resetSearch,
  };
}
