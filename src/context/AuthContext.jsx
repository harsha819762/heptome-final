"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("uc_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (phone, otp) => {
    return new Promise((resolve, reject) => {
      if (otp === "1234") {
        const mockUser = {
          name: "Harsha Vardhan",
          phone: phone,
          email: "harsha@example.com",
          avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        setLoginModalOpen(false);
        localStorage.setItem("uc_user", JSON.stringify(mockUser));
        resolve(mockUser);
      } else {
        reject(new Error("Invalid OTP"));
      }
    });
  };

  const signup = (name, phone) => {
    return new Promise((resolve) => {
      const mockUser = {
        name: name,
        phone: phone,
        email: name.toLowerCase().replace(/\s+/g, '') + "@example.com",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      setLoginModalOpen(false);
      localStorage.setItem("uc_user", JSON.stringify(mockUser));
      resolve(mockUser);
    });
  };

  const logout = () => {
    return new Promise((resolve) => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("uc_user");
      resolve();
    });
  };

  const updateUserProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("uc_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        isLoginModalOpen,
        setLoginModalOpen,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
