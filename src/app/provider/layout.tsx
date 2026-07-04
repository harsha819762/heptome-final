"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useFirebaseAuth } from "@/context/FirebaseAuthProvider";
import { updateUserProfile } from "@dataconnect/generated";
import {
  IoSpeedometerOutline, IoListOutline, IoPersonOutline,
  IoLogOutOutline, IoBuildOutline, IoCheckmarkCircleSharp,
} from "react-icons/io5";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const SERVICE_CATEGORIES = [
  { id: "BARBER", name: "Men's Salon & Massage" },
  { id: "BEAUTICIAN", name: "Women's Salon & Spa" },
  { id: "AC_REPAIR", name: "AC Repair & Service" },
  { id: "CLEANER", name: "Cleaning & Pest Control" },
  { id: "ELECTRICIAN", name: "Electrician Services" },
  { id: "PLUMBER", name: "Plumber Services" },
];

function ProviderShell({ children, profile, signOut }: { children: React.ReactNode; profile: any; signOut: () => Promise<void> }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-[#1A1A2E]">
      <aside className="w-full md:w-64 bg-gray-900 text-gray-400 shrink-0 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm">H</div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">Heptome</span>
              <span className="block text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-none mt-1">Provider Portal</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1 text-xs font-bold">
            {[
              { name: "Dashboard", href: "/provider", icon: <IoSpeedometerOutline /> },
              { name: "Jobs Board", href: "/provider/jobs", icon: <IoListOutline /> },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-[#2563EB] text-white" : "hover:bg-gray-800 hover:text-white"}`}>
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <img src={profile?.avatarUrl || "https://i.pravatar.cc/150"} alt={profile?.name || "Provider"}
              className="w-9 h-9 rounded-xl object-cover border border-gray-700 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white leading-none line-clamp-1">{profile?.name || "Demo Provider"}</p>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide leading-none mt-1 block">Active Partner</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-800 hover:text-white rounded-xl py-2 px-3 text-[10px] font-extrabold text-gray-400 transition-colors">
              ← Client Mode
            </Link>
            <button onClick={async () => { await signOut(); router.push("/login"); }}
              className="flex items-center justify-center gap-2 bg-red-950/20 border border-red-900/30 hover:bg-red-900/20 text-red-400 rounded-xl py-2 px-3 text-[10px] font-extrabold transition-colors cursor-pointer">
              <IoLogOutOutline /> Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sm:px-8">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#1A1A2E] tracking-tight capitalize">
              {pathname === "/provider" ? "Partner Dashboard" : pathname.replace("/provider/", "").replace("-", " ")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full border border-blue-100 text-[10px] font-black shrink-0">
              <IoCheckmarkCircleSharp />
              <span>Verified Account</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading, signOut, refreshProfile } = useFirebaseAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [serviceType, setServiceType] = useState("CLEANER");
  const [experience, setExperience] = useState("3");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isOnboardingSubmit, setIsOnboardingSubmit] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <ProviderShell profile={null} signOut={signOut}>{children}</ProviderShell>;
  }

  const isProvider = profile?.role === "PROVIDER" || profile?.role === "ADMIN";

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !experience) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsOnboardingSubmit(true);
    toast.loading("Submitting application...", { id: "onboard" });

    try {
      await updateUserProfile({
        id: user.uid,
        name: profile?.name || undefined,
        phoneNumber: phone,
        address,
        avatarUrl: profile?.avatarUrl || undefined,
      });

      await refreshProfile();

      toast.success("Welcome aboard! Your provider profile is ready.", { id: "onboard" });
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: "onboard" });
    } finally {
      setIsOnboardingSubmit(false);
    }
  };

  if (!isProvider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-[#2563EB] mx-auto text-2xl mb-4">
              <IoBuildOutline />
            </div>
            <h2 className="text-2xl font-black text-[#1A1A2E]">Be a Service Partner</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">Register your services and start earning today</p>
          </div>

          <form onSubmit={handleOnboardSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Skill Category</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] bg-white outline-none focus:border-[#2563EB]">
                  {SERVICE_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Experience (Years)</label>
                <input type="number" required min={0} max={40} value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
                <input type="tel" required maxLength={10} pattern="[0-9]{10}" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Base Location / City</label>
                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bio</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2563EB]" />
            </div>
            <button type="submit" disabled={isOnboardingSubmit || !phone || !experience}
              className="w-full bg-[#2563EB] text-white rounded-xl py-3.5 mt-2 font-bold text-sm">
              {isOnboardingSubmit ? "Registering..." : "Submit Application"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs font-semibold text-[#2563EB] hover:underline">← Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <ProviderShell profile={profile} signOut={signOut}>{children}</ProviderShell>;
}
