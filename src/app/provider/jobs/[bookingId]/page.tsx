"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseAuth } from "@/context/FirebaseAuthProvider";
import { Map, type MapViewport } from "@/components/ui/map";
import { 
  IoCallOutline, IoLocationOutline, IoCalendarOutline, 
  IoTimeOutline, IoCheckmarkCircleSharp, IoCameraOutline, IoDocumentTextOutline 
} from "react-icons/io5";
import { toast } from "react-hot-toast";
import ChatWindow from "@/components/ChatWindow";

interface BookingDetail {
  id: string;
  bookingNumber: string;
  serviceName: string;
  serviceDescription: string;
  specialInstructions: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "PENDING" | "ACCEPTED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  customerPhone: string;
  customerAddress: {
    flatNo: string;
    street: string;
    city: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  beforePhotos: string[];
  afterPhotos: string[];
}

export default function JobExecutionPage() {
  const params = useParams();
  const bookingId = params?.bookingId as string;
  const router = useRouter();
  const { user } = useFirebaseAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<BookingDetail | null>(null);
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);
  
  const [viewport, setViewport] = useState<MapViewport>({
    center: [72.8777, 19.0760],
    zoom: 12,
    bearing: 0,
    pitch: 0
  });

  async function loadJobDetails() {
    try {
      const res = await fetch("/api/provider/dashboard");
      if (!res.ok) {
        throw new Error("Failed to load job details");
      }
      const data = await res.json();
      
      const allJobs = [...(data.activeJobs || []), ...(data.completedJobs || [])];
      const selected = allJobs.find((j: any) => j.id === bookingId);
      
      if (!selected) {
        throw new Error("Service assignment not found");
      }
      
      setJob(selected);
      
      if (selected.customerAddress?.longitude && selected.customerAddress?.latitude) {
        setViewport((prev) => ({
          ...prev,
          center: [selected.customerAddress.longitude, selected.customerAddress.latitude],
          zoom: 14
        }));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load job details");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadJobDetails();
  }, [bookingId]);

  const handleUpdateStatus = async (action: "START" | "COMPLETE") => {
    if (!user) return;
    setIsSubmitInProgress(true);
    const toastMsg = action === "START" ? "Starting service..." : "Completing service...";
    toast.loading(toastMsg, { id: "job-action" });

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/provider/jobs/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action execution failed");
      }

      const successMsg = action === "START" ? "Service started! Timer is running." : "Service completed! Earning created.";
      toast.success(successMsg, { id: "job-action" });
      
      await loadJobDetails();
    } catch (err: any) {
      toast.error(err.message || "Action failed", { id: "job-action" });
    } finally {
      setIsSubmitInProgress(false);
    }
  };

  const handlePhotoUploadMock = async (photoType: "before" | "after") => {
    if (!user) return;
    const beforeImages = [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    ];
    const afterImages = [
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500",
    ];
    
    const candidates = photoType === "before" ? beforeImages : afterImages;
    const randomPhoto = candidates[Math.floor(Math.random() * candidates.length)] + `&sig=${Math.floor(Math.random() * 1000)}`;

    toast.loading("Uploading photo...", { id: "upload-photo" });

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/provider/jobs/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          action: "UPLOAD_PHOTOS", 
          photoUrl: randomPhoto,
          photoType 
        }),
      });

      if (!res.ok) throw new Error("Failed to save photo");

      toast.success("Photo uploaded successfully!", { id: "upload-photo" });
      await loadJobDetails();
    } catch (e: any) {
      toast.error(e.message || "Photo upload failed", { id: "upload-photo" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 bg-slate-50 border border-dashed rounded-3xl">
        <p className="text-slate-400 font-semibold text-sm">Service assignment details not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">Order ID: #{job.bookingNumber}</span>
            <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full ${
              job.status === "COMPLETED" 
                ? "bg-emerald-100 text-emerald-800" 
                : job.status === "IN_PROGRESS"
                ? "bg-amber-100 text-amber-800 animate-pulse"
                : "bg-blue-100 text-blue-800"
            }`}>
              {job.status.replace("_", " ")}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A2E] leading-none">{job.serviceName}</h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal">{job.serviceDescription}</p>
        </div>
        <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 w-full sm:w-auto">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Earnings Payout</span>
          <span className="font-extrabold text-xl sm:text-2xl text-[#2563EB]">₹{(job.totalPrice * 0.8).toFixed(2)}</span>
          <span className="block text-[9px] text-slate-400 font-semibold mt-1">(incl. 20% platform share)</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-extrabold text-base text-[#1A1A2E] border-b pb-4">Customer Workspace Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-slate-500">
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Service Address</span>
                <p className="text-[#1A1A2E] font-bold leading-normal flex items-start gap-1.5">
                  <IoLocationOutline className="text-blue-600 text-base shrink-0 mt-0.5" />
                  <span>
                    {job.customerAddress?.flatNo}, {job.customerAddress?.street}, <br />
                    {job.customerAddress?.city} - {job.customerAddress?.pincode}
                  </span>
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Contact Customer</span>
                <p className="text-[#1A1A2E] font-bold flex items-center gap-1.5">
                  <IoCallOutline className="text-blue-600 text-base" />
                  <a href={`tel:${job.customerPhone}`} className="hover:underline text-blue-600 font-extrabold">
                    +91 {job.customerPhone}
                  </a>
                </p>
              </div>

              {job.specialInstructions && (
                <div className="col-span-1 sm:col-span-2 space-y-1.5 border-t pt-4">
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Special Instructions</span>
                  <p className="text-slate-600 italic bg-slate-50 border p-3 rounded-xl flex items-start gap-2 leading-relaxed">
                    <IoDocumentTextOutline className="text-blue-600 text-lg shrink-0 mt-0.5" />
                    <span>{job.specialInstructions}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xs space-y-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="font-extrabold text-sm text-[#1A1A2E] flex items-center gap-1.5">
                <IoLocationOutline className="text-blue-600 text-base" /> Directions to Client
              </h4>
            </div>
            <div className="rounded-2xl overflow-hidden h-[300px] border border-slate-200">
              <Map viewport={viewport} onViewportChange={setViewport} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-6">
            <h3 className="font-extrabold text-base text-[#1A1A2E] border-b pb-3">Execution Panel</h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-500 bg-slate-50 border p-4 rounded-2xl">
              <div className="flex justify-between">
                <span>Scheduled Date</span>
                <span className="text-[#1A1A2E] font-bold flex items-center gap-1.5"><IoCalendarOutline className="text-blue-600" /> {job.scheduledDate.split("T")[0]}</span>
              </div>
              <div className="flex justify-between border-t pt-2.5 mt-2.5">
                <span>Time Slot</span>
                <span className="text-[#1A1A2E] font-bold flex items-center gap-1.5"><IoTimeOutline className="text-blue-600" /> {job.scheduledTime}</span>
              </div>
            </div>

            <div className="space-y-4">
              {job.status === "ACCEPTED" && (
                <button
                  disabled={isSubmitInProgress}
                  onClick={() => handleUpdateStatus("START")}
                  className="w-full btn-primary py-3.5 text-xs font-bold"
                >
                  Start Service Execution
                </button>
              )}

              {job.status === "IN_PROGRESS" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="border border-dashed border-slate-200 rounded-2xl p-3 bg-slate-50 hover:bg-slate-100/50 transition-colors flex flex-col justify-between min-h-[110px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Before Photos</span>
                      <div className="flex flex-wrap gap-1 justify-center py-1">
                        {job.beforePhotos.length > 0 ? (
                          job.beforePhotos.map((url, idx) => (
                            <img key={idx} src={url} alt="before" className="w-8 h-8 rounded-lg object-cover border border-white" />
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">None uploaded</span>
                        )}
                      </div>
                      <button
                        onClick={() => handlePhotoUploadMock("before")}
                        className="border border-[#2563EB]/40 hover:bg-blue-50 text-[#2563EB] text-[9px] font-black rounded-lg py-1.5 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <IoCameraOutline /> Add Before Photo
                      </button>
                    </div>

                    <div className="border border-dashed border-slate-200 rounded-2xl p-3 bg-slate-50 hover:bg-slate-100/50 transition-colors flex flex-col justify-between min-h-[110px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase">After Photos</span>
                      <div className="flex flex-wrap gap-1 justify-center py-1">
                        {job.afterPhotos.length > 0 ? (
                          job.afterPhotos.map((url, idx) => (
                            <img key={idx} src={url} alt="after" className="w-8 h-8 rounded-lg object-cover border border-white" />
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">None uploaded</span>
                        )}
                      </div>
                      <button
                        onClick={() => handlePhotoUploadMock("after")}
                        className="border border-[#2563EB]/40 hover:bg-blue-50 text-[#2563EB] text-[9px] font-black rounded-lg py-1.5 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <IoCameraOutline /> Add After Photo
                      </button>
                    </div>
                  </div>

                  <button
                    disabled={isSubmitInProgress || job.afterPhotos.length === 0}
                    onClick={() => handleUpdateStatus("COMPLETE")}
                    className={`w-full btn-primary py-3.5 text-xs font-bold ${
                      job.afterPhotos.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title={job.afterPhotos.length === 0 ? "Upload after-service photo to complete" : ""}
                  >
                    Complete Job & Request Payment
                  </button>
                  {job.afterPhotos.length === 0 && (
                    <p className="text-[9px] text-red-500 font-bold text-center mt-1">
                      Upload at least 1 After Photo to enable Completion.
                    </p>
                  )}
                </div>
              )}

              {job.status === "COMPLETED" && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-4 rounded-2xl flex items-start gap-2.5 text-xs font-semibold">
                  <IoCheckmarkCircleSharp className="text-xl text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Job Execution Completed!</h5>
                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">Your work has been verified, and the platform has processed the client payout.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-[#1A1A2E]">Chat with Customer</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Send real-time updates & instructions</p>
            </div>
            <ChatWindow
              bookingId={bookingId}
              customerName="Customer"
              isProvider={true}
              inline={true}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
