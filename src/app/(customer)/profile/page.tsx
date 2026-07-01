"use client";

import React, { useState, useEffect } from "react";
import { useFirebaseAuth } from "@/context/FirebaseAuthProvider";
import { useBookingStore } from "@/store/useBookingStore";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@dataconnect/generated";
import { motion } from "framer-motion";
import {
  IoPersonOutline, IoLocationOutline, IoPricetagOutline, IoPencilOutline,
  IoAddOutline, IoTrashOutline, IoCameraOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const AVAILABLE_COUPONS = [
  { code: "FIRST20", desc: "Get 20% off on your first service booking.", minBilling: "₹199", maxDiscount: "₹200", validTill: "31 Dec 2026" },
  { code: "SAVE50", desc: "Get flat ₹50 off on any service booking.", minBilling: "₹299", maxDiscount: "₹50", validTill: "31 Dec 2026" },
  { code: "UC100", desc: "Get flat ₹100 off on services above ₹500.", minBilling: "₹499", maxDiscount: "₹100", validTill: "31 Dec 2026" },
];

export default function ProfilePage() {
  const { user, profile, isLoading, refreshProfile } = useFirebaseAuth();
  const { bookings } = useBookingStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [flatNo, setFlatNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [pincode, setPincode] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phoneNumber || "");
    }
  }, [profile]);

  useEffect(() => {
    const stored = localStorage.getItem("uc_saved_addresses");
    if (stored) {
      try { setAddresses(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) { toast.error("Please fill required fields"); return; }

    toast.loading("Saving profile...", { id: "profile-update" });
    try {
      await updateUserProfile({
        id: user!.uid,
        name,
        phoneNumber: phone || null,
      });

      await refreshProfile();
      setIsEditing(false);
      toast.success("Profile updated successfully", { id: "profile-update" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: "profile-update" });
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo || !street || !city || !pincode) { toast.error("Fill all fields"); return; }
    const newAddr = { id: Date.now(), flatNo, street, city, pincode };
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    localStorage.setItem("uc_saved_addresses", JSON.stringify(updated));
    setFlatNo(""); setStreet(""); setPincode(""); setIsAddingAddress(false);
    toast.success("Address added successfully");
  };

  const handleDeleteAddress = (id: number) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("uc_saved_addresses", JSON.stringify(updated));
    toast.success("Address deleted");
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    router.push("/login?callbackUrl=/profile");
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-0 py-4 space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">Profile Settings</h2>
        <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">Manage your identity, addresses, and view offers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#F9FAFB] border border-gray-200 rounded-3xl p-6 text-center space-y-4 shadow-sm">
            <div className="relative inline-block mx-auto group">
              <img src={profile.avatarUrl || "https://i.pravatar.cc/150"} alt={profile.name || "User"}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
              <button
                className="absolute bottom-0 right-0 p-2 bg-[#2563EB] text-white rounded-full border-2 border-white hover:bg-[#1D4ED8] transition-colors cursor-pointer">
                <IoCameraOutline className="text-xs" />
              </button>
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#1A1A2E]">{profile.name}</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">{phone || profile.email}</p>
            </div>
            <div className="border-t pt-4 text-xs font-semibold text-gray-500 flex justify-around">
              <div>
                <span className="text-[9px] text-gray-400 uppercase font-black">Bookings</span>
                <p className="text-[#1A1A2E] font-bold text-sm mt-1">{bookings.length}</p>
              </div>
              <div className="border-r border-gray-200" />
              <div>
                <span className="text-[9px] text-gray-400 uppercase font-black">Addresses</span>
                <p className="text-[#1A1A2E] font-bold text-sm mt-1">{addresses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col text-xs font-bold text-gray-500">
            {[
              { key: "profile", label: "Personal Details", icon: <IoPersonOutline /> },
              { key: "addresses", label: "Manage Addresses", icon: <IoLocationOutline /> },
              { key: "coupons", label: "My Coupons", icon: <IoPricetagOutline /> },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors border-l-4 cursor-pointer ${
                  activeTab === tab.key ? "border-[#2563EB] text-[#2563EB] bg-blue-50/10 font-black" : "border-transparent hover:bg-gray-50"
                }`}>
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-[#F9FAFB] border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm h-fit">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-extrabold text-base text-[#1A1A2E]">Personal Details</h3>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">
                    <IoPencilOutline /> Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                      <input type="email" required value={email} disabled
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-400 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
                      <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setName(profile.name || ""); setEmail(profile.email); setPhone(profile.phoneNumber || ""); setIsEditing(false); }}
                      className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl py-2.5 text-xs cursor-pointer">Cancel</button>
                    <button type="submit" className="flex-1 bg-[#2563EB] text-white rounded-xl py-2.5 text-xs font-bold cursor-pointer">Save Details</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-gray-500">
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-400 font-black uppercase">Full Name</span>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{profile.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-400 font-black uppercase">Email</span>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{profile.email}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-400 font-black uppercase">Phone</span>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{phone || "Not set"}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-extrabold text-base text-[#1A1A2E]">Manage Addresses</h3>
                {!isAddingAddress && (
                  <button onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">
                    <IoAddOutline /> Add Address
                  </button>
                )}
              </div>
              {isAddingAddress && (
                <form onSubmit={handleAddAddressSubmit} className="space-y-4 p-4 bg-white border rounded-2xl shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Flat / Building</label>
                      <input type="text" required value={flatNo} onChange={(e) => setFlatNo(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Street</label>
                      <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">City</label>
                      <select value={city} onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none">
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Pincode</label>
                      <input type="text" required maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsAddingAddress(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-2 text-xs cursor-pointer">Cancel</button>
                    <button type="submit" className="flex-1 bg-[#2563EB] text-white rounded-xl py-2 text-xs font-bold cursor-pointer">Save Address</button>
                  </div>
                </form>
              )}
              {addresses.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold italic text-center py-6">No saved addresses found.</p>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl">
                    <div className="space-y-1 text-xs font-semibold">
                      <h4 className="text-[#1A1A2E] font-bold">{addr.flatNo}</h4>
                      <p className="text-gray-400">{addr.street}</p>
                      <p className="text-gray-500 font-bold">{addr.city} - {addr.pincode}</p>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl cursor-pointer">
                      <IoTrashOutline className="text-base" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-extrabold text-base text-[#1A1A2E]">Available Coupons</h3>
              </div>
              {AVAILABLE_COUPONS.map((cop) => (
                <div key={cop.code} className="border-2 border-dashed border-[#2563EB]/40 bg-blue-50/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-block bg-[#2563EB] text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg">{cop.code}</span>
                    <p className="text-xs text-[#1A1A2E] font-bold mt-1">{cop.desc}</p>
                    <p className="text-[10px] font-bold text-gray-400">Min: {cop.minBilling} | Max Disc: {cop.maxDiscount}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(cop.code); toast.success(`Copied ${cop.code}!`); }}
                    className="border border-[#2563EB] hover:bg-[#2563EB] text-[#2563EB] hover:text-white rounded-xl text-[10px] font-extrabold px-4 py-2 transition-colors cursor-pointer">
                    Copy Code
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
