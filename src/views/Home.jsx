"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { servicesData, professionalsData } from "../data/servicesData";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoShieldCheckmarkOutline, IoPricetagOutline, IoTimeOutline, 
  IoStar, IoChevronDownOutline, IoSearchOutline, IoSparklesOutline 
} from "react-icons/io5";

// Mock FAQs
const FAQS = [
  { q: "How do I book a service on Heptome?", a: "Simply browse our categories, add your preferred services to the cart, choose a suitable date and time slot, select a professional, and confirm your booking. You can pay online or in cash after the service." },
  { q: "Are the service professionals verified?", a: "Yes, 100% of our professionals undergo background checks, criminal record checks, and intensive practical training before they are allowed to serve customers." },
  { q: "What is your cancellation policy?", a: "You can cancel or reschedule any booking for free up to 4 hours before the scheduled service time. Cancellations within 4 hours may attract a nominal fee of ₹100." },
  { q: "Is there a warranty on the services provided?", a: "Yes, we provide a free 30-day warranty on all service repairs and installations. If something goes wrong, we will fix it at no extra cost." },
  { q: "How are prices calculated?", a: "Our pricing is transparent and standardized based on service type, duration, and materials required. There are no hidden fees. The final service fee is shown before you book." },
  { q: "What payment options are available?", a: "We support UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Cash-on-Delivery (pay after service)." },
  { q: "Can I choose my preferred professional?", a: "Yes! During step 3 of the booking flow, you can view the ratings, experience, and pricing of different available professionals in your city and choose the one you prefer." },
  { q: "Do you provide emergency/same-day bookings?", a: "Yes, we offer slots starting within 60 minutes of booking, subject to professional availability in your locality." }
];

// Mock Reviews
const REVIEWS = [
  { id: 1, name: "Suresh Pillai", rating: 5, date: "June 18, 2026", service: "AC Service & Cleaning", text: "Outstanding service! The professional arrived on time, wore a mask, and cleaned the AC thoroughly. It feels like a brand new AC now. Highly recommended!" },
  { id: 2, name: "Ananya Deshmukh", rating: 5, date: "June 15, 2026", service: "Full Body Massage", text: "The massage therapist Priya was extremely skilled and polite. It was a very relaxing 90 minutes. Will definitely book again next month!" },
  { id: 3, name: "Karan Johar", rating: 4, date: "June 10, 2026", service: "Home Deep Cleaning", text: "Cleaners did a great job. They cleaned every corner of the house, kitchen cabinets, and bathrooms. Capping it at 4 stars only because they arrived 15 mins late." }
];

