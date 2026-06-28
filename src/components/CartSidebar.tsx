"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSupabaseAuth } from "@/context/SupabaseAuthProvider";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline, IoTrashOutline, IoAdd, IoRemove } from "react-icons/io5";
import { RiCoupon2Line } from "react-icons/ri";

export default function CartSidebar() {
  const {
    cartItems,
    coupon,
    discount,
    subtotal,
    serviceFee,
    cartTotal,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user } = useSupabaseAuth();
  const isAuthenticated = !!user;
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false);
    if (isAuthenticated) {
      router.push("/booking");
    } else {
      router.push("/login?callbackUrl=/booking");
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) setCouponCode("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex justify-end bg-black/50 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={() => setCartOpen(false)} />

        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-[#1A1A2E]">Your Cart</h3>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <IoCloseOutline className="text-2xl text-slate-500" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl">
                  🛒
                </div>
                <h4 className="font-bold text-[#1A1A2E]">Your cart is empty</h4>
                <p className="text-sm text-slate-400 max-w-xs">
                  Add professional home services to your cart to get started
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="btn-primary py-2 px-6 text-sm"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-start pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-[#1A1A2E] leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.duration}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-slate-50 text-slate-600 active:scale-90 transition-transform"
                        >
                          <IoRemove className="text-xs" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#1A1A2E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-slate-50 text-slate-600 active:scale-90 transition-transform"
                        >
                          <IoAdd className="text-xs" />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-[#1A1A2E]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors mt-0.5"
                  >
                    <IoTrashOutline className="text-base" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout Section */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-slate-50 space-y-4">
              {/* Coupon Section */}
              {coupon ? (
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiCoupon2Line className="text-blue-500 text-lg" />
                    <div>
                      <p className="text-xs text-blue-800 font-bold tracking-wider">
                        COUPON APPLIED: {coupon.code}
                      </p>
                      <p className="text-[10px] text-blue-600">
                        Saved ₹{discount} on this booking
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-500 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (FIRST20)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-[#2563EB] transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold px-4 transition-all"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs font-medium text-slate-500">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="text-[#1A1A2E] font-semibold">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="text-[#1A1A2E] font-semibold">₹{serviceFee}</span>
                </div>
                <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-sm font-bold text-[#1A1A2E]">
                  <span>Total Amount</span>
                  <span className="text-[#2563EB] text-lg">₹{cartTotal}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-3.5 text-sm flex items-center justify-center font-bold"
              >
                Proceed to Book
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
