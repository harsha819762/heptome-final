"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { servicesData } from "../data/servicesData";
import { 
  IoLocationOutline, IoSearchOutline, IoNotificationsOutline, 
  IoCartOutline, IoPersonOutline, IoMenuOutline, IoCloseOutline 
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata"];

export default function Navbar() {
  const { user, setLoginModalOpen, logout } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [isCityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchRef = useRef(null);
  const cityRef = useRef(null);

  // Close search results dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle live search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = [];
    servicesData.forEach((cat) => {
      cat.services.forEach((srv) => {
        if (
          srv.name.toLowerCase().includes(query) ||
          srv.description.toLowerCase().includes(query) ||
          cat.category.toLowerCase().includes(query)
        ) {
          results.push({
            ...srv,
            categoryName: cat.category,
            categoryId: cat.id,
          });
        }
      });
    });
    setSearchResults(results.slice(0, 5));
  }, [searchQuery]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
    toast.success(`Location updated to ${city}`, {
      icon: "ℹ️",
      style: {
        border: '1px solid #3B82F6',
        padding: '12px',
        color: '#1E3A8A',
        background: '#EFF6FF',
      }
    });
  };

  const handleSearchResultClick = (res) => {
    setSearchQuery("");
    setSearchFocused(false);
    navigate(`/service/${res.id}`);
  };

  const handleMyBookingsClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/my-bookings");
      setMobileMenuOpen(false);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
      setMobileMenuOpen(false);
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2" to="/">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-black text-sm">
              H
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#1A1A2E] tracking-tight">
              Hept<span className="text-[#2563EB]">ome</span>
            </span>
          </Link>

          {/* City Selector */}
          <div className="relative" ref={cityRef}>
            <button
              onClick={() => setCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#2563EB] bg-slate-50 px-2.5 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              <IoLocationOutline className="text-[#2563EB] text-base" />
              <span>{selectedCity}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            <AnimatePresence>
              {isCityDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityChange(city)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${
                        selectedCity === city ? "text-[#2563EB] bg-blue-50/40" : "text-[#1A1A2E]"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-md mx-6 relative hidden md:block" ref={searchRef}>
          <div className="relative">
            <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search for services (e.g. Salon, AC Repair)..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium text-[#1A1A2E] placeholder-slate-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
            />
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto overflow-x-hidden p-2"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                  Suggested Services
                </div>
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSearchResultClick(res)}
                    className="w-full flex items-center justify-between text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A2E] group-hover:text-[#2563EB] transition-colors">
                        {res.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{res.categoryName}</p>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB]">₹{res.price}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Menu Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/my-bookings"
            onClick={handleMyBookingsClick}
            className="text-sm font-semibold text-slate-600 hover:text-[#1A1A2E] hidden lg:block"
          >
            My Bookings
          </a>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) toast.success("Checking notifications...");
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#1A1A2E] transition-colors relative"
            >
              <IoNotificationsOutline className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4"
                >
                  <h4 className="font-bold text-xs text-[#1A1A2E] mb-2 border-b pb-2">Notifications</h4>
                  <div className="space-y-3">
                    <div className="text-[11px] leading-snug">
                      <p className="font-semibold text-slate-700">🎉 Booking Confirmed</p>
                      <p className="text-slate-400 mt-0.5">Your home deep cleaning booking is confirmed!</p>
                    </div>
                    <div className="text-[11px] leading-snug">
                      <p className="font-semibold text-slate-700">🏷️ 20% Discount Code</p>
                      <p className="text-slate-400 mt-0.5">Use coupon <strong>FIRST20</strong> on checkouts.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon */}
          <button
            onClick={() => setCartOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#1A1A2E] transition-colors relative"
          >
            <IoCartOutline className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#2563EB] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Login / Profile */}
          {user ? (
            <div className="relative group">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 p-1 pl-1 pr-3 border border-slate-200 rounded-full hover:shadow-md transition-all duration-300"
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-slate-700 hidden sm:inline-block">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {/* Hover Dropdown */}
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-1.5 hidden group-hover:block hover:block">
                <Link to="/profile" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  My Profile
                </Link>
                <a href="/my-bookings" onClick={handleMyBookingsClick} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  My Bookings
                </a>
                <button
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
            >
              <IoPersonOutline className="text-sm" />
              <span>Login</span>
            </button>
          )}

          {/* Hamburger Drawer button for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#1A1A2E] md:hidden transition-colors"
          >
            <IoMenuOutline className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-72 bg-white h-full shadow-2xl z-10 flex flex-col p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-[#1A1A2E]">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100"
                >
                  <IoCloseOutline className="text-2xl" />
                </button>
              </div>

              {/* Mobile Search input */}
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold text-[#1A1A2E] outline-none"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-[#2563EB] py-2 border-b border-slate-100"
                >
                  Home
                </Link>
                <a
                  href="/my-bookings"
                  onClick={handleMyBookingsClick}
                  className="text-sm font-semibold text-slate-700 hover:text-[#2563EB] py-2 border-b border-slate-100"
                >
                  My Bookings
                </a>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-slate-700 hover:text-[#2563EB] py-2 border-b border-slate-100"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        toast.success("Logged out successfully");
                      }}
                      className="text-left text-sm font-semibold text-red-500 py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="btn-primary text-center py-2.5 mt-2"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
