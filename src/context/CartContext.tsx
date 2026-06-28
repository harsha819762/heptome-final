"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  description: string;
  quantity: number;
  catId?: number;
}

export interface Coupon {
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
}

interface CartContextType {
  cartItems: CartItem[];
  coupon: Coupon | null;
  discount: number;
  subtotal: number;
  serviceFee: number;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (service: Omit<CartItem, "quantity">) => void;
  removeFromCart: (serviceId: number) => void;
  updateQuantity: (serviceId: number, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem("uc_cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error(e);
      }
    }
    const storedCoupon = localStorage.getItem("uc_coupon");
    if (storedCoupon) {
      try {
        setCoupon(JSON.parse(storedCoupon));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to local storage when cart items change
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("uc_cart", JSON.stringify(items));
  };

  const addToCart = (service: Omit<CartItem, "quantity">) => {
    const existingIndex = cartItems.findIndex((item) => item.id === service.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cartItems, { ...service, quantity: 1 }];
    }
    saveCart(updated);
    toast.success(`${service.name} added to cart!`);
  };

  const removeFromCart = (serviceId: number) => {
    const updated = cartItems.filter((item) => item.id !== serviceId);
    saveCart(updated);
  };

  const updateQuantity = (serviceId: number, qty: number) => {
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

  const applyCoupon = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    if (uppercaseCode === "FIRST20") {
      const couponObj: Coupon = { code: "FIRST20", type: "PERCENT", value: 20 };
      setCoupon(couponObj);
      localStorage.setItem("uc_coupon", JSON.stringify(couponObj));
      toast.success("Coupon applied! 20% off");
      return true;
    } else if (uppercaseCode === "SAVE50") {
      const couponObj: Coupon = { code: "SAVE50", type: "FLAT", value: 50 };
      setCoupon(couponObj);
      localStorage.setItem("uc_coupon", JSON.stringify(couponObj));
      toast.success("Coupon applied! ₹50 flat off");
      return true;
    } else if (uppercaseCode === "UC100") {
      const couponObj: Coupon = { code: "UC100", type: "FLAT", value: 100 };
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
