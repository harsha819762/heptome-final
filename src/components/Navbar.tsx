"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/context/FirebaseAuthProvider";
import { useCart } from "@/context/CartContext";
import { servicesData } from "@/data/servicesData";
import {
  IoLocationOutline, IoSearchOutline,
  IoCartOutline, IoPersonOutline, IoMenuOutline, IoCloseOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import NotificationCenter from "@/components/NotificationCenter";

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata"];

interface SearchResult {
  id: number;
  name: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  description: string;
  categoryName: string;
  categoryId: number;
}

export default function Navbar() {
  const { user, profile, signOut } = useFirebaseAuth();
  const isAuthenticated = !!user;
  const { cartCount, setCartOpen } = useCart();
  const router = useRouter();

  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [isCityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchFocused(false);
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setCityDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    servicesData.forEach((cat) => {
      cat.services.forEach((srv) => {
        if (srv.name.toLowerCase().includes(query) || srv.description.toLowerCase().includes(query) || cat.category.toLowerCase().includes(query)) {
          results.push({ ...srv, categoryName: cat.category, categoryId: cat.id });
        }
      });
    });
    setSearchResults(results.slice(0, 5));
  }, [searchQuery]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
    toast.success(`Location updated to ${city}`);
  };

  const handleSearchResultClick = (res: SearchResult) => {
    setSearchQuery("");
    setSearchFocused(false);
    router.push(`/service/${res.id}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo + Location */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-black text-sm">H</div>
            <span className="text-lg font-black text-[#1A1A2E]">Heptome</span>
          </Link>

          <div className="relative" ref={cityRef}>
            <button
              onClick={() => setCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              <IoLocationOutline className="text-[#2563EB] text-sm" />
              <span>{selectedCity}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <AnimatePresence>
              {isCityDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  {CITIES.map((city) => (
                    <button key={city} onClick={() => handleCityChange(city)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors ${selectedCity === city ? "text-[#2563EB] bg-blue-50" : "text-gray-700"}`}>{city}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative hidden md:block" ref={searchRef}>
          <div className="relative">
            <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)}
              placeholder="Search for services..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
          </div>
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2">
                {searchResults.map((res) => (
                  <button key={res.id} onClick={() => handleSearchResultClick(res)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{res.name}</p>
                      <p className="text-xs text-gray-400">{res.categoryName}</p>
                    </div>
                    <span className="text-sm font-bold text-[#2563EB]">₹{res.price}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link href="/my-bookings" className="text-sm font-semibold text-gray-600 hover:text-gray-900 hidden lg:block">My Bookings</Link>

          <NotificationCenter />

          <button onClick={() => setCartOpen(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative cursor-pointer">
            <IoCartOutline className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#2563EB] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated && profile ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 pr-3 border border-gray-200 rounded-full hover:shadow-md transition-all cursor-pointer">
                <img src={profile.avatarUrl || user?.photoURL || "https://i.pravatar.cc/150"} alt={profile.name || "User"} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-xs font-bold text-gray-700 hidden sm:inline">{(profile.name || "User").split(" ")[0]}</span>
              </button>
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 hidden group-hover:block">
                <Link href="/profile" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">My Profile</Link>
                <Link href="/my-bookings" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">My Bookings</Link>
                {profile.role === "PROVIDER" && <Link href="/provider" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Provider Portal</Link>}
                {profile.role === "ADMIN" && <Link href="/admin" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Admin Panel</Link>}
                <button onClick={async () => { await signOut(); toast.success("Logged out"); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 cursor-pointer">Logout</button>
              </div>
            </div>
          ) : (
            <Link href="/login"
              className="text-sm font-bold text-white bg-[#2563EB] px-5 py-2 rounded-xl hover:bg-[#1D4ED8] transition-colors cursor-pointer">
              Login
            </Link>
          )}

          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 md:hidden cursor-pointer">
            <IoMenuOutline className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }}
              className="relative w-72 bg-white h-full shadow-2xl z-10 flex flex-col p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-[#1A1A2E]">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"><IoCloseOutline className="text-2xl" /></button>
              </div>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm outline-none" />
              <div className="flex flex-col gap-3">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-[#2563EB] py-2 border-b border-gray-100">Home</Link>
                <Link href="/my-bookings" onClick={() => { setMobileMenuOpen(false); }} className="text-sm font-semibold text-gray-700 hover:text-[#2563EB] py-2 border-b border-gray-100">My Bookings</Link>
                {isAuthenticated && profile ? (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-[#2563EB] py-2 border-b border-gray-100">Profile</Link>
                    {profile.role === "PROVIDER" && <Link href="/provider" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-[#2563EB] py-2 border-b border-gray-100">Provider Portal</Link>}
                    <button onClick={async () => { await signOut(); setMobileMenuOpen(false); }}
                      className="text-left text-sm font-semibold text-red-500 py-2 cursor-pointer">Logout</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center bg-[#2563EB] text-white rounded-xl py-2.5 text-sm font-bold">Login / Sign Up</Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
