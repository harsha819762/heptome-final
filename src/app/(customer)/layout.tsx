"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Toaster } from "react-hot-toast";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1A1A2E]">
        {/* Hot Toast Notification Engine */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "12px",
              background: "#1A1A2E",
              color: "#FFFFFF",
            },
            success: {
              iconTheme: {
                primary: "#2563EB",
                secondary: "#FFFFFF",
              },
            },
          }}
        />

        {/* Navigation Header */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer Links */}
        <Footer />

        {/* Global Drawers / Modals */}
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
