import React from "react";
import { X, Thermometer, Moon, Bell } from "lucide-react";

export default function SettingsModal({ settings, saveSettings, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-info">
              <Thermometer size={20} />
              <div>
                <h3>Temperature Unit</h3>
                <p>Choose your preferred temperature unit</p>
              </div>
            </div>
            <select
              value={settings.temperatureUnit}
              onChange={(e) => saveSettings({ ...settings, temperatureUnit: e.target.value })}
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Moon size={20} />
              <div>
                <h3>Theme</h3>
                <p>Choose light or dark mode</p>
              </div>
            </div>
            <select value={settings.theme} onChange={(e) => saveSettings({ ...settings, theme: e.target.value })}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
