"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/context/FirebaseAuthProvider";
import { motion } from "framer-motion";
import {
  IoCashOutline, IoCheckmarkCircleOutline, IoBriefcaseOutline,
  IoNotificationsOutline, IoChevronForwardOutline, IoStar, IoTimeOutline, IoLocationOutline,
} from "react-icons/io5";

interface DashboardData {
  stats: { totalEarnings: number; completedJobsCount: number; activeJobsCount: number; pendingRequestsCount: number };
  provider: any;
  activeJobs: any[];
  completedJobs: any[];
  pendingRequests: any[];
}

export default function ProviderDashboardPage() {
  const { user } = useFirebaseAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/provider/dashboard");
      if (!res.ok) { setIsLoading(false); return; }
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ } finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const s = data.stats ?? { totalEarnings: 0, completedJobsCount: 0, activeJobsCount: 0, pendingRequestsCount: 0 };
  const statCards = [
    {
      title: "Total Earnings",
      val: `₹${s.totalEarnings.toFixed(2)}`,
      icon: <IoCashOutline />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Jobs Completed",
      val: s.completedJobsCount.toString(),
      icon: <IoCheckmarkCircleOutline />,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Active Jobs",
      val: s.activeJobsCount.toString(),
      icon: <IoBriefcaseOutline />,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Available Leads",
      val: s.pendingRequestsCount.toString(),
      icon: <IoNotificationsOutline />,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${c.color}`}>
              {c.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.title}</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#1A1A2E] mt-1 leading-none">{c.val}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-extrabold text-base text-[#1A1A2E]">Active Service Assignments</h3>
              <span className="text-[10px] font-black bg-blue-50 text-[#2563EB] border border-blue-100 px-3 py-1 rounded-full">
                {data.activeJobs.length} Assigned
              </span>
            </div>

            {data.activeJobs.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 border border-dashed rounded-2xl space-y-3">
                <p className="text-gray-400 font-semibold text-xs">No active service assignments currently.</p>
                <Link href="/provider/jobs" className="inline-flex text-xs font-bold text-[#2563EB] hover:underline">
                  Browse Jobs Board to accept leads →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.activeJobs.map((job) => (
                  <Link key={job.id} href={`/provider/jobs/${job.id}`}>
                    <div className="border border-gray-100 bg-gray-50/50 hover:bg-gray-50 p-4 rounded-2xl cursor-pointer transition-colors group">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase">#{job.bookingNumber}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${job.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                              {job.status.replace("_", " ")}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-[#1A1A2E] group-hover:text-blue-600 transition-colors">{job.serviceName}</h4>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-extrabold text-sm text-[#1A1A2E]">₹{job.totalPrice}</span>
                          <span className="p-1 rounded-full bg-white border group-hover:bg-[#2563EB] group-hover:text-white transition-colors text-gray-400">
                            <IoChevronForwardOutline />
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-gray-400 font-semibold">
                        <span className="flex items-center gap-1"><IoTimeOutline /> {job.scheduledDate} at {job.scheduledTime}</span>
                        {job.customerName && <span>Customer: {job.customerName}</span>}
                        {job.customerAddress?.street && (
                          <span className="flex items-center gap-1"><IoLocationOutline /> {job.customerAddress.street}{job.customerAddress.city ? `, ${job.customerAddress.city}` : ""}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-extrabold text-base text-[#1A1A2E] border-b pb-4">Completed History</h3>
            {data.completedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 font-semibold italic text-center py-6">No completed jobs yet.</p>
            ) : (
              <div className="space-y-4">
                {data.completedJobs.map((job) => (
                  <div key={job.id} className="flex justify-between items-center text-xs font-semibold text-gray-500 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-[#1A1A2E] font-bold">{job.serviceName}</p>
                      <p className="text-[9px] text-gray-400 mt-1 font-semibold">Booking ID: {job.bookingNumber} • Recently</p>
                    </div>
                    <span className="font-extrabold text-gray-900">₹{job.totalPrice}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-extrabold text-sm text-[#1A1A2E] flex items-center gap-1.5">
                <IoNotificationsOutline className="text-[#2563EB] text-base" /> Available Job Leads
              </h3>
              <Link href="/provider/jobs" className="text-[10px] font-bold text-[#2563EB] hover:underline">View all</Link>
            </div>
            {data.pendingRequests.length === 0 ? (
              <p className="text-xs text-gray-400 font-semibold italic text-center py-8">No matching leads in your area.</p>
            ) : (
              <div className="space-y-4">
                {data.pendingRequests.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="border border-gray-100 hover:border-[#2563EB] p-3 rounded-xl cursor-pointer hover:bg-blue-50/5 transition-all text-xs space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase">#{lead.bookingNumber}</span>
                        <h4 className="font-bold text-[#1A1A2E] mt-0.5">{lead.serviceName}</h4>
                      </div>
                      <span className="font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-lg text-[10px]">₹{lead.totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] text-gray-400 font-semibold border-t pt-2 mt-2">
                      <span className="flex items-center gap-1"><IoTimeOutline /> {lead.scheduledDate} {lead.scheduledTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center text-xl font-bold mx-auto">
              {data.provider.experience || "-"}
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A1A2E]">Experience Level</h4>
              <p className="text-xs text-gray-400 font-semibold mt-1">{data.provider.experience || 0} Years</p>
            </div>
            <div className="flex justify-around border-t pt-4 text-xs font-semibold text-gray-500">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 uppercase">Rating</span>
                <p className="text-[#F59E0B] font-extrabold flex items-center justify-center gap-0.5"><IoStar /> {data.provider.rating}</p>
              </div>
              <div className="border-r border-gray-100" />
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 uppercase">Completion</span>
                <p className="text-[#1A1A2E] font-black">{data.provider.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
