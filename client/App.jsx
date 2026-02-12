import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/layout/Sidebar";
import TopHeader from "./components/layout/TopHeader";
import SettingsModal from "./components/modals/SettingsModal";

import DashboardView from "./components/views/DashboardView";
import FavoritesView from "./components/views/FavoritesView";
import CalendarView from "./components/views/CalendarView";

import { useSettings } from "./hooks/useSettings";
import { useFavorites } from "./hooks/useFavorites";

import { useWeather } from "./hooks/useWeather";
import { useCitySearch } from "./hooks/useCitySearch";
import useAuth from "./hooks/useAuth";

const OWM_KEY = import.meta.env.VITE_OWM_API_KEY;

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);

  // Default location when user is not logged in or no favorites
  const defaultLocation = {
    key: "default",
    name: "New York",
    country: "US",
    lat: 40.7128,
    lon: -74.006,
  };

  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);

  const { settings, saveSettings, unitParam } = useSettings();
  const {
    favorites,
    loadFavorites,
    toggleFavorite,
    clearFavorites,
    isFavorite,
  } = useFavorites({ OWM_KEY, unitParam });

  const { isLoggedIn, currentUser, login, register, logout } =
    useAuth(loadFavorites);

  const { weatherData, weatherLoading, weatherError } = useWeather({
    isLoggedIn: true,
    selectedLocation,
    unitParam,
    apiKey: OWM_KEY,
  });

  const search = useCitySearch({ apiKey: OWM_KEY, unitParam });

  const selectSearchResult = (place) => {
    setSelectedLocation({
      key: place.key,
      name: place.name,
      country: place.country,
      lat: place.lat,
      lon: place.lon,
    });
    setCurrentView("dashboard");
    search.resetSearch();
  };

  const handleLogout = () => {
    logout();
    clearFavorites();
  };

  // Weather states
  if (weatherLoading && !weatherData)
    return <div style={{ padding: 20 }}>Loading weather...</div>;
  if (weatherError && !weatherData)
    return <div style={{ padding: 20 }}>Error: {weatherError}</div>;
  if (!weatherData) return null;

  return (
    <div className="app-container">
      {showSettings && (
        <SettingsModal
          settings={settings}
          saveSettings={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />

      <div className="main-content">
        <TopHeader
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onLogin={login}
          onRegister={register}
          searchProps={{
            searchQuery: search.searchQuery,
            onSearchChange: search.handleSearch,
            showSearchResults: search.showSearchResults,
            searchResults: search.searchResults,
            onSelectResult: selectSearchResult,
          }}
        />

        {currentView === "dashboard" && (
          <DashboardView
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            weatherData={weatherData}
            settings={settings}
            unitParam={unitParam}
            isFavorite={(loc) => isFavorite(favorites, loc)}
            toggleFavorite={(loc) =>
              toggleFavorite({ currentUser, loc, weatherData })
            }
            weatherError={weatherError}
            favorites={favorites}
            isLoggedIn={isLoggedIn}
          />
        )}

        {currentView === "favorites" && (
          <FavoritesView
            favorites={favorites}
            toggleFavorite={(loc) => toggleFavorite({ currentUser, loc })}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              setCurrentView("dashboard");
            }}
            unitParam={unitParam}
            settings={settings}
          />
        )}

        {currentView === "calendar" && (
          <CalendarView weatherData={weatherData} weatherError={weatherError} onClose={() => setCurrentView("dashboard")} />
        )}
      </div>
    </div>
  );
}
