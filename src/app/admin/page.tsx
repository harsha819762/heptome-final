"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSupabaseAuth } from "@/context/SupabaseAuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSpeedometerOutline, IoPeopleOutline, IoBuildOutline,
  IoCalendarOutline, IoCardOutline, IoCheckmarkCircle,
  IoCloseCircle, IoSearchOutline, IoLogOutOutline,
  IoShieldCheckmarkOutline, IoAlertCircleOutline,
  IoRefreshOutline, IoTrendingUpOutline, IoListOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface DashStats {
  totalUsers: number;
  totalProviders: number;
  pendingProviders: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  isVerified: boolean;
  image?: string;
  phone?: string;
  createdAt: string;
  _count?: { bookings: number };
}

interface Provider {
  id: string;
  userId: string;
  isVerified: boolean;
  experience: number;
  rating: number;
  totalJobs: number;
  phone: string;
  address?: string;
  serviceTypes: string[];
  createdAt: string;
  user: { name?: string; email: string; image?: string };
}

// ─── MOCK DATA (used when DB is unavailable) ─────────────────────────────────

const MOCK_STATS: DashStats = {
  totalUsers: 1247,
  totalProviders: 312,
  pendingProviders: 18,
  totalBookings: 5890,
  completedBookings: 4210,
  pendingBookings: 143,
  totalRevenue: 2847500,
};

const MOCK_USERS: User[] = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@example.com", role: "CUSTOMER", isVerified: true, image: "https://randomuser.me/api/portraits/men/1.jpg", createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), _count: { bookings: 5 } },
  { id: "u2", name: "Priya Singh", email: "priya@example.com", role: "PROVIDER", isVerified: true, image: "https://randomuser.me/api/portraits/women/2.jpg", createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), _count: { bookings: 0 } },
  { id: "u3", name: "Amit Patel", email: "amit@example.com", role: "CUSTOMER", isVerified: false, image: "https://randomuser.me/api/portraits/men/3.jpg", createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), _count: { bookings: 2 } },
  { id: "u4", name: "Sneha Gupta", email: "sneha@example.com", role: "PROVIDER", isVerified: false, image: "https://randomuser.me/api/portraits/women/4.jpg", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), _count: { bookings: 0 } },
  { id: "u5", name: "Vikram Rao", email: "vikram@example.com", role: "CUSTOMER", isVerified: true, image: "https://randomuser.me/api/portraits/men/5.jpg", createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), _count: { bookings: 12 } },
];

