"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/context/SupabaseAuthProvider";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  IoCashOutline, IoCheckmarkCircleOutline, IoBriefcaseOutline,
  IoNotificationsOutline, IoChevronForwardOutline, IoStar, IoTimeOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

interface DashboardData {
  totalEarnings: number;
  completedJobsCount: number;
  activeJobsCount: number;
  pendingRequestsCount: number;
  provider: any;
  activeJobs: any[];
  completedJobs: any[];
  pendingRequests: any[];
}

export default function ProviderDashboardPage() {
  const { user, profile } = useSupabaseAuth();
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const loadData = async () => {
    if (!profile) return;
    setIsLoading(true);

    try {
      // Get provider profile
      const { data: sp } = await supabase
        .from("service_providers")
        .select("*")
        .eq("profile_id", profile.id)
        .single();

      if (!sp) {
        setIsLoading(false);
        return;
      }

      // Get bookings for this provider
      const { data: allBookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("provider_id", sp.id)
        .order("created_at", { ascending: false });

      const bookings = allBookings || [];

      const activeJobs = bookings.filter(
        (b: any) => b.status === "CONFIRMED" || b.status === "IN_PROGRESS"
      );
      const completedJobs = bookings.filter(
        (b: any) => b.status === "COMPLETED"
      );

      // Get pending requests matching their service types
      const { data: pendingReqs } = await supabase
        .from("bookings")
        .select("*")
        .is("provider_id", null)
        .eq("status", "PENDING")
        .in("service_type", sp.service_types || [])
        .order("created_at", { ascending: false });

      // Get earnings
      const { data: earnings } = await supabase
        .from("earnings")
        .select("amount")
        .eq("provider_id", sp.id)
        .eq("status", "PAID");

      const totalEarnings = (earnings || []).reduce(
        (sum: number, e: any) => sum + e.amount,
        0
      );

      setData({
        totalEarnings,
        completedJobsCount: completedJobs.length,
        activeJobsCount: activeJobs.length,
        pendingRequestsCount: (pendingReqs || []).length,
        provider: sp,
        activeJobs,
        completedJobs,
        pendingRequests: pendingReqs || [],
      });
    } catch (err: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  // Real-time subscription for new bookings
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel("provider-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `status=eq.PENDING`,
        },
        () => {
          loadData();
          toast.success("New booking request available!", { duration: 5000 });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 font-semibold text-sm">
          No provider profile found. Please complete onboarding.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Earnings",
      val: `₹${data.totalEarnings.toFixed(2)}`,
      icon: <IoCashOutline />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Jobs Completed",
      val: data.completedJobsCount.toString(),
      icon: <IoCheckmarkCircleOutline />,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Active Jobs",
      val: data.activeJobsCount.toString(),
      icon: <IoBriefcaseOutline />,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Available Leads",
      val: data.pendingRequestsCount.toString(),
      icon: <IoNotificationsOutline />,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${c.color}`}
            >
              {c.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {c.title}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[#1A1A2E] mt-1 leading-none">
                {c.val}
              </h3>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-extrabold text-base text-[#1A1A2E]">
                Active Service Assignments
              </h3>
              <span className="text-[10px] font-black bg-blue-50 text-[#2563EB] border border-blue-100 px-3 py-1 rounded-full">
                {data.activeJobs.length} Assigned
              </span>
            </div>

            {data.activeJobs.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 border border-dashed rounded-2xl space-y-3">
                <p className="text-gray-400 font-semibold text-xs">
                  No active service assignments currently.
                </p>
                <Link
                  href="/provider/jobs"
                  className="inline-flex text-xs font-bold text-[#2563EB] hover:underline"
                >
                  Browse Jobs Board to accept leads →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-100 bg-gray-50/50 hover:bg-gray-50 p-4 rounded-2xl cursor-pointer transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase">
                          #{job.booking_number}
                        </span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            job.status === "IN_PROGRESS"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1A1A2E] group-hover:text-blue-600 transition-colors">
                        {job.service_name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                        <IoTimeOutline /> {job.scheduled_date} at{" "}
                        {job.scheduled_time}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
                      <span className="font-extrabold text-sm text-[#1A1A2E]">
                        ₹{job.total_price}
                      </span>
                      <span className="p-1 rounded-full bg-white border group-hover:bg-[#2563EB] group-hover:text-white transition-colors text-gray-400">
                        <IoChevronForwardOutline />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Jobs */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-extrabold text-base text-[#1A1A2E] border-b pb-4">
              Completed History
            </h3>
            {data.completedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 font-semibold italic text-center py-6">
                No completed jobs yet.
              </p>
            ) : (
              <div className="space-y-4">
                {data.completedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex justify-between items-center text-xs font-semibold text-gray-500 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-[#1A1A2E] font-bold">
                        {job.service_name}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 font-semibold">
                        Booking ID: {job.booking_number} • Completed:{" "}
                        {job.completed_at?.split("T")[0] || "Recently"}
                      </p>
                    </div>
                    <span className="font-extrabold text-gray-900">
                      ₹{job.total_price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pending Leads */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-extrabold text-sm text-[#1A1A2E] flex items-center gap-1.5">
                <IoNotificationsOutline className="text-[#2563EB] text-base" />{" "}
                Available Job Leads
              </h3>
              <Link
                href="/provider/jobs"
                className="text-[10px] font-bold text-[#2563EB] hover:underline"
              >
                View all
              </Link>
            </div>

            {data.pendingRequests.length === 0 ? (
              <p className="text-xs text-gray-400 font-semibold italic text-center py-8">
                No matching leads in your area.
              </p>
            ) : (
              <div className="space-y-4">
                {data.pendingRequests.slice(0, 5).map((lead) => (
                  <div
                    key={lead.id}
                    className="border border-gray-100 hover:border-[#2563EB] p-3 rounded-xl cursor-pointer hover:bg-blue-50/5 transition-all text-xs space-y-2.5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase">
                          #{lead.booking_number}
                        </span>
                        <h4 className="font-bold text-[#1A1A2E] mt-0.5">
                          {lead.service_name}
                        </h4>
                      </div>
                      <span className="font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-lg text-[10px]">
                        ₹{lead.total_price}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] text-gray-400 font-semibold border-t pt-2 mt-2">
                      <span className="flex items-center gap-1">
                        <IoTimeOutline /> {lead.scheduled_date}{" "}
                        {lead.scheduled_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Provider Profile */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center text-xl font-bold mx-auto">
              {data.provider.experience}
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A1A2E]">
                Experience Level
              </h4>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                {data.provider.experience} Years
              </p>
            </div>
            <div className="flex justify-around border-t pt-4 text-xs font-semibold text-gray-500">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 uppercase">
                  Rating
                </span>
                <p className="text-[#F59E0B] font-extrabold flex items-center justify-center gap-0.5">
                  <IoStar /> {data.provider.rating}
                </p>
              </div>
              <div className="border-r border-gray-100" />
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 uppercase">
                  Completion
                </span>
                <p className="text-[#1A1A2E] font-black">
                  {data.provider.completion_rate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
