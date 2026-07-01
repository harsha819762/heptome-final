"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useFirebaseAuth } from "@/context/FirebaseAuthProvider";
import { motion } from "framer-motion";
import {
  User, Calendar, MapPin, Star, Settings, LogOut, Home, Clock, CheckCircle, Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { user, profile, isLoading, signOut } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  if (!user || !profile) return null;

  const quickStats = [
    { icon: Calendar, label: "Total Bookings", value: "0", color: "bg-blue-50 text-blue-600" },
    { icon: CheckCircle, label: "Completed", value: "0", color: "bg-green-50 text-green-600" },
    { icon: Clock, label: "Pending", value: "0", color: "bg-yellow-50 text-yellow-600" },
    { icon: Star, label: "Reviews", value: "0", color: "bg-purple-50 text-purple-600" },
  ];

  const quickLinks = [
    { icon: Home, label: "Browse Services", href: "/", color: "text-blue-600" },
    { icon: Calendar, label: "My Bookings", href: "/my-bookings", color: "text-green-600" },
    { icon: MapPin, label: "Saved Addresses", href: "/profile", color: "text-orange-600" },
    { icon: Settings, label: "Account Settings", href: "/profile", color: "text-gray-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-black">Heptome</Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">Home</Link>
            <button onClick={() => { signOut(); router.push("/login"); }}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name || "User"} className="w-full h-full object-cover" />
              ) : (
                profile.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile.name?.split(" ")[0] || "User"}!</h1>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <link.icon size={24} className={`${link.color} mb-3 group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-medium text-gray-700">{link.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
