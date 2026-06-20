"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6"
    >
      <div className="text-6xl">🔍</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-[#1A1A2E]">Page Not Found</h1>
        <p className="text-slate-400 text-xs sm:text-sm font-semibold max-w-xs mx-auto">
          We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
        </p>
      </div>
      <Link to="/" className="btn-primary py-2.5 px-6 text-xs inline-block">
        Back to Home
      </Link>
    </motion.div>
  );
}
