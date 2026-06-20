"use client";

import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, setLoginModalOpen } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLoginModalOpen(true);
      toast.error("Please login to continue");
    }
  }, [isAuthenticated, loading, setLoginModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
