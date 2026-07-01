"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoNotificationsOutline,
  IoNotifications,
  IoClose,
  IoCheckmarkDone,
  IoCalendarOutline,
  IoCardOutline,
  IoChatbubbleOutline,
  IoStarOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoNotificationsOffOutline,
} from "react-icons/io5";
import { useFirebaseAuth } from "@/context/FirebaseAuthProvider";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
}

function getNotifIcon(type: string) {
  switch (type) {
    case "NEW_BOOKING": return <IoCalendarOutline className="text-blue-600" size={16} />;
    case "BOOKING_ACCEPTED": return <IoCheckmarkCircleOutline className="text-emerald-600" size={16} />;
    case "BOOKING_REJECTED": return <IoAlertCircleOutline className="text-red-500" size={16} />;
    case "BOOKING_COMPLETED": return <IoCheckmarkDone className="text-blue-600" size={16} />;
    case "NEW_MESSAGE": return <IoChatbubbleOutline className="text-violet-500" size={16} />;
    case "PAYMENT_RECEIVED": return <IoCardOutline className="text-emerald-600" size={16} />;
    case "REVIEW_RECEIVED": return <IoStarOutline className="text-amber-500" size={16} />;
    default: return <IoNotificationsOutline className="text-slate-500" size={16} />;
  }
}

function getNotifBg(type: string) {
  switch (type) {
    case "NEW_BOOKING": return "bg-blue-50 border-blue-100";
    case "BOOKING_ACCEPTED": return "bg-emerald-50 border-emerald-100";
    case "BOOKING_REJECTED": return "bg-red-50 border-red-100";
    case "BOOKING_COMPLETED": return "bg-blue-50 border-blue-100";
    case "NEW_MESSAGE": return "bg-violet-50 border-violet-100";
    case "PAYMENT_RECEIVED": return "bg-emerald-50 border-emerald-100";
    case "REVIEW_RECEIVED": return "bg-amber-50 border-amber-100";
    default: return "bg-slate-50 border-slate-100";
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Booking Confirmed",
    message: "Your AC Repair service on 22 Jun at 11:00 AM has been accepted by Rahul Sharma.",
    type: "BOOKING_ACCEPTED",
    bookingId: "US-887492",
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "n2",
    title: "New Message",
    message: "Rahul Sharma: 'I'll be arriving in 30 minutes, please keep the door open.'",
    type: "NEW_MESSAGE",
    bookingId: "US-887492",
    isRead: false,
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: "n3",
    title: "Payment Received",
    message: "We've received ₹448 for your Waxing booking on 19 Jun. Thank you!",
    type: "PAYMENT_RECEIVED",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n4",
    title: "Service Completed",
    message: "Your AC Repair service has been marked as completed. Please rate your experience!",
    type: "BOOKING_COMPLETED",
    bookingId: "US-887492",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "n5",
    title: "Review Received",
    message: "A customer gave you 5 stars! 'Excellent work, very professional.'",
    type: "REVIEW_RECEIVED",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export default function NotificationCenter() {
  const { user, profile } = useFirebaseAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!user || !profile) return;
    setLoading(true);
    try {
      setNotifications(MOCK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
      >
        {unreadCount > 0 ? (
          <IoNotifications className="text-[#1A1A2E]" size={20} />
        ) : (
          <IoNotificationsOutline className="text-[#1A1A2E]" size={20} />
        )}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-[80]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute right-0 top-12 w-[360px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-[90] flex flex-col overflow-hidden"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="text-sm font-black text-[#1A1A2E]">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading && (
                  <div className="flex justify-center py-10">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                    <IoNotificationsOffOutline className="text-4xl text-slate-300 mb-3" />
                    <p className="text-slate-400 text-xs font-semibold">No notifications yet</p>
                    <p className="text-slate-300 text-[10px] mt-1">
                      We'll let you know when something happens
                    </p>
                  </div>
                )}

                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => markAsRead(notif.id)}
                      className={`flex gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !notif.isRead ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getNotifBg(notif.type)}`}
                      >
                        {getNotifIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs leading-snug line-clamp-1 ${!notif.isRead ? "font-bold text-[#1A1A2E]" : "font-semibold text-slate-600"}`}>
                            {notif.title}
                          </p>
                          <span className="text-[9px] text-slate-400 font-semibold shrink-0 mt-0.5">
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-snug mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        {notif.bookingId && (
                          <Link
                            href="/my-bookings"
                            className="text-[10px] font-bold text-[#2563EB] mt-1 block hover:underline"
                            onClick={() => setOpen(false)}
                          >
                            View booking →
                          </Link>
                        )}
                      </div>

                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 px-4 py-3 shrink-0">
                <Link
                  href="/my-bookings"
                  onClick={() => setOpen(false)}
                  className="block text-center text-[11px] font-bold text-[#2563EB] hover:underline"
                >
                  View all activity →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
