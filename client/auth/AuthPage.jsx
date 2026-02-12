import React, { useState } from "react";
import { Cloud } from "lucide-react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

export default function AuthPage({ onLogin, onRegister }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-circle">
            <Cloud size={32} />
          </div>
          <h1>RONWEATHER</h1>
          <p>Weather at your fingertips</p>
        </div>

        <div className="auth-tabs">
          <button
            onClick={() => setShowLogin(true)}
            className={showLogin ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={!showLogin ? "active" : ""}
          >
            Register
          </button>
        </div>

        {showLogin ? (
          <LoginPage onLogin={onLogin} />
        ) : (
          <RegisterPage onRegister={onRegister} />
        )}
      </div>
    </div>
  );
}
