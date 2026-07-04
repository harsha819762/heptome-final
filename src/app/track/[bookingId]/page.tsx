"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Map, type MapViewport, type MapMarker } from "@/components/ui/map";
import {
  IoNavigateOutline, IoLocationOutline, IoTimeOutline,
  IoCheckmarkCircleSharp, IoArrowBack
} from "react-icons/io5";
import Link from "next/link";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function TrackTechnicianPage() {
  const params = useParams();
  const bookingId = params?.bookingId as string;
  const router = useRouter();

  const [techLoc, setTechLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [distance, setDistance] = useState<string>("");

  const [viewport, setViewport] = useState<MapViewport>({
    center: [72.8777, 19.0760],
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  const fetchTechLocation = useCallback(async () => {
    try {
      const res = await fetch(`/api/locate/track/${bookingId}`);
      const data = await res.json();
      if (data.lat && data.lng) {
        setTechLoc({ lat: data.lat, lng: data.lng });
        setLastUpdate(new Date(data.timestamp).toLocaleTimeString());
        setViewport((prev) => ({ ...prev, center: [data.lng, data.lat], zoom: 14 }));
      }
    } catch {}
  }, [bookingId]);

  const fetchBookingInfo = useCallback(async () => {
    try {
      const res = await fetch("/api/provider/dashboard");
      if (!res.ok) return;
      const data = await res.json();
      const all = [...(data.activeJobs || []), ...(data.completedJobs || [])];
      const found = all.find((j: any) => j.id === bookingId);
      if (found) {
        setBookingInfo(found);
        if (found.customerAddress?.longitude && found.customerAddress?.latitude) {
          setViewport((prev) => ({ ...prev, center: [found.customerAddress.longitude, found.customerAddress.latitude], zoom: 13 }));
        }
      }
    } catch {}
  }, [bookingId]);

  useEffect(() => { fetchBookingInfo(); }, [fetchBookingInfo]);
  useEffect(() => {
    fetchTechLocation();
    const interval = setInterval(fetchTechLocation, 5000);
    return () => clearInterval(interval);
  }, [fetchTechLocation]);

  useEffect(() => {
    if (techLoc && bookingInfo?.customerAddress?.latitude && bookingInfo?.customerAddress?.longitude) {
      const dist = haversineDistance(techLoc.lat, techLoc.lng, bookingInfo.customerAddress.latitude, bookingInfo.customerAddress.longitude);
      setDistance(dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`);
    }
  }, [techLoc, bookingInfo]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0 py-4 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/my-bookings" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <IoArrowBack className="text-lg text-gray-500" />
        </Link>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A2E]">Track Technician</h2>
          {bookingInfo && (
            <p className="text-xs text-gray-400 font-semibold mt-0.5">
              {bookingInfo.serviceName} • #{bookingInfo.bookingNumber}
            </p>
          )}
        </div>
      </div>

      {!techLoc ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto">
            <IoNavigateOutline />
          </div>
          <h3 className="font-extrabold text-[#1A1A2E]">Waiting for Technician</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-sm mx-auto">
            The technician has not shared their location yet. This page updates automatically when they go online.
          </p>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.1s" }} />
            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-700">Technician on the move</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-400">
                {distance && <span>Distance: {distance}</span>}
                {lastUpdate && <span>Updated: {lastUpdate}</span>}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-[400px] border border-gray-200">
              <Map
                viewport={viewport}
                onViewportChange={setViewport}
                markers={[
                  ...(techLoc ? [{ longitude: techLoc.lng, latitude: techLoc.lat, label: "Technician", color: "#2563EB", pulse: true } as MapMarker] : []),
                  ...(bookingInfo?.customerAddress?.longitude && bookingInfo?.customerAddress?.latitude
                    ? [{ longitude: bookingInfo.customerAddress.longitude, latitude: bookingInfo.customerAddress.latitude, label: "You", color: "#10B981" } as MapMarker]
                    : []),
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <span className="text-[9px] font-black text-gray-400 uppercase">Status</span>
              <p className="text-xs font-bold text-green-600 mt-1 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> En Route
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <span className="text-[9px] font-black text-gray-400 uppercase">Distance</span>
              <p className="text-sm font-extrabold text-[#1A1A2E] mt-1">{distance || "—"}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <span className="text-[9px] font-black text-gray-400 uppercase">Service</span>
              <p className="text-xs font-bold text-[#1A1A2E] mt-1">{bookingInfo?.serviceName || "—"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
