"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const BookingContext = createContext();

const INITIAL_BOOKING_DATA = {
  address: { flatNo: "", street: "", city: "Mumbai", pincode: "" },
  date: "",
  timeSlot: "",
  professional: null,
  payment: "",
};

export function BookingProvider({ children }) {
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState(INITIAL_BOOKING_DATA);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = localStorage.getItem("uc_bookings");
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const nextStep = () => setBookingStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setBookingStep((prev) => Math.max(prev - 1, 1));
  const resetSteps = () => {
    setBookingStep(1);
    setBookingData(INITIAL_BOOKING_DATA);
  };

  const setBookingField = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmBooking = (cartItems, totalAmount) => {
    const bookingId = "US-" + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      id: bookingId,
      items: cartItems,
      total: totalAmount,
      address: bookingData.address,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      professional: bookingData.professional,
      payment: bookingData.payment,
      status: "Upcoming", // "Upcoming", "Completed", "Cancelled"
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem("uc_bookings", JSON.stringify(updatedBookings));
    toast.success("Booking confirmed!");
    return newBooking;
  };

  const getMyBookings = () => {
    const stored = localStorage.getItem("uc_bookings");
    return stored ? JSON.parse(stored) : bookings;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(updated);
    localStorage.setItem("uc_bookings", JSON.stringify(updated));
  };

  const addBookingReview = (bookingId, rating, reviewText) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, review: { rating, text: reviewText, date: new Date().toISOString() } } : b
    );
    setBookings(updated);
    localStorage.setItem("uc_bookings", JSON.stringify(updated));
  };

  return (
    <BookingContext.Provider
      value={{
        bookingStep,
        setBookingStep,
        bookingData,
        setBookingData,
        bookings,
        nextStep,
        prevStep,
        resetSteps,
        setBookingField,
        confirmBooking,
        getMyBookings,
        updateBookingStatus,
        addBookingReview,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
