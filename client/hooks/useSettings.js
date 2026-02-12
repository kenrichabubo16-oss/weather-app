import { useEffect, useMemo, useState } from "react";

export function useSettings() {
  const [settings, setSettings] = useState({
    temperatureUnit: "celsius",
    theme: "light",
    notifications: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  // Apply theme changes to document body
  useEffect(() => {
    if (settings.theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [settings.theme]);

  const saveSettings = (newSettings) => {
    try {
      localStorage.setItem("appSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
      console.log("Settings saved:", newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const unitParam = useMemo(
    () => (settings.temperatureUnit === "fahrenheit" ? "imperial" : "metric"),
    [settings.temperatureUnit]
  );

  return { settings, saveSettings, unitParam };
}