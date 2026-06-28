import React from "react";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Heptome Admin Panel",
  description: "Heptome Administration Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "12px",
            background: "#1A1A2E",
            color: "#FFFFFF",
          },
          success: {
            iconTheme: {
              primary: "#7C3AED",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
      {children}
    </>
  );
}
