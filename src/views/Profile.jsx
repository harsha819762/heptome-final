"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  IoPersonOutline, IoLocationOutline, IoPricetagOutline, IoPencilOutline, 
  IoCheckmarkOutline, IoAddOutline, IoTrashOutline, IoCameraOutline 
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const AVAILABLE_COUPONS = [
  { code: "FIRST20", desc: "Get 20% off on your first service booking.", minBilling: "₹199", maxDiscount: "₹200", validTill: "31 Dec 2026" },
  { code: "SAVE50", desc: "Get flat ₹50 off on any service booking.", minBilling: "₹299", maxDiscount: "₹50", validTill: "31 Dec 2026" },
  { code: "UC100", desc: "Get flat ₹100 off on services above ₹500.", minBilling: "₹499", maxDiscount: "₹100", validTill: "31 Dec 2026" }
];

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const { bookings } = useBooking();
  const navigate = useNavigate();

  // Local State
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "addresses" | "coupons"
  
  // Profile editing
  const [name, setName] = useState(user?.name || "Harsha Vardhan");
  const [email, setEmail] = useState(user?.email || "harsha@example.com");
  const [phone, setPhone] = useState(user?.phone || "9876543210");
  const [isEditing, setIsEditing] = useState(false);

  // Address editing
  const [addresses, setAddresses] = useState([]);
  const [flatNo, setFlatNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [pincode, setPincode] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Load addresses on mount
  useEffect(() => {
    const stored = localStorage.getItem("uc_saved_addresses");
    if (stored) {
      setAddresses(JSON.parse(stored));
    }
  }, []);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill all profile fields");
      return;
    }
    updateUserProfile({ name, email, phone });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!flatNo || !street || !city || !pincode) {
      toast.error("Please fill all address fields");
      return;
    }
    const newAddr = { id: Date.now(), flatNo, street, city, pincode };
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    localStorage.setItem("uc_saved_addresses", JSON.stringify(updated));
    
    // Reset Form
    setFlatNo("");
    setStreet("");
    setPincode("");
    setIsAddingAddress(false);
    toast.success("Address added successfully");
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("uc_saved_addresses", JSON.stringify(updated));
    toast.success("Address deleted");
  };

  const handleAvatarChange = () => {
    const mockAvatars = [
      "https://randomuser.me/api/portraits/men/44.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/11.jpg",
      "https://randomuser.me/api/portraits/women/11.jpg"
    ];
    const nextAv = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    updateUserProfile({ avatar: nextAv });
    toast.success("Avatar updated!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-0 py-4 space-y-8"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">Profile Settings</h2>
        <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Manage your identity, addresses, and view discount offers</p>
      </div>

      {/* Main Grid: Sidebar Profile summary + Tab Contents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Card & Tab Links */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 text-center space-y-4 shadow-sm">
            <div className="relative inline-block mx-auto group">
              <img
                src={user?.avatar || "https://i.pravatar.cc/150"}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
              />
              <button 
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 p-2 bg-[#2563EB] text-white rounded-full border-2 border-white hover:bg-[#1D4ED8] transition-colors shadow-sm cursor-pointer"
                title="Change Avatar"
              >
                <IoCameraOutline className="text-xs" />
              </button>
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#1A1A2E]">{user?.name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">{user?.phone}</p>
            </div>

            <div className="border-t pt-4 text-xs font-semibold text-slate-500 flex justify-around">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black">Bookings</span>
                <p className="text-[#1A1A2E] font-bold text-sm mt-1">{bookings.length}</p>
              </div>
              <div className="border-r border-slate-200" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black">Addresses</span>
                <p className="text-[#1A1A2E] font-bold text-sm mt-1">{addresses.length}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col text-xs font-bold text-slate-500">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors border-l-4 cursor-pointer ${
                activeTab === "profile" 
                  ? "border-[#2563EB] text-[#2563EB] bg-blue-50/10 font-black" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <IoPersonOutline className="text-base" />
              <span>Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors border-l-4 cursor-pointer ${
                activeTab === "addresses" 
                  ? "border-[#2563EB] text-[#2563EB] bg-blue-50/10 font-black" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <IoLocationOutline className="text-base" />
              <span>Manage Addresses</span>
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors border-l-4 cursor-pointer ${
                activeTab === "coupons" 
                  ? "border-[#2563EB] text-[#2563EB] bg-blue-50/10 font-black" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <IoPricetagOutline className="text-base" />
              <span>My Coupons</span>
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full text-left px-5 py-4 flex items-center gap-3 transition-colors hover:bg-slate-50"
            >
              <IoPersonOutline className="text-base" />
              <span>My Bookings</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="md:col-span-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm h-fit">
          
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-extrabold text-base text-[#1A1A2E]">Personal Details</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <IoPencilOutline /> Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setName(user?.name);
                        setEmail(user?.email);
                        setPhone(user?.phone);
                        setIsEditing(false);
                      }}
                      className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary py-2.5 text-xs"
                    >
                      Save Details
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-slate-500">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Full Name</span>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Email Address</span>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Phone Number</span>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{user?.phone}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-extrabold text-base text-[#1A1A2E]">Manage Addresses</h3>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <IoAddOutline /> Add Address
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddressSubmit} className="space-y-4 p-4 bg-white border rounded-2xl shadow-xs">
                  <h4 className="text-xs font-bold text-[#1A1A2E] uppercase">New Address Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Flat / Building No</label>
                      <input
                        type="text"
                        required
                        value={flatNo}
                        onChange={(e) => setFlatNo(e.target.value)}
                        placeholder="e.g. Flat 304, Tower B"
                        className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Street / Locality</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. MG Road, Sector 5"
                        className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none"
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        placeholder="e.g. 400001"
                        className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-2 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary py-2 text-xs"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses list */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold italic text-center py-6">No saved addresses found. Add one above.</p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-xs"
                    >
                      <div className="space-y-1 text-xs font-semibold">
                        <h4 className="text-[#1A1A2E] font-bold">{addr.flatNo}</h4>
                        <p className="text-slate-400 font-medium leading-snug">{addr.street}</p>
                        <p className="text-slate-400 font-bold">{addr.city} - {addr.pincode}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                        title="Delete Address"
                      >
                        <IoTrashOutline className="text-base" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-extrabold text-base text-[#1A1A2E]">Available Coupons</h3>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-1">Copy and apply these coupon codes during checkout to save money</p>
              </div>

              <div className="space-y-4">
                {AVAILABLE_COUPONS.map((cop) => (
                  <div
                    key={cop.code}
                    className="border-2 border-dashed border-[#2563EB]/40 bg-blue-50/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#2563EB] transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="inline-block bg-[#2563EB] text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg tracking-widest shadow-xs">
                        {cop.code}
                      </div>
                      <p className="text-xs text-[#1A1A2E] font-bold mt-1 leading-normal">{cop.desc}</p>
                      <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                        <span>Min Billing: {cop.minBilling}</span>
                        <span>Max Disc: {cop.maxDiscount}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cop.code);
                        toast.success(`Coupon code ${cop.code} copied!`);
                      }}
                      className="border border-[#2563EB] hover:bg-[#2563EB] text-[#2563EB] hover:text-white rounded-xl text-[10px] font-extrabold px-4 py-2 transition-colors cursor-pointer w-full sm:w-auto text-center"
                    >
                      Copy Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </motion.div>
  );
}
