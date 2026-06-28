"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useBookingStore } from "@/store/useBookingStore";
import { useSupabaseAuth } from "@/context/SupabaseAuthProvider";
import { servicesData, professionalsData } from "@/data/servicesData";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoStar, IoCalendarOutline, IoTimeOutline, IoShieldCheckmarkOutline, 
  IoSparklesOutline, IoChevronForwardOutline 
} from "react-icons/io5";
import { toast } from "react-hot-toast";

// Helper to generate next 7 days
const getNext7Days = () => {
  const days = [];
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: d.toISOString().split("T")[0],
      dayName: weekdayNames[d.getDay()],
      dayNum: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
    });
  }
  return days;
};

const TIME_SLOTS = [
  { time: "09:00 AM", period: "Morning" },
  { time: "11:00 AM", period: "Morning" },
  { time: "02:00 PM", period: "Afternoon" },
  { time: "04:00 PM", period: "Afternoon" },
  { time: "06:00 PM", period: "Evening" },
  { time: "08:00 PM", period: "Evening" },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const { setBookingField, setBookingStep } = useBookingStore();
  const { user } = useSupabaseAuth();
  const isAuthenticated = !!user;

  // Find service
  let service: any = null;
  let category: any = null;

  for (const cat of servicesData) {
    const srv = cat.services.find((s) => s.id === parseInt(serviceId));
    if (srv) {
      service = srv;
      category = cat;
      break;
    }
  }

  // Fallback if not found
  if (!service) {
    service = servicesData[0].services[0];
    category = servicesData[0];
  }

  // Local State
  const [activeTab, setActiveTab] = useState("description"); // "description" | "includes" | "reviews"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedPro, setSelectedPro] = useState<any>(null);

  const dates = getNext7Days();

  // Filter professionals matching category specialty
  const matchedPros = professionalsData.filter((pro) => {
    const spec = pro.specialty.toLowerCase();
    const cat = category.category.toLowerCase();
    return cat.includes(spec) || spec.includes(cat) || spec.includes("salon") && cat.includes("salon") || spec.includes("massage") && cat.includes("massage");
  });

  const handleBookNow = () => {
    if (!selectedDate) {
      toast.error("Please pick a service date");
      return;
    }
    if (!selectedTimeSlot) {
      toast.error("Please pick a time slot");
      return;
    }

    // Set Booking Fields
    const formattedDate = dates.find(d => d.dateStr === selectedDate);
    if (formattedDate) {
      setBookingField("date", `${formattedDate.dayName}, ${formattedDate.dayNum} ${formattedDate.month}`);
    }
    setBookingField("timeSlot", selectedTimeSlot);
    setBookingField("professional", selectedPro || professionalsData[0]); // fallback to first pro if none selected

    // Add to cart if not already present
    const inCart = cartItems.some((item) => item.id === service.id);
    if (!inCart) {
      addToCart(service);
    }

    if (isAuthenticated) {
      setBookingStep(1); // Start from address step
      router.push("/booking");
    } else {
      router.push("/login?callbackUrl=/booking");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-16"
    >
      {/* Breadcrumb */}
      <nav className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 px-4 sm:px-0">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <IoChevronForwardOutline />
        <Link href={`/services/${category.id}`} className="hover:text-slate-600">{category.category}</Link>
        <IoChevronForwardOutline />
        <span className="text-[#1A1A2E]">{service.name}</span>
      </nav>

      {/* Main Grid: Details + Scheduling Sticky Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Info Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Service Title Card */}
          <div className="space-y-4 px-4 sm:px-0">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1A2E] leading-tight">
              {service.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center text-[#F59E0B] gap-1 bg-[#F59E0B]/10 px-3 py-1 rounded-full">
                <IoStar /> {service.rating} ({service.reviews} reviews)
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-full">
                Duration: {service.duration}
              </span>
              <span className="text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Verified Expert Service
              </span>
            </div>
          </div>

          {/* Hero Banner image */}
          <div className="relative rounded-3xl overflow-hidden aspect-video max-h-[360px] shadow-sm border border-slate-100">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Tab Selection */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
            <div className="flex border-b border-slate-200">
              {["description", "includes", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 pr-6 sm:pr-8 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    activeTab === tab
                      ? "border-[#2563EB] text-[#1A1A2E]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[120px] text-xs sm:text-sm leading-relaxed text-slate-500 font-semibold">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-4"
                  >
                    <p>{service.description}</p>
                    <p>Our professional doorstep service guarantees standard protocols, verified partners, and mess-free delivery. Sit back and relax while our experts get the job done.</p>
                  </motion.div>
                )}

                {activeTab === "includes" && (
                  <motion.div
                    key="inc"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700"
                  >
                    <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                      <IoShieldCheckmarkOutline className="text-[#2563EB] text-lg shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-[#1A1A2E]">30-Day Warranty</h5>
                        <p className="text-[10px] text-slate-400 font-medium">Free coverage against service issues.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                      <IoSparklesOutline className="text-[#2563EB] text-lg shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-[#1A1A2E]">Sanitized Tools</h5>
                        <p className="text-[10px] text-slate-400 font-medium">Equipped with sanitized, branded tools.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                      <IoShieldCheckmarkOutline className="text-[#2563EB] text-lg shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-[#1A1A2E]">Verified Partners</h5>
                        <p className="text-[10px] text-slate-400 font-medium">Vetted specialists with background clearances.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                      <IoSparklesOutline className="text-[#2563EB] text-lg shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-[#1A1A2E]">No-mess Guarantee</h5>
                        <p className="text-[10px] text-slate-400 font-medium">Complete cleanup after service execution.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="rev"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-1.5 text-[#F59E0B] font-extrabold text-sm mb-4">
                      <IoStar /> {service.rating} <span className="text-[#1A1A2E]">({service.reviews} customer reviews)</span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xs space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#1A1A2E]">Ankit Sharma</span>
                          <span className="text-[#F59E0B] flex gap-0.5">★★★★★</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Verified User • 2 days ago</p>
                        <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
                          &ldquo;Highly professional! Fast service, clean execution, and reasonable prices.&rdquo;
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xs space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#1A1A2E]">Meera Nair</span>
                          <span className="text-[#F59E0B] flex gap-0.5">★★★★☆</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Verified User • 1 week ago</p>
                        <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
                          &ldquo;The expert arrived on time and did a neat job. Highly recommend standard booking.&rdquo;
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Columns: Date, Time & Pro Selection card */}
        <div className="space-y-6">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 shadow-md lg:sticky lg:top-24 space-y-6">
            <h3 className="font-extrabold text-base text-[#1A1A2E] border-b pb-3">Configure Booking</h3>

            {/* Date Picker Pills */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1A1A2E] uppercase tracking-wider flex items-center gap-1.5">
                <IoCalendarOutline className="text-[#2563EB]" /> Select Date
              </label>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.dateStr}
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                      selectedDate === d.dateStr
                        ? "border-[#2563EB] bg-[#2563EB] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]"
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase leading-none">{d.dayName}</span>
                    <span className="text-xs font-black mt-1 leading-none">{d.dayNum}</span>
                    <span className="text-[9px] font-semibold mt-0.5 leading-none opacity-80">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1A1A2E] uppercase tracking-wider flex items-center gap-1.5">
                <IoTimeOutline className="text-[#2563EB]" /> Select Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedTimeSlot === slot.time
                        ? "border-[#2563EB] bg-blue-50 text-[#2563EB] font-bold"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]"
                    }`}
                  >
                    <span className="block font-bold">{slot.time}</span>
                    <span className="text-[9px] font-medium text-slate-400 uppercase leading-none">{slot.period}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Professional Picker */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">
                Select Service Partner
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {matchedPros.map((pro) => (
                  <div
                    key={pro.id}
                    onClick={() => setSelectedPro(pro)}
                    className={`flex items-center gap-3 p-3 bg-white rounded-xl border transition-all cursor-pointer ${
                      selectedPro?.id === pro.id
                        ? "border-[#2563EB] ring-1 ring-[#2563EB] bg-blue-50/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pro"
                      checked={selectedPro?.id === pro.id}
                      onChange={() => setSelectedPro(pro)}
                      className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-[#1A1A2E] leading-none">{pro.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        Exp: {pro.experience} • Rating: {pro.rating}★
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB]">+{pro.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Pricing box */}
            <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase leading-none">Order Total</span>
                <span className="font-extrabold text-xl text-[#1A1A2E] block mt-1 leading-none">
                  ₹{service.price + (selectedPro ? selectedPro.price : 0)}
                </span>
              </div>
              <button
                onClick={handleBookNow}
                className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Badges bottom row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-0 py-8 border-t border-slate-100 flex flex-col sm:flex-row justify-around items-center gap-6 text-xs text-slate-500 font-bold">
        <div className="flex items-center gap-2">
          <IoShieldCheckmarkOutline className="text-[#2563EB] text-lg" />
          <span>Background Verified Experts</span>
        </div>
        <div className="flex items-center gap-2">
          <IoSparklesOutline className="text-[#2563EB] text-lg" />
          <span>Equipped with Sanitized Tools</span>
        </div>
        <div className="flex items-center gap-2">
          <IoShieldCheckmarkOutline className="text-[#2563EB] text-lg" />
          <span>30-Day Moneyback Warranty</span>
        </div>
      </section>

    </motion.div>
  );
}
