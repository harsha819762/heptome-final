"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-xs hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/terms" className="text-xs hover:text-white transition-colors">Terms & conditions</Link></li>
              <li><Link href="/privacy" className="text-xs hover:text-white transition-colors">Privacy policy</Link></li>
              <li><Link href="/contact" className="text-xs hover:text-white transition-colors">Contact us</Link></li>
            </ul>
          </div>

          {/* For customers */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">For customers</h3>
            <ul className="space-y-2.5">
              <li><Link href="/my-bookings" className="text-xs hover:text-white transition-colors">My bookings</Link></li>
              <li><Link href="/services/1" className="text-xs hover:text-white transition-colors">Categories near you</Link></li>
              <li><Link href="/reviews" className="text-xs hover:text-white transition-colors">Customer reviews</Link></li>
            </ul>
          </div>

          {/* For professionals */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">For professionals</h3>
            <ul className="space-y-2.5">
              <li><Link href="/provider" className="text-xs hover:text-white transition-colors">Register as a professional</Link></li>
              <li><Link href="/provider" className="text-xs hover:text-white transition-colors">Provider dashboard</Link></li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Download app</h3>
            <div className="space-y-2.5">
              <a href="#" className="flex items-center gap-2 text-xs hover:text-white transition-colors bg-gray-800 rounded-lg px-4 py-2.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                <span>Download on the App Store</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-xs hover:text-white transition-colors bg-gray-800 rounded-lg px-4 py-2.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                <span>Get it on Google Play</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-black text-xs">H</div>
            <span className="text-sm font-bold text-white">Heptome</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Heptome. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
