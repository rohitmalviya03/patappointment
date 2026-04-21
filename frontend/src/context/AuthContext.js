import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

// Helper function to validate token with server
const validateToken = async (token, authType) => {
  try {
    let endpoint = "";
    if (authType === "mobile") {
      endpoint = `${API_BASE_URL}/bookings/my-bookings`;
    } else if (authType === "lab") {
      endpoint = `${API_BASE_URL}/bookings/all`;
    } else {
      endpoint = `${API_BASE_URL}/appointments`;
    }

    await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authType, setAuthType] = useState(null); // 'email' or 'mobile'

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        const savedPhone = localStorage.getItem("phone");
        const savedAuthType = localStorage.getItem("authType");

        if (savedToken) {
          // Check if token is expired locally
          if (isTokenExpired(savedToken)) {
            console.log("Token expired, logging out");
            logout();
            setLoading(false);
            return;
          }

          // Validate token with server
          const isValid = await validateToken(savedToken, savedAuthType);
          if (!isValid) {
            console.log("Token invalid, logging out");
            logout();
            setLoading(false);
            return;
          }

          // Token is valid, restore authentication state
          if (savedAuthType === "mobile" && savedPhone) {
            setToken(savedToken);
            setPhone(savedPhone);
            setAuthType(savedAuthType);
          } else if (savedAuthType === "lab" && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setAuthType(savedAuthType);
          } else if (savedAuthType === "email" && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setAuthType(savedAuthType);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Email-based login (old method)
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    setAuthType("email");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("authType", "email");
  };

  // Mobile-based login (new method)
  const loginWithPhone = (token, phoneNumber) => {
    setToken(token);
    setPhone(phoneNumber);
    setAuthType("mobile");
    localStorage.setItem("token", token);
    localStorage.setItem("phone", phoneNumber);
    localStorage.setItem("authType", "mobile");
  };

  // Lab login
  const loginLab = (token, lab) => {
    setToken(token);
    setUser(lab);
    setAuthType("lab");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(lab));
    localStorage.setItem("authType", "lab");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPhone(null);
    setAuthType(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("phone");
    localStorage.removeItem("authType");
  };

  const isAuthenticated = !!token && !isTokenExpired(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        phone,
        token,
        loading,
        login,
        loginWithPhone,
        loginLab,
        logout,
        isAuthenticated,
        authType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
