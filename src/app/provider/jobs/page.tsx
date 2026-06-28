"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/context/SupabaseAuthProvider";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoBriefcaseOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

interface PendingJob {
  id: string;
  booking_number: string;
  service_name: string;
  service_description: string;
  scheduled_date: string;
  scheduled_time: string;
  total_price: number;
  customer_address: any;
  service_type: string;
  created_at: string;
}

export default function JobsBoardPage() {
  const { user, profile } = useSupabaseAuth();
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);

  const loadPendingJobs = async () => {
    if (!profile) return;
    setIsLoading(true);

    try {
      const { data: sp } = await supabase
        .from("service_providers")
        .select("id, service_types")
        .eq("profile_id", profile.id)
        .single();

      if (!sp) {
        setIsLoading(false);
        return;
      }

      setProviderId(sp.id);

      const { data: jobs } = await supabase
        .from("bookings")
        .select("*")
        .is("provider_id", null)
        .eq("status", "PENDING")
        .in("service_type", sp.service_types || [])
        .order("created_at", { ascending: false });

      setPendingJobs((jobs as PendingJob[]) || []);
    } catch (err: any) {
      toast.error("Failed to load available jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingJobs();
  }, [profile]);

  // Real-time subscription for new bookings
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel("jobs-board")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: "status=eq.PENDING",
        },
        () => {
          loadPendingJobs();
          toast.success("New job lead available!", { duration: 4000 });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const handleAcceptJob = async (jobId: string) => {
    if (!providerId) return;
    setAcceptingId(jobId);

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          provider_id: providerId,
          status: "ACCEPTED",
        })
        .eq("id", jobId);

      if (error) throw new Error(error.message);

      toast.success("Job accepted! Redirecting...");
      setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
      router.push(`/provider/jobs/${jobId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to accept job");
    } finally {
      setAcceptingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1A1A2E]">
          Available Job Leads
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-1">
          New leads appear in real-time. Review and accept service requests from
          customers.
        </p>
      </div>

      {pendingJobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto">
            <IoBriefcaseOutline />
          </div>
          <h3 className="font-extrabold text-[#1A1A2E]">All Caught Up!</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            No pending customer requests matching your skills. New leads will
            appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingJobs.map((job) => (
            <motion.div
              layout
              key={job.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Lead ID: #{job.booking_number}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A2E] mt-0.5">
                      {job.service_name}
                    </h3>
                  </div>
                  <span className="font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl text-xs sm:text-sm shrink-0">
                    ₹{job.total_price}
                  </span>
                </div>

                <p className="text-xs text-gray-400 font-semibold leading-relaxed line-clamp-2">
                  {job.service_description || "No additional description."}
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500 bg-gray-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <IoCalendarOutline className="text-[#2563EB] text-base" />
                    <span>{job.scheduled_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoTimeOutline className="text-[#2563EB] text-base" />
                    <span>{job.scheduled_time}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-2 border-t pt-2 mt-2">
                    <IoLocationOutline className="text-[#2563EB] text-base shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      {job.customer_address?.street || "Address on file"},{" "}
                      {job.customer_address?.city || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
                <button
                  disabled={acceptingId !== null}
                  onClick={() => handleAcceptJob(job.id)}
                  className="flex-1 bg-[#2563EB] text-white rounded-xl py-2.5 text-xs font-bold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {acceptingId === job.id ? "Claiming..." : "Accept Lead"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
