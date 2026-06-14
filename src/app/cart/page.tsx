"use client";

import { useCartStore } from "@/store/useCart";
import { useAuth } from "@/components/AuthProvider";
import { Trash2, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const { items, getTotalPrice, removeItem, clearCart } = useCartStore();
  const { user, loginWithGoogle, mockLogin } = useAuth();
  
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  const total = getTotalPrice();
  const serviceFee = 49;
  const grandTotal = total > 0 ? total + serviceFee : 0;

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h1>
        <p className="text-slate-500 mb-8">Your professional has been scheduled and will arrive at the requested time.</p>
        <Link href="/" className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven&apos;t added any services yet.</p>
        <Link href="/" className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Browse Services
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (step === 1) {
      if (!user) setStep(2);
      else setStep(3);
    } else if (step === 2) {
      if (user) setStep(3);
    } else if (step === 3) {
      if (address.trim() !== "") setStep(4);
    } else if (step === 4) {
      // Mock order placement
      clearCart();
      setOrderComplete(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Flow */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        {/* Step 1: Summary */}
        <div className={`p-6 rounded-2xl border ${step === 1 ? 'border-blue-500 shadow-md bg-white' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
              Review Services
            </h2>
            {step > 1 && (
              <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-medium">Edit</button>
            )}
          </div>
          {step === 1 && (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={handleCheckout} className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl mt-4">
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Auth */}
        <div className={`p-6 rounded-2xl border ${step === 2 ? 'border-blue-500 shadow-md bg-white' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
              Login
            </h2>
          </div>
          {step === 2 && (
            <div className="space-y-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src={user.photoURL || "https://i.pravatar.cc/150"} alt="User" width={40} height={40} unoptimized className="rounded-full" />
                    <div>
                      <p className="font-bold text-slate-900">{user.displayName}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setStep(3)} className="bg-slate-900 text-white font-medium px-6 py-2 rounded-xl">Continue</button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={async () => { await loginWithGoogle(); setStep(3); }} className="flex-1 bg-white border border-slate-200 shadow-sm text-slate-900 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50">
                    Login with Google
                  </button>
                  <button onClick={() => { mockLogin(); setStep(3); }} className="flex-1 bg-blue-50 text-blue-600 font-medium py-3 rounded-xl hover:bg-blue-100">
                    Bypass / Mock Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Address */}
        <div className={`p-6 rounded-2xl border ${step === 3 ? 'border-blue-500 shadow-md bg-white' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
              Address & Time
            </h2>
            {step > 3 && (
              <button onClick={() => setStep(3)} className="text-blue-600 text-sm font-medium">Edit</button>
            )}
          </div>
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  rows={3}
                  placeholder="e.g. 123 Main St, Apartment 4B"
                />
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={address.trim() === ""}
                className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl mt-4 disabled:opacity-50"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>

        {/* Step 4: Payment */}
        <div className={`p-6 rounded-2xl border ${step === 4 ? 'border-blue-500 shadow-md bg-white' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>4</span>
              Payment
            </h2>
          </div>
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 border border-blue-100 bg-blue-50 rounded-xl flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Pay after service</h4>
                  <p className="text-sm text-slate-600">You can pay via Cash or UPI after the service is completed.</p>
                </div>
              </div>
              <button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 shadow-sm transition-colors text-lg">
                Book Now (₹{grandTotal})
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Pricing Summary */}
      <div className="relative hidden lg:block">
        <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-xl text-slate-900 mb-6">Payment Details</h3>
          
          <div className="space-y-3 mb-6 border-b border-slate-100 pb-6">
            <div className="flex justify-between text-slate-600">
              <span>Item Total</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & Fee</span>
              <span>₹{serviceFee}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center font-bold text-xl text-slate-900">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl flex items-start gap-3 border border-green-100">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-sm text-green-800 font-medium">Safe and secure payments. 30-day warranty included.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
