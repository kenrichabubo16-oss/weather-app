import React from "react";
import { X } from "lucide-react";

export default function CalendarView({ weatherData, weatherError, onClose }) {
  if (!weatherData) return null;
  const convertTemp = (t) => t;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pop-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pop-modal-header">
          <h3 className="pop-title">Weekly Forecast</h3>
          <button className="pop-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="pop-modal-body">
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
    </div>
  );
}
