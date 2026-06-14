"use client";

import { useCategories, useTopServices } from "@/hooks/useServices";
import { Snowflake, Sparkles, Droplet, Zap, PaintRoller, Scissors, Clock, Star, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCart";
import { useSearchStore } from "@/store/useSearch";
import { useState } from "react";

// Helper to map string icon names to Lucide icons
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Snowflake,
  Sparkles,
  Droplet,
  Zap,
  PaintRoller,
  Scissors,
};

export default function Home() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: services, isLoading: isServicesLoading } = useTopServices();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { query: searchQuery, setQuery: setSearchQuery } = useSearchStore();
  const addItem = useCartStore(state => state.addItem);

  // Filter services by active category and active search query
  const filteredServices = services?.filter((service) => {
    const matchesCategory = !selectedCategoryId || service.catId === selectedCategoryId;
    const matchesSearch = !searchQuery || service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl h-[300px] sm:h-[400px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800/80 to-transparent z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" 
          alt="Home Services" 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="relative z-20 px-8 sm:px-12 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Expert home services, <br/><span className="text-blue-400">on demand.</span></h1>
          <p className="text-lg text-slate-300 mb-8 max-w-lg">Get professional AC repair, cleaning, and handyman services at your doorstep within 60 minutes.</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-slate-900">What are you looking for?</h2>
          {(selectedCategoryId || searchQuery) && (
            <button 
              onClick={() => { setSelectedCategoryId(null); setSearchQuery(""); }} 
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
        
        {isCategoriesLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-slate-200 rounded-xl aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categories?.map((cat) => {
              const Icon = IconMap[cat.icon] || Zap;
              const isActive = selectedCategoryId === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(prev => prev === cat.id ? null : cat.id)}
                  className={`flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border transition-all group cursor-pointer ${
                    isActive 
                      ? 'border-blue-600 ring-2 ring-blue-50 bg-blue-50/20' 
                      : 'border-slate-100 hover:shadow-md hover:border-blue-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium text-center ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Top Services */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedCategoryId ? `${categories?.find(c => c.id === selectedCategoryId)?.name} Services` : 'Most Booked Services'}
          </h2>
          {selectedCategoryId && (
            <button 
              onClick={() => setSelectedCategoryId(null)}
              className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-700 transition-colors"
            >
              See all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {isServicesLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-2xl h-48" />
            ))}
          </div>
        ) : (
          <>
            {filteredServices && filteredServices.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredServices.map((service) => (
                  <div key={service.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-4">
                      {service.tags.includes("Bestseller") ? (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-orange-700" /> Bestseller
                        </span>
                      ) : service.tags.includes("Premium") ? (
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          Premium
                        </span>
                      ) : (
                        <div />
                      )}
                    </div>
                    <Link href={`/service/${service.id}`} className="hover:underline">
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{service.name}</h3>
                    </Link>
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {service.duration}
                    </div>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="font-bold text-lg text-slate-900">₹{service.price}</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(service);
                        }}
                        className="bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 font-medium">No services found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedCategoryId(null); setSearchQuery(""); }} 
                  className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
