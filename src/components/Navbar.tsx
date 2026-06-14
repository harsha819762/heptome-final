"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, MapPin, LogOut } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Image from "next/image";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, mockLogin, logout } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Heptome</span>
            </Link>
            
            <div className="hidden md:flex items-center text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors bg-slate-100 px-3 py-1.5 rounded-full">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span className="font-medium truncate max-w-[150px]">Current Location</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl px-6 hidden lg:block">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all sm:text-sm"
                placeholder="Search for services (e.g. AC Repair, Cleaning)..."
              />
            </div>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-slate-600 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:block">
              <span className="sr-only">Cart</span>
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Image src={user.photoURL || "https://i.pravatar.cc/150"} alt="User" width={32} height={32} unoptimized className="w-8 h-8 rounded-full border border-slate-200" />
                  <span className="hidden sm:inline text-sm font-medium text-slate-900">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="text-slate-500 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors" title="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={mockLogin} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
