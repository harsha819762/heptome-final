"use client";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BookingProvider } from "./context/BookingContext";

// Pages
import Home from "./views/Home";
import Services from "./views/Services";
import ServiceDetail from "./views/ServiceDetail";
import Booking from "./views/Booking";
import Profile from "./views/Profile";
import MyBookings from "./views/MyBookings";
import NotFound from "./views/NotFound";

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthModal from "./components/AuthModal";
import CartSidebar from "./components/CartSidebar";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <BookingProvider>
            
            {/* Global Layout */}
            <div className="min-h-screen flex flex-col bg-white">
              
              {/* Hot Toast Notification Engine */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "12px",
                    background: "#1A1A2E",
                    color: "#FFFFFF",
                  },
                  success: {
                    iconTheme: {
                      primary: "#2563EB",
                      secondary: "#FFFFFF",
                    },
                  },
                }}
              />

              {/* Navigation Header */}
              <Navbar />

              {/* Main Routing Container */}
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services/:categoryId" element={<Services />} />
                  <Route path="/service/:serviceId" element={<ServiceDetail />} />
                  <Route 
                    path="/booking" 
                    element={
                      <ProtectedRoute>
                        <Booking />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-bookings" 
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Footer Links and Node Indicator */}
              <Footer />

              {/* Global Drawers / Modals */}
              <AuthModal />
              <CartSidebar />

            </div>

          </BookingProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
