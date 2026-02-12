import React, { useState } from "react";
import SearchBox from "./SearchBox";
import LoginPage from "../../auth/LoginPage";
import RegisterPage from "../../auth/RegisterPage";

export default function TopHeader({
  currentUser,
  isLoggedIn,
  onLogin,
  onRegister,
  searchProps,
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleLoginClick = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="top-header">
        <SearchBox {...searchProps} />

        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <span className="user-greeting .fade-in">
                Hello! {currentUser?.name}
              </span>
              <div className="user-avatar">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <button onClick={handleLoginClick} className="btn-auth btn-login">
                Login
              </button>
              <button
                onClick={handleRegisterClick}
                className="btn-auth btn-register"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div
            className="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-header">
              <h2>{authMode === "login" ? "Login" : "Register"}</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="auth-modal-tabs">
              <button
                onClick={() => setAuthMode("login")}
                className={authMode === "login" ? "active" : ""}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={authMode === "register" ? "active" : ""}
              >
                Register
              </button>
            </div>
            {authMode === "login" ? (
              <LoginPage
                onLogin={async (credentials) => {
                  const result = await onLogin(credentials);
                  if (result.ok) handleAuthSuccess();
                  return result;
                }}
              />
            ) : (
              <RegisterPage
                onRegister={async (credentials) => {
                  const result = await onRegister(credentials);
                  if (result.ok) handleAuthSuccess();
                  return result;
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
