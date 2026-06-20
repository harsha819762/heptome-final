"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem("uc_cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedCoupon = localStorage.getItem("uc_coupon");
    if (storedCoupon) {
      setCoupon(JSON.parse(storedCoupon));
    }
  }, []);

  // Save to local storage when cart items change
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("uc_cart", JSON.stringify(items));
  };

  const addToCart = (service) => {
    const existingIndex = cartItems.findIndex((item) => item.id === service.id);
    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cartItems, { ...service, quantity: 1 }];
    }
    saveCart(updated);
    toast.success(`${service.name} added to cart!`);
  };

  const removeFromCart = (serviceId) => {
    const updated = cartItems.filter((item) => item.id !== serviceId);
    saveCart(updated);
  };

  const updateQuantity = (serviceId, qty) => {
    if (qty <= 0) {
      removeFromCart(serviceId);
      return;
    }
    const updated = cartItems.map((item) =>
      item.id === serviceId ? { ...item, quantity: qty } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
    localStorage.removeItem("uc_coupon");
  };

  const applyCoupon = (code) => {
    const uppercaseCode = code.trim().toUpperCase();
    if (uppercaseCode === "FIRST20") {
      const couponObj = { code: "FIRST20", type: "PERCENT", value: 20 };
      setCoupon(couponObj);
      localStorage.setItem("uc_coupon", JSON.stringify(couponObj));
      toast.success("Coupon applied! 20% off");
      return true;
    } else if (uppercaseCode === "SAVE50") {
      const couponObj = { code: "SAVE50", type: "FLAT", value: 50 };
      setCoupon(couponObj);
      localStorage.setItem("uc_coupon", JSON.stringify(couponObj));
      toast.success("Coupon applied! ₹50 flat off");
      return true;
    } else if (uppercaseCode === "UC100") {
      const couponObj = { code: "UC100", type: "FLAT", value: 100 };
      setCoupon(couponObj);
      localStorage.setItem("uc_coupon", JSON.stringify(couponObj));
      toast.success("Coupon applied! ₹100 flat off");
      return true;
    } else {
      toast.error("Invalid coupon code");
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem("uc_coupon");
    toast.success("Coupon removed");
  };

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.type === "PERCENT") {
      discount = Math.round(subtotal * (coupon.value / 100));
    } else if (coupon.type === "FLAT") {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  const serviceFee = subtotal > 0 ? 49 : 0;
  const cartTotal = Math.max(0, subtotal - discount + serviceFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        coupon,
        discount,
        subtotal,
        serviceFee,
        cartTotal,
        cartCount,
        isCartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
