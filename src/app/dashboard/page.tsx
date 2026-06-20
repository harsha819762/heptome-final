"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  MapPin,
  Star,
  Settings,
  LogOut,
  Home,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const quickStats = [
    {
      icon: Calendar,
      label: "Total Bookings",
      value: "0",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: "0",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Clock,
      label: "Pending",
      value: "0",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Star,
      label: "Reviews",
      value: "0",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const quickLinks = [
    { icon: Home, label: "Browse Services", href: "/", color: "text-blue-600" },
    {
      icon: Calendar,
      label: "My Bookings",
      href: "/my-bookings",
      color: "text-green-600",
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      href: "/profile",
      color: "text-orange-600",
    },
    {
      icon: Settings,
      label: "Account Settings",
      href: "/profile",
      color: "text-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-black">
            Heptome
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold overflow-hidden">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                session.user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session.user?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-gray-500">{session.user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div
                className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
              >
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                <link.icon
                  size={24}
                  className={`${link.color} mb-3 group-hover:scale-110 transition-transform`}
                />
                <p className="text-sm font-medium text-gray-700">
                  {link.label}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity (empty state) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-400 mb-4">
              Book your first home service to get started!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              <Home size={16} />
              Browse Services
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
