"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useBookingStore } from "@/store/useBookingStore";
import { useSupabaseAuth } from "@/context/SupabaseAuthProvider";
import { professionalsData } from "@/data/servicesData";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoCheckmarkCircleSharp, IoLocationOutline, IoCalendarOutline, 
  IoPersonOutline, IoCardOutline 
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

const CATEGORY_TO_SERVICE_TYPE: Record<number, string> = {
  1: "BEAUTICIAN",
  2: "BARBER",
  3: "AC_REPAIR",
  4: "CLEANER",
  5: "ELECTRICIAN",
  6: "PLUMBER",
};

const TIME_SLOTS = [
  { time: "09:00 AM", period: "Morning" },
  { time: "11:00 AM", period: "Morning" },
  { time: "02:00 PM", period: "Afternoon" },
  { time: "04:00 PM", period: "Afternoon" },
  { time: "06:00 PM", period: "Evening" },
  { time: "08:00 PM", period: "Evening" },
];

export default function BookingPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const { cartItems, cartTotal, discount, subtotal, serviceFee, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { 
    bookingStep, setBookingStep, bookingData, setBookingField,
    nextStep, prevStep, resetSteps, confirmBooking 
  } = useBookingStore();

  // Local State
  const [flatNo, setFlatNo] = useState(bookingData.address?.flatNo || "");
  const [street, setStreet] = useState(bookingData.address?.street || "");
  const [city, setCity] = useState(bookingData.address?.city || "Mumbai");
  const [pincode, setPincode] = useState(bookingData.address?.pincode || "");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<any>(null);

  const dates = getNext7Days();

  // Redirect if cart is empty and not on confirmation step
  useEffect(() => {
    if (cartItems.length === 0 && bookingStep < 5) {
      router.push("/");
    }
  }, [cartItems, bookingStep, router]);

  // Load saved addresses
  useEffect(() => {
    const stored = localStorage.getItem("uc_saved_addresses");
    if (stored) {
      try {
        setSavedAddresses(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo || !street || !city || !pincode) {
      toast.error("Please fill all address fields");
      return;
    }
    const newAddress = { id: Date.now(), flatNo, street, city, pincode };
    const updated = [newAddress, ...savedAddresses];
    setSavedAddresses(updated);
    localStorage.setItem("uc_saved_addresses", JSON.stringify(updated));
    setBookingField("address", newAddress);
    toast.success("Address saved successfully");
    nextStep();
  };

  const handleSelectSavedAddress = (addr: any) => {
    setFlatNo(addr.flatNo);
    setStreet(addr.street);
    setCity(addr.city);
    setPincode(addr.pincode);
    setBookingField("address", addr);
    toast.success("Address selected");
    nextStep();
  };

  const handleScheduleSubmit = () => {
    if (!bookingData.date || !bookingData.timeSlot) {
      toast.error("Please pick date and time slot");
      return;
    }
    nextStep();
  };

  const handleSelectPro = (pro: any) => {
    setBookingField("professional", pro);
    nextStep();
  };

  const handleApplyCouponCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput("");
  };

  const handleConfirmOrder = async () => {
    if (!bookingData.payment) {
      toast.error("Please select a payment method");
      return;
    }
    if (!user) {
      toast.error("Please login to confirm booking");
      router.push("/login?callbackUrl=/booking");
      return;
    }

    const proFee = bookingData.professional ? bookingData.professional.price : 0;
    const finalAmount = cartTotal + proFee;
    const firstItem = cartItems[0];

    toast.loading("Creating your booking...", { id: "create-booking" });

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: CATEGORY_TO_SERVICE_TYPE[firstItem?.catId || 4] || "CLEANER",
          service_name: firstItem?.name || "Home Service",
          service_description: firstItem?.description || "",
          special_instructions: "",
          scheduled_date: bookingData.date,
          scheduled_time: bookingData.timeSlot,
          estimated_duration: 60,
          base_price: finalAmount,
          add_on_price: 0,
          discount: discount || 0,
          total_price: finalAmount,
          address: bookingData.address,
          payment_method: bookingData.payment,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create booking");
      }

      const data = await res.json();
      const details = confirmBooking(cartItems, finalAmount);
      setConfirmedBookingDetails({ ...details, id: data.booking.booking_number });
      clearCart();
      setBookingStep(5);
      toast.success("Booking created successfully!", { id: "create-booking" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create booking. Saved locally.", { id: "create-booking" });
      const details = confirmBooking(cartItems, finalAmount);
      setConfirmedBookingDetails(details);
      clearCart();
      setBookingStep(5);
    }
  };

  const handleReturnHome = () => {
    resetSteps();
    router.push("/");
  };

  const handleViewBookings = () => {
    resetSteps();
    router.push("/my-bookings");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-0 py-4 space-y-8"
    >
      {/* Steps Progress Header */}
      {bookingStep <= 4 && (
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center max-w-xl mx-auto relative">
            {/* Background progress line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
            <div 
              className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#2563EB] transition-all duration-300 z-0" 
              style={{ width: `${((bookingStep - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: "Address" },
              { num: 2, label: "Schedule" },
              { num: 3, label: "Professional" },
              { num: 4, label: "Payment" }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center relative z-10 space-y-1.5">
                <button
                  disabled={s.num > bookingStep}
                  onClick={() => setBookingStep(s.num)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-black border transition-all cursor-pointer ${
                    bookingStep === s.num
                      ? "border-[#2563EB] bg-[#2563EB] text-white ring-4 ring-blue-50"
                      : bookingStep > s.num
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {s.num}
                </button>
                <span className={`text-[9px] sm:text-xs font-bold ${bookingStep === s.num ? "text-[#2563EB]" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Steps Wizards */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ADDRESS */}
            {bookingStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-md space-y-6"
              >
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1A1A2E] flex items-center gap-2">
                    <IoLocationOutline className="text-[#2563EB]" /> Service Address
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Specify where our service professional should arrive</p>
                </div>

                {/* Saved Addresses list */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Addresses</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className="border border-slate-200 hover:border-[#2563EB] bg-[#F9FAFB] hover:bg-blue-50/10 p-4 rounded-xl cursor-pointer text-xs transition-all flex flex-col justify-between"
                        >
                          <p className="font-bold text-[#1A1A2E]">{addr.flatNo}</p>
                          <p className="text-slate-400 font-semibold mt-1 leading-snug">{addr.street}, {addr.city}</p>
                          <span className="text-[10px] text-[#2563EB] font-bold mt-2">Select address →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address Form */}
                <form onSubmit={handleSaveAddress} className="space-y-4 pt-4 border-t">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add New Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Flat / House No / Building</label>
                      <input
                        type="text"
                        required
                        value={flatNo}
                        onChange={(e) => setFlatNo(e.target.value)}
                        placeholder="e.g. Flat 304, Tower B"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Street / Locality</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. MG Road, Sector 5"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]"
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        placeholder="e.g. 400001"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!flatNo || !street || !pincode}
                    className="w-full btn-primary text-xs py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save & Proceed
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: SCHEDULE */}
            {bookingStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-md space-y-6"
              >
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1A1A2E] flex items-center gap-2">
                    <IoCalendarOutline className="text-[#2563EB]" /> Schedule Service
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Pick a date and convenient time slot for execution</p>
                </div>

                {/* Date Selection Pills */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Date</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {dates.map((d) => {
                      const dateVal = `${d.dayName}, ${d.dayNum} ${d.month}`;
                      const isSelected = bookingData.date === dateVal;
                      return (
                        <button
                          key={d.dateStr}
                          onClick={() => setBookingField("date", dateVal)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#2563EB] bg-[#2563EB] text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]"
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase leading-none">{d.dayName}</span>
                          <span className="text-xs font-black mt-1 leading-none">{d.dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slot Selector */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Time Slot</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = bookingData.timeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          onClick={() => setBookingField("timeSlot", slot.time)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#2563EB] bg-blue-50 text-[#2563EB] font-bold"
                              : "border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]"
                          }`}
                        >
                          <span className="block text-xs font-extrabold">{slot.time}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">{slot.period}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs cursor-pointer">
                    Back
                  </button>
                  <button
                    onClick={handleScheduleSubmit}
                    disabled={!bookingData.date || !bookingData.timeSlot}
                    className="flex-1 btn-primary py-3 text-xs disabled:opacity-50"
                  >
                    Proceed to Professional
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PROFESSIONAL */}
            {bookingStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-md space-y-6"
              >
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1A1A2E] flex items-center gap-2">
                    <IoPersonOutline className="text-[#2563EB]" /> Choose Professional
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Select your preferred expert partner or go with our recommended match</p>
                </div>

                {/* Best Match */}
                <div
                  onClick={() => handleSelectPro(professionalsData[0])}
                  className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                    bookingData.professional?.id === professionalsData[0].id
                      ? "border-[#2563EB] bg-blue-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                    {bookingData.professional?.id === professionalsData[0].id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#1A1A2E]">Best Match (Recommended)</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Assign our top-rated expert available in your locality (No extra fee)</p>
                  </div>
                </div>

                {/* Partner lists */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Specialists</h4>
                  <div className="space-y-3">
                    {professionalsData.slice(1).map((pro) => {
                      const isSelected = bookingData.professional?.id === pro.id;
                      return (
                        <div
                          key={pro.id}
                          onClick={() => handleSelectPro(pro)}
                          className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#2563EB] bg-blue-50/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />}
                          </div>
                          <img
                            src={pro.photo}
                            alt={pro.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-[#1A1A2E] leading-none">{pro.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                              {pro.specialty} Specialist • {pro.experience} Exp • {pro.rating}★
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-[#2563EB]">+{pro.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs cursor-pointer">
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PAYMENT */}
            {bookingStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-md space-y-6"
              >
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1A1A2E] flex items-center gap-2">
                    <IoCardOutline className="text-[#2563EB]" /> Choose Payment Method
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Select how you want to pay for this service booking</p>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", sub: "Pay cash/UPI directly to the partner after service delivery." },
                    { id: "upi", label: "UPI (Google Pay / PhonePe / Paytm)", sub: "Pay digitally instantly using smartphone apps." },
                    { id: "card", label: "Credit or Debit Card", sub: "Visa, Mastercard, RuPay cards supported." },
                    { id: "net", label: "Net Banking", sub: "Instant secure login through primary banks." }
                  ].map((p) => {
                    const isSelected = bookingData.payment === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setBookingField("payment", p.id)}
                        className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#2563EB] bg-[#2563EB]/5"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={isSelected}
                          onChange={() => setBookingField("payment", p.id)}
                          className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB] mt-0.5"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-[#1A1A2E] leading-none">{p.label}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-normal">{p.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 text-xs cursor-pointer">
                    Back
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={!bookingData.payment}
                    className="flex-1 btn-primary py-3 text-xs disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: CONFIRMATION */}
            {bookingStep === 5 && confirmedBookingDetails && (
              <motion.div
                key="step5"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 lg:col-span-3 max-w-xl mx-auto"
              >
                {/* Checkmark Animation */}
                <div className="w-16 h-16 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                  <IoCheckmarkCircleSharp className="text-4xl" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">Booking Confirmed! 🎉</h2>
                  <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Order ID: {confirmedBookingDetails.id}</p>
                  <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-sm mx-auto">
                    Your professional has been scheduled and will arrive at your doorstep on the selected date.
                  </p>
                </div>

                {/* Summary Info */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 text-left text-xs font-semibold text-slate-500 space-y-3.5">
                  <div className="flex justify-between border-b pb-2.5">
                    <span className="text-slate-400">Scheduled Date</span>
                    <span className="text-[#1A1A2E] font-bold">{confirmedBookingDetails.date}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2.5">
                    <span className="text-slate-400">Time Slot</span>
                    <span className="text-[#1A1A2E] font-bold">{confirmedBookingDetails.timeSlot}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2.5">
                    <span className="text-slate-400">Assigned Pro</span>
                    <span className="text-[#1A1A2E] font-bold">{confirmedBookingDetails.professional?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Charged</span>
                    <span className="text-[#2563EB] font-black text-sm">₹{confirmedBookingDetails.total}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleViewBookings}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl py-3 text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    View Bookings
                  </button>
                  <button
                    onClick={handleReturnHome}
                    className="flex-1 btn-primary py-3 text-xs"
                  >
                    Go Home
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Side: Sticky Checkout Summary Details */}
        {bookingStep <= 4 && (
          <div className="space-y-6">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 shadow-md lg:sticky lg:top-24 space-y-6">
              <h3 className="font-extrabold text-base text-[#1A1A2E] border-b pb-3">Booking Summary</h3>

              {/* Items List */}
              <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs font-semibold text-slate-500">
                    <div className="max-w-[70%]">
                      <p className="text-[#1A1A2E] font-bold leading-tight">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                    <span className="text-[#1A1A2E] font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Booking Details details if selected */}
              {(bookingData.date || bookingData.timeSlot || bookingData.address?.pincode) && (
                <div className="border-t border-slate-200 pt-4 text-[10px] font-semibold text-slate-500 space-y-2">
                  <h4 className="text-slate-400 font-bold uppercase tracking-wider">Scheduled Details</h4>
                  {bookingData.date && (
                    <p className="text-slate-600">Date: <strong className="text-[#1A1A2E]">{bookingData.date}</strong></p>
                  )}
                  {bookingData.timeSlot && (
                    <p className="text-slate-600">Time: <strong className="text-[#1A1A2E]">{bookingData.timeSlot}</strong></p>
                  )}
                  {bookingData.address?.pincode && (
                    <p className="text-slate-600">Address: <strong className="text-[#1A1A2E]">{bookingData.address.flatNo}, {bookingData.address.pincode}</strong></p>
                  )}
                  {bookingData.professional && (
                    <p className="text-slate-600">Expert: <strong className="text-[#1A1A2E]">{bookingData.professional.name}</strong></p>
                  )}
                </div>
              )}

              {/* Coupon inputs (Step 4 only) */}
              {bookingStep === 4 && (
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Discount Coupon</h4>
                  {coupon ? (
                    <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl flex items-center justify-between">
                      <span className="text-[10px] text-blue-800 font-bold tracking-widest">{coupon.code} APPLIED</span>
                      <button onClick={removeCoupon} className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCouponCode} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon Code"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#2563EB] transition-all"
                      />
                      <button type="submit" className="bg-slate-900 text-white rounded-xl text-[10px] font-bold px-3 py-2">Apply</button>
                    </form>
                  )}
                </div>
              )}

              {/* Pricing Math */}
              <div className="border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1A1A2E] font-bold">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-blue-600 font-bold">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="text-[#1A1A2E] font-bold">₹{serviceFee}</span>
                </div>
                {bookingData.professional && bookingData.professional.price > 0 && (
                  <div className="flex justify-between">
                    <span>Professional Premium</span>
                    <span className="text-[#1A1A2E] font-bold">+ ₹{bookingData.professional.price}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 my-2 pt-3 flex justify-between text-sm font-black text-[#1A1A2E]">
                  <span>Grand Total</span>
                  <span className="text-[#2563EB] text-lg">
                    ₹{cartTotal + (bookingData.professional ? bookingData.professional.price : 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