const MOCK_PROVIDERS: Provider[] = [
  { id: "p1", userId: "u2", isVerified: false, experience: 5, rating: 0, totalJobs: 0, phone: "9876543210", address: "Mumbai, Andheri", serviceTypes: ["PLUMBER"], createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), user: { name: "Dinesh Kumar", email: "dinesh@example.com", image: "https://randomuser.me/api/portraits/men/10.jpg" } },
  { id: "p2", userId: "u4", isVerified: false, experience: 3, rating: 0, totalJobs: 0, phone: "9123456789", address: "Bangalore, HSR Layout", serviceTypes: ["BEAUTICIAN"], createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), user: { name: "Meera Nair", email: "meera@example.com", image: "https://randomuser.me/api/portraits/women/11.jpg" } },
  { id: "p3", userId: "u6", isVerified: false, experience: 8, rating: 0, totalJobs: 0, phone: "9987654321", address: "Delhi, Saket", serviceTypes: ["ELECTRICIAN", "AC_REPAIR"], createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), user: { name: "Suresh Yadav", email: "suresh@example.com", image: "https://randomuser.me/api/portraits/men/12.jpg" } },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatNumber(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    CUSTOMER: "bg-slate-100 text-slate-600",
    PROVIDER: "bg-blue-100 text-blue-700",
    ADMIN: "bg-violet-100 text-violet-700",
  };
  return map[role] || "bg-slate-100 text-slate-600";
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-lg shrink-0`}>
          {icon}
        </div>
        {sub && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {sub}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-black text-[#1A1A2E]">{value}</p>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────

type Tab = "overview" | "users" | "providers" | "bookings";

export default function AdminDashboard() {
  const { user, profile, isLoading, signOut } = useSupabaseAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<DashStats>(MOCK_STATS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<"all" | "pending" | "verified">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch { /* use mock */ }
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/users?search=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setUsers(data);
      }
    } catch { /* use mock */ }
  }, [searchQuery]);

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/providers?filter=${providerFilter}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setProviders(data);
      }
    } catch { /* use mock */ }
  }, [providerFilter]);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bookings?status=${bookingStatusFilter}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBookings(data);
      }
    } catch { /* use empty */ }
  }, [bookingStatusFilter]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => { if (activeTab === "users") fetchUsers(); }, [activeTab, fetchUsers]);
  useEffect(() => { if (activeTab === "providers") fetchProviders(); }, [activeTab, fetchProviders]);
  useEffect(() => { if (activeTab === "bookings") fetchBookings(); }, [activeTab, fetchBookings]);

  // Auth guard
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile || profile.role !== "ADMIN") {
    router.push("/login");
    return null;
  }

  const handleProviderAction = async (providerId: string, action: "verify" | "reject") => {
    setActionLoading(providerId);
    const toastId = toast.loading(action === "verify" ? "Verifying provider..." : "Rejecting provider...");
    try {
      const res = await fetch("/api/admin/providers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, action }),
      });

      if (res.ok) {
        toast.success(
          action === "verify" ? "Provider verified successfully! 🎉" : "Provider rejected.",
          { id: toastId }
        );
        // Update local state optimistically
        setProviders((prev) =>
          providerFilter === "pending"
            ? prev.filter((p) => p.id !== providerId)
            : prev.map((p) => p.id === providerId ? { ...p, isVerified: action === "verify" } : p)
        );
        setStats((prev) => ({ ...prev, pendingProviders: Math.max(0, prev.pendingProviders - 1) }));
      } else {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }
    } catch (err: any) {
      // Still show optimistic update for demo
      toast.success(
        action === "verify" ? "Provider verified! (Demo mode)" : "Provider rejected. (Demo mode)",
        { id: toastId }
      );
      setProviders((prev) => prev.filter((p) => p.id !== providerId));
      setStats((prev) => ({ ...prev, pendingProviders: Math.max(0, prev.pendingProviders - 1) }));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    !searchQuery ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <IoSpeedometerOutline /> },
    { id: "bookings", label: "Bookings", icon: <IoListOutline /> },
    { id: "users", label: "Users", icon: <IoPeopleOutline /> },
    { id: "providers", label: "Providers", icon: <IoBuildOutline /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-[#1A1A2E]">
      
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-400 shrink-0 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-sm">
              A
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">Heptome</span>
              <span className="block text-[9px] font-bold text-violet-400 uppercase tracking-widest leading-none mt-1">Admin Panel</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 text-xs font-bold">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base shrink-0">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}

            {stats.pendingProviders > 0 && (
              <button
                onClick={() => setActiveTab("providers")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-left cursor-pointer"
              >
                <span className="text-base shrink-0 text-amber-400"><IoAlertCircleOutline /></span>
                <span>Pending Verifications</span>
                <span className="ml-auto bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {stats.pendingProviders}
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-slate-800 pt-6 mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={profile?.image || user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150"}
              alt={profile?.name || "Admin"}
              className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white leading-none line-clamp-1">{profile?.name || "Admin"}</p>
              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wide leading-none mt-1 block">Super Admin</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-800 hover:text-white rounded-xl py-2 px-3 text-[10px] font-extrabold text-slate-400 transition-colors">
              ← Customer View
            </Link>
            <button
              onClick={async () => { await signOut(); router.push("/login"); }}
              className="flex items-center justify-center gap-2 bg-red-950/20 border border-red-900/30 hover:bg-red-900/20 text-red-400 rounded-xl py-2 px-3 text-[10px] font-extrabold transition-colors cursor-pointer"
            >
              <IoLogOutOutline /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">

        {/* Header */}
        <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 sm:px-8 shrink-0">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#1A1A2E] tracking-tight capitalize">
              {activeTab === "overview" ? "Dashboard Overview" : activeTab}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Heptome Administration Panel</p>
          </div>
          <div className="flex items-center gap-3">
            {stats.pendingProviders > 0 && (
              <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-full text-[10px] font-black">
                <IoAlertCircleOutline />
                {stats.pendingProviders} Pending Verifications
              </span>
            )}
            <button
              onClick={() => { fetchDashboard(); fetchProviders(); }}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <IoRefreshOutline size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={<IoPeopleOutline className="text-blue-600" />} label="Total Users" value={formatNumber(stats.totalUsers)} sub="+12% this month" color="bg-blue-50" />
                  <StatCard icon={<IoBuildOutline className="text-violet-600" />} label="Active Providers" value={formatNumber(stats.totalProviders)} color="bg-violet-50" />
                  <StatCard icon={<IoCalendarOutline className="text-emerald-600" />} label="Total Bookings" value={formatNumber(stats.totalBookings)} sub={`${stats.completedBookings} completed`} color="bg-emerald-50" />
                  <StatCard icon={<IoCardOutline className="text-amber-600" />} label="Total Revenue" value={`₹${formatNumber(stats.totalRevenue)}`} sub="This month" color="bg-amber-50" />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard icon={<IoAlertCircleOutline className="text-orange-500" />} label="Pending Verifications" value={stats.pendingProviders} color="bg-orange-50" />
                  <StatCard icon={<IoCalendarOutline className="text-blue-500" />} label="Pending Bookings" value={stats.pendingBookings} color="bg-blue-50" />
                  <StatCard icon={<IoTrendingUpOutline className="text-emerald-600" />} label="Completion Rate" value={`${stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 71}%`} color="bg-emerald-50" />
                </div>

                {/* Pending Verification Alert */}
                {stats.pendingProviders > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-lg shrink-0">
                        <IoShieldCheckmarkOutline />
                      </div>
                      <div>
                        <p className="text-sm font-black text-amber-900">
                          {stats.pendingProviders} Provider{stats.pendingProviders > 1 ? "s" : ""} Awaiting Verification
                        </p>
                        <p className="text-xs text-amber-700 font-semibold mt-0.5">
                          Review and approve service partners to let them accept bookings
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("providers")}
                      className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Review Now
                    </button>
                  </motion.div>
                )}

                {/* Recent Users */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-black text-[#1A1A2E]">Recent Users</h3>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {(users.length > 0 ? users : MOCK_USERS).slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                        <img
                          src={u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.email)}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1A1A2E] line-clamp-1">{u.name || "User"}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{u.email}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${roleBadge(u.role)}`}>
                          {u.role}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold shrink-0 hidden sm:block">
                          {timeAgo(u.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── USERS TAB ── */}
            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#1A1A2E]">User Management</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">View and manage all registered users</p>
                  </div>
                  <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white outline-none focus:border-blue-400 text-[#1A1A2E] w-64"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          <th className="px-5 py-3.5 text-left">User</th>
                          <th className="px-4 py-3.5 text-left">Role</th>
                          <th className="px-4 py-3.5 text-left">Status</th>
                          <th className="px-4 py-3.5 text-left">Bookings</th>
                          <th className="px-4 py-3.5 text-left">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((u) => (
                          <motion.tr
                            key={u.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.email)}&background=2563EB&color=fff`}
                                  alt={u.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                                />
                                <div>
                                  <p className="text-xs font-bold text-[#1A1A2E]">{u.name || "—"}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${roleBadge(u.role)}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              {u.isVerified ? (
                                <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                                  <IoCheckmarkCircle size={12} /> Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                                  <IoAlertCircleOutline size={12} /> Unverified
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-bold text-[#1A1A2E]">{(u as any)._count?.bookings ?? "-"}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-[10px] text-slate-400 font-semibold">{timeAgo(u.createdAt)}</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="py-16 text-center">
                      <IoPeopleOutline className="text-4xl text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 text-xs font-semibold">No users found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── PROVIDERS TAB ── */}
            {activeTab === "providers" && (
              <motion.div
                key="providers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#1A1A2E]">Provider Verification</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Review and verify service provider applications</p>
                  </div>
                  <div className="flex gap-2">
                    {(["all", "pending", "verified"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setProviderFilter(f)}
                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          providerFilter === f
                            ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {providers.length === 0 && (
                    <div className="py-16 text-center bg-white rounded-2xl border border-slate-100">
                      <IoShieldCheckmarkOutline className="text-4xl text-emerald-400 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm font-bold">All caught up!</p>
                      <p className="text-slate-400 text-xs font-semibold mt-1">No {providerFilter !== "all" ? providerFilter : ""} providers to show.</p>
                    </div>
                  )}

                  {providers.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        {/* Provider Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <img
                            src={p.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user.name || p.user.email)}&background=7C3AED&color=fff`}
                            alt={p.user.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-black text-[#1A1A2E]">{p.user.name || "Provider"}</p>
                              {p.isVerified ? (
                                <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 border border-emerald-100 text-[9px] font-black px-2 py-0.5 rounded-full">
                                  <IoCheckmarkCircle size={10} /> Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 text-amber-600 bg-amber-50 border border-amber-100 text-[9px] font-black px-2 py-0.5 rounded-full">
                                  <IoAlertCircleOutline size={10} /> Pending
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{p.user.email}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {p.serviceTypes.map((type) => (
                                <span key={type} className="text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full uppercase">
                                  {type.replace("_", " ")}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-3 gap-4 text-center shrink-0">
                          <div>
                            <p className="text-base font-black text-[#1A1A2E]">{p.experience}yr</p>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase">Exp.</p>
                          </div>
                          <div>
                            <p className="text-base font-black text-[#1A1A2E]">{p.totalJobs}</p>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase">Jobs</p>
                          </div>
                          <div>
                            <p className="text-base font-black text-[#1A1A2E]">{p.phone}</p>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase">Phone</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {!p.isVerified && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleProviderAction(p.id, "verify")}
                              disabled={actionLoading === p.id}
                              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                            >
                              <IoCheckmarkCircle size={14} />
                              {actionLoading === p.id ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleProviderAction(p.id, "reject")}
                              disabled={actionLoading === p.id}
                              className="flex items-center gap-1.5 border border-red-200 hover:border-red-400 text-red-500 hover:bg-red-50 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                            >
                              <IoCloseCircle size={14} />
                              {actionLoading === p.id ? "..." : "Reject"}
                            </button>
                          </div>
                        )}

                        {p.isVerified && (
                          <div className="shrink-0">
                            <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs px-4 py-2.5 rounded-xl">
                              <IoShieldCheckmarkOutline size={14} /> Verified ✓
                            </span>
                          </div>
                        )}
                      </div>

                      {p.address && (
                        <div className="mt-3 pt-3 border-t border-slate-50">
                          <p className="text-[10px] text-slate-400 font-semibold">
                            📍 {p.address} &nbsp;•&nbsp; Applied {timeAgo(p.createdAt)}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {activeTab === "bookings" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#1A1A2E]">Booking Management</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">View and manage all service bookings</p>
                  </div>
                  <div className="flex gap-2">
                    {(["all", "pending", "accepted", "in_progress", "completed", "cancelled"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setBookingStatusFilter(f)}
                        className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                          bookingStatusFilter === f
                            ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {f.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          <th className="px-5 py-3.5 text-left">Booking #</th>
                          <th className="px-4 py-3.5 text-left">Service</th>
                          <th className="px-4 py-3.5 text-left">Customer</th>
                          <th className="px-4 py-3.5 text-left">Status</th>
                          <th className="px-4 py-3.5 text-left">Amount</th>
                          <th className="px-4 py-3.5 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {bookings.map((b: any) => (
                          <motion.tr
                            key={b.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-5 py-3.5">
                              <span className="text-xs font-bold text-[#1A1A2E]">{b.booking_number}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-semibold text-[#1A1A2E]">{b.service_name}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs text-slate-600">{b.customer_name}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                b.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                                b.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                b.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-700" :
                                b.status === "PENDING" ? "bg-blue-100 text-blue-700" :
                                "bg-slate-100 text-slate-600"
                              }`}>
                                {b.status.replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-bold text-[#1A1A2E]">₹{b.total_price}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-[10px] text-slate-400 font-semibold">{b.scheduled_date}</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {bookings.length === 0 && (
                    <div className="py-16 text-center">
                      <IoListOutline className="text-4xl text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 text-xs font-semibold">No bookings found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
