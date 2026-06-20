"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

export default function AuthModal() {
  const { isLoginModalOpen, setLoginModalOpen, login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setLoginModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setPhone("");
    setName("");
    setOtp("");
    setIsOtpSent(false);
    setIsLoading(false);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      toast.success("OTP sent! Use mock OTP: 1234");
    }, 800);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp !== "1234") {
      toast.error("Invalid OTP code. Please enter 1234");
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === "login") {
        await login(phone, otp);
        toast.success("Welcome back!");
      } else {
        if (!name) {
          toast.error("Please enter your name");
          setIsLoading(false);
          return;
        }
        await signup(name, phone);
        toast.success("Account created successfully!");
      }
      handleClose();
    } catch (err) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 z-10 flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <IoCloseOutline className="text-2xl text-slate-500" />
          </button>

          {/* Logo / Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2563EB]/10 text-[#2563EB] mb-3">
              <span className="font-bold text-xl">HT</span>
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E]">
              {isOtpSent ? "Enter Verification Code" : "Welcome to Heptome"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isOtpSent
                ? `We sent a 4-digit code to +91 ${phone}`
                : "Login or Sign Up to book professional services"}
            </p>
          </div>

          {/* Tabs - Only show when OTP is not sent */}
          {!isOtpSent && (
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => {
                  setActiveTab("login");
                  resetForm();
                }}
                className={`flex-1 pb-3 text-center font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === "login"
                    ? "border-[#2563EB] text-[#1A1A2E]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  resetForm();
                }}
                className={`flex-1 pb-3 text-center font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === "signup"
                    ? "border-[#2563EB] text-[#1A1A2E]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Forms */}
          <div className="flex-1">
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {activeTab === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Harsha Vardhan"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm text-[#1A1A2E]"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm text-[#1A1A2E]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary mt-2 flex items-center justify-center gap-2 py-3"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Enter 4-Digit OTP
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter OTP (1234)"
                    className="w-full text-center tracking-[1em] text-lg font-bold px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-[#1A1A2E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-xs text-[#2563EB] font-semibold hover:underline"
                  >
                    Change phone number
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
