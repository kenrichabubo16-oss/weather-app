import React from "react";
import {
  Cloud,
  Menu,
  X,
  LogOut,
  Heart,
  Calendar,
  Settings,
  Map as MapIcon,
} from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentView,
  setCurrentView,
  onOpenSettings,
  onLogout,
  isLoggedIn,
}) {
  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {sidebarOpen ? (
          <>
            <div className="brand">
              <div className="brand-icon">
                <Cloud size={24} />
              </div>
              <span className="Title-logo">MAYWEATHER</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </>
        ) : (
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <button className={currentView === "dashboard" ? "active" : ""} onClick={() => setCurrentView("dashboard")}>
          <MapIcon size={20} />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

        <button className={currentView === "favorites" ? "active" : ""} onClick={() => setCurrentView("favorites")}>
          <Heart size={20} />
          {sidebarOpen && <span>Saved Location</span>}
        </button>

        <button className={currentView === "calendar" ? "active" : ""} onClick={() => setCurrentView("calendar")}>
          <Calendar size={20} />
          {sidebarOpen && <span>Calendar</span>}
        </button>

        <button onClick={onOpenSettings}>
          <Settings size={20} />
          {sidebarOpen && <span>Settings</span>}
        </button>
      </nav>

      {isLoggedIn && (
        <div className="sidebar-footer">
          <button onClick={onLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      )}
    </div>
  );
}
