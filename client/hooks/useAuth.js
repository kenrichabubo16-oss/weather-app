import { useEffect, useState } from "react";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function useAuth(onLoginLoadFavorites, setCurrentView) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api/auth";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
      const user = JSON.parse(raw);
      setCurrentUser(user);
      setIsLoggedIn(true);
      onLoginLoadFavorites?.(user.email);
    }
  }, [onLoginLoadFavorites]);

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await safeJson(response);

      // ✅ Fixed: use 'response' not 'res'
      if (!response.ok) {
        return {
          ok: false,
          message: data?.message || `Login failed (${response.status})`,
        };
      }

      // ✅ Fixed: save data.data.user (based on your backend response)
      const user = data.data.user;
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLoginLoadFavorites?.(user.email);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: "Backend server is not running (connection failed).",
      };
    }
  };

  const register = async ({ name, email, password }) => {
    console.log("Attempting to register user:", { name, email });
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      // ✅ Fixed: use 'response' not 'res'
      const data = await safeJson(response);

      // ✅ Fixed: use 'response' not 'res'
      if (!response.ok) {
        return {
          ok: false,
          message: data?.message || `Register failed (${response.status})`,
        };
      }

      // ✅ Fixed: save data.data.user (based on your backend response)
      const user = data.data.user;
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return { ok: true, user };
    } catch (error) {
      return {
        ok: false,
        message: "Backend server is not running (connection failed).",
      };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setCurrentView("dashboard");
  };

  return { isLoggedIn, currentUser, login, register, logout };
}