// Auto-incrementing counter component
function Counter({ targetValue, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / targetValue));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= targetValue) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [selectedPro, setSelectedPro] = useState(null);
  const [searchVal, setSearchVal] = useState("");

  // Gather all services across categories for most booked section
  const mostBooked = servicesData
    .flatMap((cat) => cat.services.map((s) => ({ ...s, catId: cat.id })))
    .filter((s) => s.rating >= 4.7)
    .slice(0, 5);

  const toggleFaq = (index) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    // Redirect to services search page
    navigate(`/services/1?q=${encodeURIComponent(searchVal)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-20 pb-16"
    >
      
      {/* SECTION 1: HERO */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-blue-50/10 to-white py-16 sm:py-24 px-6 sm:px-12 shadow-sm border border-blue-50">
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-[#1A1A2E] tracking-tight leading-tight"
          >
            Home Services at <br />
            <span className="text-[#2563EB]">Your Doorstep</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium"
          >
            Book high-rated professionals for salon, massage, cleaning, AC repairs, plumbing, and electrical installations in 60 minutes.
          </motion.p>

          {/* Search Form */}
          <motion.form 
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center bg-white border border-slate-200 shadow-xl rounded-2xl p-2.5 max-w-xl mx-auto focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-transparent transition-all"
          >
            <div className="flex items-center gap-2 pl-3 flex-1">
              <IoSearchOutline className="text-slate-400 text-xl shrink-0" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search for 'waxing', 'AC repair', 'haircut'..."
                className="w-full text-xs font-semibold text-[#1A1A2E] placeholder-slate-400 bg-transparent outline-none border-none"
              />
            </div>
            <button type="submit" className="btn-primary py-2.5 px-6 text-xs whitespace-nowrap">
              Search
            </button>
          </motion.form>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4 text-xs font-bold text-slate-600"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-xs">
              <IoShieldCheckmarkOutline className="text-[#2563EB] text-base" />
              <span>✓ Verified Pros</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-xs">
              <IoPricetagOutline className="text-[#2563EB] text-base" />
              <span>✓ Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-xs">
              <IoTimeOutline className="text-[#2563EB] text-base" />
              <span>✓ On-time Service</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: OFFERS CAROUSEL */}
      <section className="-mt-8 overflow-hidden">
        <div className="relative flex items-center">
          <div className="animate-marquee flex gap-6 py-2 whitespace-nowrap hover:[animation-play-state:paused]">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="inline-flex flex-col justify-center bg-gradient-to-r from-[#2563EB] to-[#f59e0b] text-white px-8 py-5 rounded-2xl shadow-md min-w-[280px] sm:min-w-[340px]"
              >
                <span className="text-[10px] font-black tracking-widest uppercase opacity-75">Special Offer</span>
                <h4 className="font-extrabold text-sm sm:text-base mt-1">20% off first booking | Use: FIRST20</h4>
                <p className="text-[10px] font-medium opacity-90 mt-1">Applicable on all beauty & home services.</p>
              </div>
            ))}
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={`dup-${i}`} 
                className="inline-flex flex-col justify-center bg-gradient-to-r from-[#2563EB] to-[#f59e0b] text-white px-8 py-5 rounded-2xl shadow-md min-w-[280px] sm:min-w-[340px]"
              >
                <span className="text-[10px] font-black tracking-widest uppercase opacity-75">Special Offer</span>
                <h4 className="font-extrabold text-sm sm:text-base mt-1">20% off first booking | Use: FIRST20</h4>
                <p className="text-[10px] font-medium opacity-90 mt-1">Applicable on all beauty & home services.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">What are you looking for?</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Choose from our top-rated home services</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {servicesData.map((cat) => (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              key={cat.id}
              onClick={() => navigate(`/services/${cat.id}`)}
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-b-4 hover:border-b-[#2563EB] cursor-pointer flex flex-col items-center justify-between text-center min-h-[180px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-3xl mb-4">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#1A1A2E] leading-tight line-clamp-1">{cat.category}</h3>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <IoStar className="text-[#F59E0B] text-xs" />
                  <span className="text-[10px] font-bold text-[#1A1A2E]">{cat.rating}</span>
                  <span className="text-[10px] text-slate-400 font-medium">({cat.totalBookings})</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: MOST BOOKED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">Most Booked Services</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Highly-requested options serving this week</p>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 overflow-y-hidden snap-x">
          {mostBooked.map((srv) => {
            const cartItem = cartItems.find((item) => item.id === srv.id);
            return (
              <motion.div
                key={srv.id}
                whileHover={{ y: -5 }}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 snap-start shrink-0 w-[240px] sm:w-[280px] flex flex-col"
              >
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#1A1A2E] leading-snug line-clamp-1">
                      {srv.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-semibold">
                      <span>{srv.duration}</span>
                      <span>•</span>
                      <div className="flex items-center text-[#F59E0B] gap-0.5">
                        <IoStar />
                        <span>{srv.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <span className="font-bold text-base text-[#1A1A2E]">₹{srv.price}</span>
                    
                    {cartItem ? (
                      <div className="flex items-center border border-[#2563EB] bg-blue-50/30 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(srv.id, cartItem.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-blue-50 active:scale-90 transition-transform"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#1A1A2E]">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(srv.id, cartItem.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-blue-50 active:scale-90 transition-transform"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(srv)}
                        className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-xl font-bold px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-0">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">How It Works</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Get your service completed in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Dashed Connecting Line for Desktop */}
          <div className="absolute top-10 left-[15%] right-[15%] h-0.5 border-t border-dashed border-slate-200 hidden md:block z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-20 h-20 bg-white border-2 border-[#2563EB] rounded-full flex items-center justify-center text-2xl font-black text-[#2563EB] shadow-md">
              1
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A2E]">Choose Service</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-semibold">
              Explore custom packages and select the exact beauty or repair services you need.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-20 h-20 bg-white border-2 border-[#2563EB] rounded-full flex items-center justify-center text-2xl font-black text-[#2563EB] shadow-md">
              2
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A2E]">Pick Time & Date</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-semibold">
              Schedule your booking at any convenient slot over the next 7 days.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-20 h-20 bg-white border-2 border-[#2563EB] rounded-full flex items-center justify-center text-2xl font-black text-[#2563EB] shadow-md">
              3
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A2E]">Expert at Door</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-semibold">
              Our verified, equipped service partner arrives on time and completes the job.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6: STATS COUNTER */}
      <section className="bg-slate-900 text-white rounded-3xl py-12 px-6 sm:px-12 shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
              <Counter targetValue={50} suffix="M+" />
            </h3>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">Bookings Completed</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
              <Counter targetValue={30} suffix="K+" />
            </h3>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">Verified Partners</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
              <Counter targetValue={4} suffix=".8★" />
            </h3>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">Average Rating</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
              <Counter targetValue={100} suffix="+" />
            </h3>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">Cities Served</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: PROFESSIONALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">Top Professionals Near You</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Book highly rated local specialists directly</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 overflow-y-hidden snap-x">
          {professionalsData.map((pro) => (
            <motion.div
              key={pro.id}
              whileHover={{ y: -5 }}
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 snap-start shrink-0 w-[240px] sm:w-[260px] flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={pro.photo}
                  alt={pro.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1A1A2E] leading-tight">{pro.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{pro.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 my-4 text-[10px] font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Rating</span>
                  <span className="text-[#F59E0B] font-bold flex items-center gap-0.5">
                    <IoStar className="text-[9px]" /> {pro.rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Experience</span>
                  <span className="text-[#1A1A2E] font-bold">{pro.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jobs Completed</span>
                  <span className="text-[#1A1A2E] font-bold">{pro.completedJobs}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-auto">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Starting at</span>
                  <span className="font-bold text-xs text-[#1A1A2E] leading-none">₹{pro.price}/hr</span>
                </div>
                <button
                  onClick={() => setSelectedPro(pro)}
                  className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-xl text-[10px] font-extrabold px-3 py-1.5 transition-all duration-200 cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 8: REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">Customer Reviews</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Read honest feedback from verified users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[200px]"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1A1A2E] leading-none">{rev.name}</h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">{rev.date}</span>
                  </div>
                  <div className="flex text-[#F59E0B] gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <IoStar key={i} className="text-xs" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">&ldquo;{rev.text}&rdquo;</p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-4">
                <span>{rev.service}</span>
                <span className="text-blue-600 flex items-center gap-0.5 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  ✓ Verified User
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Got questions? We have answers</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div key={idx} className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left px-5 py-4 bg-[#F9FAFB] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#1A1A2E]">{faq.q}</span>
                  <IoChevronDownOutline 
                    className={`text-slate-400 text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 py-4 border-t border-[#E5E7EB] bg-white text-xs leading-relaxed text-slate-500 font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROFESSIONAL DETAILS MODAL */}
      <AnimatePresence>
        {selectedPro && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={() => setSelectedPro(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10 text-center"
            >
              <button
                onClick={() => setSelectedPro(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <IoChevronDownOutline className="text-xl rotate-90 text-slate-500" />
              </button>

              <img
                src={selectedPro.photo}
                alt={selectedPro.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#2563EB] mx-auto mb-4"
              />

              <h3 className="text-lg font-black text-[#1A1A2E]">{selectedPro.name}</h3>
              <p className="text-xs text-[#2563EB] font-bold mt-0.5 uppercase tracking-wider">{selectedPro.specialty} Specialist</p>
              
              <div className="flex items-center justify-center gap-1 mt-2 text-[#F59E0B] text-xs">
                <IoStar />
                <span className="font-extrabold text-[#1A1A2E]">{selectedPro.rating}</span>
                <span className="text-slate-400 font-bold">({selectedPro.completedJobs} bookings)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 my-6 py-4 text-xs font-semibold text-slate-500">
                <div className="text-left space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-black">Experience</p>
                  <p className="text-[#1A1A2E] font-bold">{selectedPro.experience}</p>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-black">City</p>
                  <p className="text-[#1A1A2E] font-bold">{selectedPro.city}</p>
                </div>
                <div className="text-left space-y-1 col-span-2">
                  <p className="text-[10px] text-slate-400 uppercase font-black">Availability</p>
                  <p className={`font-bold flex items-center gap-1 ${selectedPro.availability ? "text-blue-600" : "text-red-500"}`}>
                    <span className={`w-2 h-2 rounded-full ${selectedPro.availability ? "bg-blue-500 animate-pulse" : "bg-red-500"}`} />
                    {selectedPro.availability ? "Available for Bookings" : "Fully Booked Today"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Hourly rate</span>
                  <span className="font-extrabold text-base text-[#1A1A2E]">₹{selectedPro.price}/hr</span>
                </div>
                <button
                  disabled={!selectedPro.availability}
                  onClick={() => {
                    setSelectedPro(null);
                    toast.success(`Select ${selectedPro.name} in step 3 of checkout!`);
                  }}
                  className={`btn-primary px-6 py-2.5 text-xs ${!selectedPro.availability ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Book Professional
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
