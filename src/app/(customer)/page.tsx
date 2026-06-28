"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { servicesData, professionalsData } from "@/data/servicesData";
import { motion } from "framer-motion";
import { IoStar, IoTimeOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

const CATEGORIES = [
  { id: 1, name: "Women's Salon & Spa", icon: "💇‍♀️", time: "", href: "/services/1", bg: "bg-pink-50" },
  { id: 2, name: "Men's Salon & Massage", icon: "💆‍♂️", time: "44 mins", href: "/services/1", bg: "bg-blue-50" },
  { id: 3, name: "Cleaning & Pest Control", icon: "🧹", time: "", href: "/services/3", bg: "bg-green-50" },
  { id: 4, name: "Painting & Waterproofing", icon: "🎨", time: "", href: "/services/3", bg: "bg-purple-50" },
  { id: 5, name: "AC & Appliance Repair", icon: "❄️", time: "29 mins", href: "/services/4", bg: "bg-cyan-50" },
  { id: 6, name: "Electrician, Plumber & Carpenter", icon: "🔧", time: "", href: "/services/5", bg: "bg-amber-50" },
];

const REVIEWS = [
  { id: 1, name: "Suresh Pillai", rating: 5, date: "June 18, 2026", service: "AC Service & Cleaning", text: "Outstanding service! The professional arrived on time and cleaned the AC thoroughly. Highly recommended!" },
  { id: 2, name: "Ananya Deshmukh", rating: 5, date: "June 15, 2026", service: "Full Body Massage", text: "The massage therapist was extremely skilled and polite. Very relaxing experience!" },
  { id: 3, name: "Karan Johar", rating: 4, date: "June 10, 2026", service: "Home Deep Cleaning", text: "Cleaners did a great job. Every corner of the house was spotless." },
];

export default function HomePage() {
  const router = useRouter();

  const mostBooked = servicesData
    .flatMap((cat) => cat.services.map((s) => ({ ...s, catId: cat.id })))
    .filter((s) => s.rating >= 4.7)
    .slice(0, 8);

  return (
    <div className="space-y-10 pb-16">
      {/* HERO + CATEGORIES */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white rounded-3xl p-6 sm:p-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1A1A2E] tracking-tight">
            Home services at <br className="sm:hidden" />
            <span className="text-[#2563EB]">your doorstep</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Book high-rated professionals for salon, massage, cleaning, AC repairs, plumbing & more.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(cat.href)}
              className={`${cat.bg} border border-gray-100 rounded-2xl p-4 sm:p-5 text-center hover:shadow-lg transition-all cursor-pointer relative`}
            >
              <div className="text-3xl sm:text-4xl mb-2">{cat.icon}</div>
              <p className="text-[11px] sm:text-xs font-bold text-gray-800 leading-tight">{cat.name}</p>
              {cat.time && (
                <span className="inline-block mt-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {cat.time}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* STATS BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          { val: "4.8", label: "Service Rating", icon: "⭐" },
          { val: "12M+", label: "Customers Globally", icon: "👥" },
          { val: "30K+", label: "Verified Partners", icon: "✅" },
          { val: "100+", label: "Cities Served", icon: "📍" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">{stat.val}</p>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* MOST BOOKED SERVICES */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E]">Most booked services</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Highly-requested options this week</p>
          </div>
          <Link href="/services/1" className="text-xs font-bold text-[#2563EB] hover:underline shrink-0">See all</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-none">
          {mostBooked.map((srv) => (
            <motion.div
              key={srv.id}
              whileHover={{ y: -3 }}
              onClick={() => router.push(`/service/${srv.id}`)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all snap-start shrink-0 w-[200px] sm:w-[220px] cursor-pointer"
            >
              <div className="relative h-32 sm:h-36 overflow-hidden">
                <img src={srv.image} alt={srv.name} className="w-full h-full object-cover" />
                {srv.rating >= 4.8 && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Popular</span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-bold text-[#1A1A2E] leading-tight line-clamp-1">{srv.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-[#F59E0B] gap-0.5">
                    <IoStar className="text-[10px]" />
                    <span className="text-[10px] font-bold text-gray-700">{srv.rating}</span>
                  </div>
                  <span className="text-[9px] text-gray-400">{srv.duration}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-sm text-[#1A1A2E]">₹{srv.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLEANING ESSENTIALS */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E]">Cleaning essentials</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Monthly cleaning essential services</p>
          </div>
          <Link href="/services/3" className="text-xs font-bold text-[#2563EB] hover:underline shrink-0">See all</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {servicesData[2]?.services.slice(0, 5).map((srv) => (
            <motion.div key={srv.id} whileHover={{ y: -3 }}
              onClick={() => router.push(`/service/${srv.id}`)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all snap-start shrink-0 w-[180px] sm:w-[200px] cursor-pointer">
              <img src={srv.image} alt={srv.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <h3 className="text-xs font-bold text-[#1A1A2E] line-clamp-1">{srv.name}</h3>
                <div className="flex items-center text-[#F59E0B] gap-0.5 mt-1">
                  <IoStar className="text-[9px]" /><span className="text-[10px] font-bold text-gray-700">{srv.rating}</span>
                </div>
                <p className="font-bold text-sm text-[#1A1A2E] mt-1">₹{srv.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* APPLIANCE REPAIR */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E]">Appliance repair & service</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Expert repairs for your home appliances</p>
          </div>
          <Link href="/services/4" className="text-xs font-bold text-[#2563EB] hover:underline shrink-0">See all</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {servicesData[3]?.services.slice(0, 6).map((srv) => (
            <motion.div key={srv.id} whileHover={{ y: -3 }}
              onClick={() => router.push(`/service/${srv.id}`)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all snap-start shrink-0 w-[180px] sm:w-[200px] cursor-pointer">
              <img src={srv.image} alt={srv.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <h3 className="text-xs font-bold text-[#1A1A2E] line-clamp-1">{srv.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-[#F59E0B] gap-0.5">
                    <IoStar className="text-[9px]" /><span className="text-[10px] font-bold text-gray-700">{srv.rating}</span>
                  </div>
                </div>
                <p className="font-bold text-sm text-[#1A1A2E] mt-1">₹{srv.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOME REPAIR */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E]">Home repair & installation</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Electricians, plumbers & carpenters</p>
          </div>
          <Link href="/services/5" className="text-xs font-bold text-[#2563EB] hover:underline shrink-0">See all</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {servicesData[4]?.services.slice(0, 6).map((srv) => (
            <motion.div key={srv.id} whileHover={{ y: -3 }}
              onClick={() => router.push(`/service/${srv.id}`)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all snap-start shrink-0 w-[180px] sm:w-[200px] cursor-pointer">
              <img src={srv.image} alt={srv.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <h3 className="text-xs font-bold text-[#1A1A2E] line-clamp-1">{srv.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-[#F59E0B] gap-0.5">
                    <IoStar className="text-[9px]" /><span className="text-[10px] font-bold text-gray-700">{srv.rating}</span>
                  </div>
                  <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">Instant</span>
                </div>
                <p className="font-bold text-sm text-[#1A1A2E] mt-1">₹{srv.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E] mb-5">Customer reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A2E]">{rev.name}</h4>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
                <div className="flex text-[#F59E0B] gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => <IoStar key={i} className="text-xs" />)}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
              <div className="border-t border-gray-100 pt-2 mt-3 flex items-center justify-between text-[10px] font-bold text-gray-400">
                <span>{rev.service}</span>
                <span className="text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BECOME A PARTNER CTA */}
      <section className="bg-gradient-to-r from-[#2563EB] to-blue-700 rounded-3xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Join us as a service partner</h2>
        <p className="text-sm sm:text-base text-blue-100 mt-2 max-w-md mx-auto">Register your services and start earning. Set your own schedule.</p>
        <Link href="/provider" className="inline-block mt-6 bg-white text-[#2563EB] font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          Register as a professional
        </Link>
      </section>
    </div>
  );
}
