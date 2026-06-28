"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { servicesData } from "@/data/servicesData";
import { motion } from "framer-motion";
import { IoStar, IoFilterOutline, IoCartOutline, IoArrowForwardOutline } from "react-icons/io5";

export default function ServicesPage() {
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? (searchParams.get("q") || "") : "";

  const { cartItems, cartTotal, cartCount, addToCart, updateQuantity, setCartOpen } = useCart();

  // Find current category
  const category = servicesData.find((cat) => cat.id === parseInt(categoryId)) || servicesData[0];

  // Filters State
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]); // ratings selected
  const [sortBy, setSortBy] = useState("rating"); // "rating" | "price-asc" | "price-desc"
  const [filteredServices, setFilteredServices] = useState<any[]>([]);

  // Toggle ratings checkboxes
  const handleRatingChange = (ratingVal: string) => {
    if (selectedRatings.includes(ratingVal)) {
      setSelectedRatings(selectedRatings.filter((r) => r !== ratingVal));
    } else {
      setSelectedRatings([...selectedRatings, ratingVal]);
    }
  };

  // Run filters
  useEffect(() => {
    let services = [...category.services];

    // Search query from homepage search bar or live search
    if (searchQuery) {
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Filter
    services = services.filter((s) => s.price <= maxPrice);

    // Rating Filter
    if (selectedRatings.length > 0) {
      services = services.filter((s) => {
        const meetsAny = selectedRatings.some((r) => s.rating >= parseFloat(r));
        return meetsAny;
      });
    }

    // Sorting
    if (sortBy === "rating") {
      services.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-asc") {
      services.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      services.sort((a, b) => b.price - a.price);
    }

    setFilteredServices(services);
  }, [category, maxPrice, selectedRatings, sortBy, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-24 relative"
    >
      
      {/* Category Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white h-[200px] flex items-center p-8 sm:p-12 shadow-md">
        <div className="absolute inset-0 bg-black/45 z-10" />
        <img
          src={category.image}
          alt={category.category}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 space-y-2">
          <span className="text-3xl sm:text-4xl text-white font-extrabold">{category.category}</span>
          <p className="text-xs sm:text-sm text-slate-200 font-semibold flex items-center gap-1">
            <IoStar className="text-[#F59E0B]" /> {category.rating} • {category.totalBookings} Completed Bookings
          </p>
        </div>
      </section>

      {/* Main Grid: Sidebar + List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-extrabold text-sm text-[#1A1A2E] flex items-center gap-2">
              <IoFilterOutline /> Filters
            </h3>
            {(maxPrice < 2000 || selectedRatings.length > 0 || sortBy !== "rating") && (
              <button
                onClick={() => {
                  setMaxPrice(2000);
                  setSelectedRatings([]);
                  setSortBy("rating");
                }}
                className="text-[10px] font-bold text-[#2563EB] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-semibold text-[#1A1A2E] bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="rating">Popularity (Rating)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-[#2563EB]">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>₹100</span>
              <span>₹2000</span>
            </div>
          </div>

          {/* Rating Filters */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">
              Customer Rating
            </label>
            <div className="space-y-2.5 text-xs font-semibold text-[#1A1A2E]">
              {[4.8, 4.7, 4.6, 4.5].map((rate) => (
                <label key={rate} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rate.toString())}
                    onChange={() => handleRatingChange(rate.toString())}
                    className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="flex items-center gap-1">
                    {rate}★ & above
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Service Grid */}
        <main className="lg:col-span-3">
          {searchQuery && (
            <div className="mb-4 text-xs font-bold text-slate-500 bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-xl">
              Showing search results for &ldquo;{searchQuery}&rdquo; in {category.category}
            </div>
          )}

          {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl">
              <p className="text-slate-400 font-semibold text-sm">No services found matching filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((srv) => {
                const cartItem = cartItems.find((item) => item.id === srv.id);
                return (
                  <motion.div
                    key={srv.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <img
                        src={srv.image}
                        alt={srv.name}
                        onClick={() => router.push(`/service/${srv.id}`)}
                        className="w-full sm:w-28 h-28 object-cover rounded-xl border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      <div className="flex-1 space-y-1.5">
                        <h4 
                          onClick={() => router.push(`/service/${srv.id}`)}
                          className="font-bold text-[#1A1A2E] hover:text-[#2563EB] transition-colors cursor-pointer text-sm sm:text-base leading-snug"
                        >
                          {srv.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                          <span>{srv.duration}</span>
                          <span>•</span>
                          <span className="flex items-center text-[#F59E0B] gap-0.5">
                            <IoStar /> {srv.rating} ({srv.reviews} reviews)
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed line-clamp-2">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border-t border-slate-100 p-4 px-5 flex items-center justify-between mt-auto">
                      <span className="font-extrabold text-base text-[#1A1A2E]">₹{srv.price}</span>
                      
                      {cartItem ? (
                        <div className="flex items-center border border-[#2563EB] bg-blue-50/30 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(srv.id, cartItem.quantity - 1)}
                            className="px-3.5 py-1.5 text-xs font-black text-[#2563EB] hover:bg-blue-50 active:scale-90 transition-transform"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-[#1A1A2E]">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(srv.id, cartItem.quantity + 1)}
                            className="px-3.5 py-1.5 text-xs font-black text-[#2563EB] hover:bg-blue-50 active:scale-90 transition-transform"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(srv)}
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold px-6 py-2 text-xs transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Sticky Bottom Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-2xl p-4 flex items-center justify-between max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] text-lg border border-blue-100 relative">
              <IoCartOutline />
              <span className="absolute -top-1.5 -right-1.5 bg-[#2563EB] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Items in Cart</p>
              <p className="font-extrabold text-sm text-[#1A1A2E] mt-1">₹{cartTotal} <span className="text-[10px] font-semibold text-slate-400">(incl. service fee)</span></p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <span>Proceed to Book</span>
            <IoArrowForwardOutline />
          </button>
        </div>
      )}

    </motion.div>
  );
}
