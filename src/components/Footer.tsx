import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">Heptome</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium home services at your doorstep. We provide certified professionals for all your cleaning, repair, and maintenance needs.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-pink-600 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-blue-700 hover:text-white transition-colors" aria-label="Linkedin">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide">Popular Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">AC Service & Repair</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">Deep Home Cleaning</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">Plumbing & Carpentry</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">Electrical Fault Fixing</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">Wall Painting & Decor</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Policy */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide">Heptome Trust</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p><strong>30-Day Warranty</strong> on all service bookings with full coverage.</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p><strong>Verified Pros</strong> who undergo intensive vetting and background checks.</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <span>123 Tech Square, HSR Layout, Bangalore, KA, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-slate-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                <span>support@heptome.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Heptome Technologies Private Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Cookies Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
