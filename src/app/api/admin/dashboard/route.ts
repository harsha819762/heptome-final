import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_id", session.user.id)
      .single();

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: totalProviders } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "PROVIDER");

    const { count: pendingProviders } = await supabase
      .from("service_providers")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", false);

    const { count: totalBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    const { count: completedBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "COMPLETED");

    const { count: pendingBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING");

    const { data: revenueData } = await supabase
      .from("bookings")
      .select("total_price")
      .eq("status", "COMPLETED");

    const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

    const { data: platformFees } = await supabase
      .from("payments")
      .select("platform_fee")
      .in("status", ["SUCCESS", "PENDING"]);
    const totalPlatformRevenue = platformFees?.reduce((sum, p) => sum + (p.platform_fee || 0), 0) || 0;

    const { data: recentUsers } = await supabase
      .from("profiles")
      .select("id, name, email, role, is_verified, image, created_at")
      .order("created_at", { ascending: false })
      .limit(8);

    const { data: recentProviders } = await supabase
      .from("service_providers")
      .select("*, profiles!inner(name, email, image)")
      .eq("is_verified", false)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalProviders: totalProviders || 0,
        pendingProviders: pendingProviders || 0,
        totalBookings: totalBookings || 0,
        completedBookings: completedBookings || 0,
        pendingBookings: pendingBookings || 0,
        totalRevenue,
        totalPlatformRevenue,
      },
      recentUsers: recentUsers || [],
      pendingProviders: recentProviders || [],
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({
      stats: {
        totalUsers: 0,
        totalProviders: 0,
        pendingProviders: 0,
        totalBookings: 0,
        completedBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        totalPlatformRevenue: 0,
      },
      recentUsers: [],
      pendingProviders: [],
    });
  }
}
