import React from "react";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Heptome Admin Panel",
  description: "Heptome Administration Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_id", session.user.id)
    .single();

  if (!profile || profile.role !== "ADMIN") {
    redirect("/");
  }

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
