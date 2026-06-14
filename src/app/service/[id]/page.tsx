"use client";

import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "@/lib/queries";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/useCart";
import { Clock, Star, Shield, ThumbsUp, Sparkles, Zap, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ServicePage() {
  const params = useParams();
  const serviceId = params.id as string;
  const addItem = useCartStore((state) => state.addItem);

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getServiceById(serviceId),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Service Not Found</h1>
        <p className="text-slate-500 mb-6">{"The service you're looking for doesn't exist."}</p>
        <Link href="/" className="text-blue-600 font-medium hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      {/* Left Column: Details */}
      <div className="md:col-span-2 space-y-8">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">{service.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{service.name}</h1>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1.5" /> 4.8 (1.2k reviews)
            </span>
            <span className="flex items-center text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 mr-1.5" /> {service.duration}
            </span>
          </div>
        </div>

        <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-sm">
          <Image 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" 
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{"What's included"}</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">30-Day Warranty</h4>
                <p className="text-slate-500 text-sm">We provide a free 30-day warranty on all repairs.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Sparkles className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">Premium Tools</h4>
                <p className="text-slate-500 text-sm">Our partners use top-tier, sanitized equipment.</p>
              </div>
            </li>
            <li className="flex items-start">
              <ThumbsUp className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">Verified Professionals</h4>
                <p className="text-slate-500 text-sm">Background-checked and highly trained experts.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column: Checkout Sticky Card */}
      <div className="relative">
        <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
          <h3 className="font-bold text-xl text-slate-900 mb-6">Order Summary</h3>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-600 font-medium">{service.name}</span>
            <span className="font-bold text-lg text-slate-900">₹{service.price}</span>
          </div>

          <div className="border-t border-slate-100 pt-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500">Service Fee</span>
              <span className="text-slate-900 font-medium">₹49</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-2xl text-slate-900">₹{service.price + 49}</span>
            </div>
          </div>

          <button 
            onClick={() => addItem(service)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            <Zap className="w-5 h-5" /> Add to Cart
          </button>
          
          <p className="text-xs text-center text-slate-400 mt-4">
            {"You won't be charged yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
