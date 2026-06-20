"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin, IoServerOutline } from "react-icons/io5";

export default function Footer() {
  const [nodeId, setNodeId] = useState(null);

  useEffect(() => {
    fetch("/api/node-info")
      .then((res) => res.json())
      .then((data) => setNodeId(data.nodeId))
      .catch(() => setNodeId("Local Dev Server"));
  }, []);

  return (
    <footer className="bg-[#1A1A2E] text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-black text-sm">
                H
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Hept<span className="text-[#2563EB]">ome</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Heptome is your one-stop solution for all professional home services. We provide background-verified, expert service professionals for waxing, haircut, massage, cleaning, plumbing, AC repair, and electrical work.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-slate-800 hover:bg-[#2563EB] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                <IoLogoFacebook />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-[#2563EB] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                <IoLogoTwitter />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-[#2563EB] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                <IoLogoInstagram />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-[#2563EB] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                <IoLogoLinkedin />
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Services</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/services/1" className="hover:text-white transition-colors">Women's Salon & Spa</Link></li>
              <li><Link to="/services/2" className="hover:text-white transition-colors">Men's Salon & Massage</Link></li>
              <li><Link to="/services/3" className="hover:text-white transition-colors">AC Repair & Service</Link></li>
              <li><Link to="/services/4" className="hover:text-white transition-colors">Cleaning & Pest Control</Link></li>
              <li><Link to="/services/5" className="hover:text-white transition-colors">Electrician Services</Link></li>
              <li><Link to="/services/6" className="hover:text-white transition-colors">Plumber Services</Link></li>
            </ul>
          </div>

          {/* Col 3: Cities */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Cities Served</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><span className="text-slate-400">Mumbai (HQ)</span></li>
              <li><span className="text-slate-400">Delhi NCR</span></li>
              <li><span className="text-slate-400">Bangalore</span></li>
              <li><span className="text-slate-400">Hyderabad</span></li>
              <li><span className="text-slate-400">Pune</span></li>
              <li><span className="text-slate-400">Chennai & Kolkata</span></li>
            </ul>
          </div>

          {/* Col 4: Help */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Help & Support</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Be a Partner</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <p>&copy; {new Date().getFullYear()} Heptome Technologies Private Limited. All rights reserved.</p>
            {nodeId && (
              <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono text-[9px]">
                <IoServerOutline className="text-blue-400" />
                {nodeId}
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
