"use client";

import React, { useState, useEffect } from "react";
import { useBooking } from "../context/BookingContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar, IoCalendarOutline, IoTimeOutline, IoPersonOutline, IoTrashOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";

// Helper to simulate a countdown timer for upcoming bookings
function CountdownTimer({ dateStr }) {
  const [timeLeft, setTimeLeft] = useState("02h : 45m : 12s");

  useEffect(() => {
    // Generate static/incrementing countdown for UX
    const timer = setInterval(() => {
      const hours = Math.floor(Math.random() * 2) + 1;
      const mins = Math.floor(Math.random() * 59);
      const secs = Math.floor(Math.random() * 59);
      setTimeLeft(`${hours.toString().padStart(2, "0")}h : ${mins.toString().padStart(2, "0")}m : ${secs.toString().padStart(2, "0")}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="bg-amber-50 text-amber-700 font-mono text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border border-amber-100 animate-pulse shrink-0">
      Arriving in {timeLeft}
    </span>
  );
}

export default function MyBookings() {
  const { bookings, updateBookingStatus, addBookingReview } = useBooking();
  const { addToCart, setCartOpen } = useCart();
  const navigate = useNavigate();

  // Tabs: "upcoming" | "completed" | "cancelled"
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [selectedBookingForRate, setSelectedBookingForRate] = useState(null);

  // Ratings inputs
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const filteredBookings = bookings.filter((b) => b.status.toLowerCase() === activeTab);

  // Seed default mock completed booking if none exist (so user has something to rate/test!)
  useEffect(() => {
    const stored = localStorage.getItem("uc_bookings");
    if (!stored || JSON.parse(stored).length === 0) {
      const mockBookings = [
        {
          id: "US-887492",
          items: [{ id: 101, name: "Full Body Waxing", price: 299, duration: "45 min", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400" }],
          total: 348,
          address: { flatNo: "405", street: "Sector 15", city: "Mumbai", pincode: "400015" },
          date: "Yesterday, 19 June",
          timeSlot: "04:00 PM",
          professional: { id: 1, name: "Rahul Sharma", photo: "https://randomuser.me/api/portraits/men/1.jpg" },
          status: "Completed",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "US-224810",
          items: [{ id: 301, name: "AC Service & Cleaning", price: 399, duration: "60 min", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400" }],
          total: 448,
          address: { flatNo: "Room 12", street: "HSR Lane", city: "Bangalore", pincode: "560102" },
          date: "12 June",
          timeSlot: "11:00 AM",
          professional: { id: 2, name: "Priya Singh", photo: "https://randomuser.me/api/portraits/women/2.jpg" },
          status: "Cancelled",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        }
      ];
      localStorage.setItem("uc_bookings", JSON.stringify(mockBookings));
      // Force page reload or trigger state update
      window.location.reload();
    }
  }, []);

  const handleCancelClick = (b) => {
    setSelectedBookingForCancel(b);
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    updateBookingStatus(selectedBookingForCancel.id, "Cancelled");
    setSelectedBookingForCancel(null);
    toast.success("Booking cancelled successfully");
  };

  const handleRateClick = (b) => {
    setSelectedBookingForRate(b);
    setRating(5);
    setReviewText("");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!selectedBookingForRate) return;
    addBookingReview(selectedBookingForRate.id, rating, reviewText);
    setSelectedBookingForRate(null);
    toast.success("Thank you for your rating!");
  };

  const handleRebook = (item) => {
    addToCart(item);
    setCartOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-0 py-4 space-y-8"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">My Bookings</h2>
        <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Manage and track your home service bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {["upcoming", "completed", "cancelled"].map((tab) => (
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

      {/* Booking List Container */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl">
            <p className="text-slate-400 font-semibold text-sm">No {activeTab} bookings found.</p>
            {activeTab === "upcoming" && (
              <button
                onClick={() => navigate("/")}
                className="btn-primary mt-4 py-2 px-6 text-xs font-bold"
              >
                Book a Service
              </button>
            )}
          </div>
        ) : (
          filteredBookings.map((b) => (
            <motion.div
              layout
              key={b.id}
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Top Header Card row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Booking ID</span>
                  <h4 className="font-extrabold text-sm text-[#1A1A2E]">{b.id}</h4>
                </div>
                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  {b.status === "Upcoming" && <CountdownTimer dateStr={b.date} />}
                  {b.status === "Completed" && (
                    <span className="bg-blue-50 text-blue-700 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border border-blue-100">
                      ✓ Completed
                    </span>
                  )}
                  {b.status === "Cancelled" && (
                    <span className="bg-red-50 text-red-700 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border border-red-100">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>

              {/* Items List inside booking */}
              <div className="space-y-3.5 py-2">
                {b.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-[#1A1A2E] leading-tight">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">Qty: {item.quantity || 1} • {item.duration}</p>
                    </div>
                    {b.status === "Completed" && (
                      <button
                        onClick={() => handleRebook(item)}
                        className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-xl text-[10px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        Rebook
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Details and Professional footer row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">Schedule</span>
                  <p className="text-[#1A1A2E] font-bold flex items-center gap-1">
                    <IoCalendarOutline /> {b.date} • {b.timeSlot}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">Assigned Professional</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={b.professional?.photo || "https://randomuser.me/api/portraits/men/1.jpg"}
                      alt={b.professional?.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-[#1A1A2E] font-bold">{b.professional?.name}</span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-end sm:items-start shrink-0 space-y-1 mt-2 sm:mt-0">
                  <span className="text-[9px] text-slate-400 font-black uppercase hidden sm:block">Amount Charged</span>
                  <span className="font-extrabold text-sm sm:text-base text-[#1A1A2E] leading-none">₹{b.total}</span>
                </div>
              </div>

              {/* Action Buttons for Tab */}
              {b.status === "Upcoming" && (
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleCancelClick(b)}
                    className="flex items-center gap-1.5 border border-red-200 hover:border-red-500 text-red-500 hover:bg-red-50 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <IoTrashOutline /> Cancel Booking
                  </button>
                </div>
              )}

              {/* Rate Service details if completed */}
              {b.status === "Completed" && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {b.review ? (
                    <div className="bg-slate-100/50 p-2.5 rounded-xl border border-slate-200 text-[10px] font-semibold text-slate-500 flex items-center gap-2">
                      <span className="text-[#F59E0B] font-bold flex items-center gap-0.5"><IoStar /> {b.review.rating}★</span>
                      <span className="italic leading-none">&ldquo;{b.review.text}&rdquo;</span>
                    </div>
                  ) : (
                    <div className="flex justify-end w-full">
                      <button
                        onClick={() => handleRateClick(b)}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Rate Service
                      </button>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          ))
        )}
      </div>

      {/* CANCELLATION MODAL */}
      <AnimatePresence>
        {selectedBookingForCancel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={() => setSelectedBookingForCancel(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10 text-center space-y-4"
            >
              <h3 className="text-lg font-black text-[#1A1A2E]">Cancel Booking?</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Are you sure you want to cancel booking <strong>{selectedBookingForCancel.id}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedBookingForCancel(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-xs cursor-pointer"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl py-2.5 text-xs cursor-pointer"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RATING REVIEW MODAL */}
      <AnimatePresence>
        {selectedBookingForRate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={() => setSelectedBookingForRate(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 text-center"
            >
              <h3 className="text-lg font-black text-[#1A1A2E] mb-2">Rate Your Service</h3>
              <p className="text-xs text-slate-500 font-semibold mb-4">Share your feedback about {selectedBookingForRate.items[0].name}</p>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star Rating Select */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <IoStar 
                        className={`text-2xl ${star <= rating ? "text-[#F59E0B]" : "text-slate-200"}`} 
                      />
                    </button>
                  ))}
                </div>

                {/* Review Text */}
                <textarea
                  rows={3}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB] transition-all"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForRate(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-2.5 text-xs"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
