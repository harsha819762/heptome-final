"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar, IoCalendarOutline, IoTimeOutline, IoTrashOutline, IoNavigateOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import ChatWindow from "@/components/ChatWindow";
import { getFirebaseDataConnect } from "@/lib/firebase/client";
import { listCustomerBookings, updateBookingStatus, addReview } from "@dataconnect/generated";

type BookingItem = {
  id: string;
  booking_number: string;
  service_name: string;
  service_description: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  total_price: number;
  customer_address: any;
  before_photos: string[];
  after_photos: string[];
};

const CUSTOMER_ID = "7f9b887a-dc8f-4f81-8cb0-6fb535a0f670";

export default function MyBookingsPage() {
  const { addToCart, setCartOpen } = useCart();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<BookingItem | null>(null);
  const [selectedBookingForRate, setSelectedBookingForRate] = useState<BookingItem | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const fetchBookings = useCallback(async () => {
    const dc = getFirebaseDataConnect();
    if (!dc) { setLoading(false); return; }
    try {
      const res = await listCustomerBookings(dc, { customerId: CUSTOMER_ID });
      setBookings((res.data.bookings || []).map((b) => ({
        id: b.id,
        booking_number: b.id.slice(0, 8).toUpperCase(),
        service_name: b.serviceCategory.name,
        service_description: b.partnerNotes || "",
        status: b.status,
        scheduled_date: b.bookingDate.split("T")[0],
        scheduled_time: b.bookingDate.split("T")[1]?.slice(0, 5) || "",
        total_price: b.totalAmount,
        customer_address: null,
        before_photos: [],
        after_photos: [],
      })));
    } catch { setBookings([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "upcoming") return b.status === "PENDING" || b.status === "ACCEPTED" || b.status === "CONFIRMED" || b.status === "IN_PROGRESS";
    if (activeTab === "completed") return b.status === "COMPLETED";
    if (activeTab === "cancelled") return b.status === "CANCELLED";
    return true;
  });

  const tabLabel = (b: BookingItem) => {
    if (b.status === "PENDING" || b.status === "ACCEPTED" || b.status === "CONFIRMED" || b.status === "IN_PROGRESS") return "Upcoming";
    if (b.status === "COMPLETED") return "Completed";
    if (b.status === "CANCELLED") return "Cancelled";
    return b.status;
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingForCancel) return;
    const dc = getFirebaseDataConnect();
    if (dc) {
      await updateBookingStatus(dc, { id: selectedBookingForCancel.id, status: "CANCELLED" });
    }
    setSelectedBookingForCancel(null);
    toast.success("Booking cancelled successfully");
    fetchBookings();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForRate) return;
    const dc = getFirebaseDataConnect();
    if (dc) {
      await addReview(dc, {
        rating,
        comment: reviewText,
        createdAt: new Date().toISOString(),
        partnerId: CUSTOMER_ID,
      });
    }
    setSelectedBookingForRate(null);
    toast.success("Thank you for your rating!");
  };

  const handleRebook = (item: any) => {
    addToCart(item);
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-0 py-4">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl">
            <p className="text-slate-400 font-semibold text-sm">No {activeTab} bookings found.</p>
            {activeTab === "upcoming" && (
              <button onClick={() => router.push("/")} className="btn-primary mt-4 py-2 px-6 text-xs font-bold">
                Book a Service
              </button>
            )}
          </div>
        ) : (
          filteredBookings.map((b) => (
            <motion.div
              layout key={b.id}
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Booking ID</span>
                  <h4 className="font-extrabold text-sm text-[#1A1A2E]">{b.booking_number}</h4>
                </div>
                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  {tabLabel(b) === "Completed" && (
                    <span className="bg-blue-50 text-blue-700 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border border-blue-100">✓ Completed</span>
                  )}
                  {tabLabel(b) === "Cancelled" && (
                    <span className="bg-red-50 text-red-700 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border border-red-100">Cancelled</span>
                  )}
                </div>
              </div>

              <div className="space-y-3.5 py-2">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-[#1A1A2E] leading-tight">{b.service_name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">{b.service_description}</p>
                  </div>
                  {tabLabel(b) === "Completed" && (
                    <button onClick={() => handleRebook({ id: b.id, name: b.service_name, price: b.total_price })} className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-xl text-[10px] font-bold px-3 py-1.5 transition-colors cursor-pointer">Rebook</button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">Schedule</span>
                  <p className="text-[#1A1A2E] font-bold flex items-center gap-1"><IoCalendarOutline /> {b.scheduled_date} • {b.scheduled_time}</p>
                </div>
                <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-end sm:items-start shrink-0 space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase">Amount Charged</span>
                  <span className="font-extrabold text-sm sm:text-base text-[#1A1A2E] leading-none">₹{b.total_price}</span>
                </div>
              </div>

              {tabLabel(b) === "Upcoming" && (
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-3">
                  <ChatWindow bookingId={b.id} />
                  <div className="flex items-center gap-2">
                    <Link href={`/track/${b.id}`} className="flex items-center gap-1 border border-blue-200 hover:border-blue-500 text-blue-600 hover:bg-blue-50 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"><IoNavigateOutline /> Track</Link>
                    <button onClick={() => setSelectedBookingForCancel(b)} className="flex items-center gap-1.5 border border-red-200 hover:border-red-500 text-red-500 hover:bg-red-50 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"><IoTrashOutline /> Cancel</button>
                  </div>
                </div>
              )}

              {tabLabel(b) === "Completed" && (
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button onClick={() => { setSelectedBookingForRate(b); setRating(5); setReviewText(""); }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer">Rate Service</button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedBookingForCancel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={() => setSelectedBookingForCancel(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10 text-center space-y-4">
              <h3 className="text-lg font-black text-[#1A1A2E]">Cancel Booking?</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">Are you sure you want to cancel booking <strong>{selectedBookingForCancel.booking_number}</strong>? This action cannot be undone.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelectedBookingForCancel(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-xs cursor-pointer">No, Keep it</button>
                <button onClick={handleCancelBooking} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl py-2.5 text-xs cursor-pointer">Yes, Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBookingForRate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={() => setSelectedBookingForRate(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 text-center">
              <h3 className="text-lg font-black text-[#1A1A2E] mb-2">Rate Your Service</h3>
              <p className="text-xs text-slate-500 font-semibold mb-4">Share your feedback about {selectedBookingForRate.service_name}</p>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="p-1 cursor-pointer transition-transform hover:scale-110">
                      <IoStar className={`text-2xl ${star <= rating ? "text-[#F59E0B]" : "text-slate-200"}`} />
                    </button>
                  ))}
                </div>
                <textarea rows={3} required value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell us what you liked or how we can improve..." className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB] transition-all" />
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setSelectedBookingForRate(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-xs cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-2.5 text-xs">Submit Rating</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
