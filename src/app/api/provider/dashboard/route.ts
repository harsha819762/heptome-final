import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function mapBooking(b: any) {
  return {
    id: b.id,
    bookingNumber: b.booking_number,
    serviceName: b.service_name,
    serviceDescription: b.service_description,
    specialInstructions: b.special_instructions,
    scheduledDate: b.scheduled_date,
    scheduledTime: b.scheduled_time,
    status: b.status,
    totalPrice: b.total_price,
    customerPhone: b.customer_phone,
    customerAddress: b.customer_address || {},
    beforePhotos: b.before_photos || [],
    afterPhotos: b.after_photos || [],
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: provider } = await supabase
      .from("service_providers")
      .select("*, profiles!inner(name, email, image)")
      .eq("profile_id", profile.id)
      .single();

    if (!provider) {
      return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
    }

    const { data: allBookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("provider_id", provider.id)
      .order("scheduled_date", { ascending: false });

    const bookings = (allBookings || []).map(mapBooking);

    const completedJobs = bookings.filter((b) => b.status === "COMPLETED");
    const activeJobs = bookings.filter(
      (b) => b.status === "ACCEPTED" || b.status === "CONFIRMED" || b.status === "IN_PROGRESS"
    );

    const { data: earnings } = await supabase
      .from("earnings")
      .select("amount, status")
      .eq("provider_id", provider.id);

    const totalEarnings = (earnings || [])
      .filter((e) => e.status === "PAID" || e.status === "PENDING")
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const { data: pendingRaw } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "PENDING")
      .in("service_type", provider.service_types || [])
      .order("created_at", { ascending: false });

    const pendingRequests = (pendingRaw || []).map(mapBooking);

    return NextResponse.json({
      provider: {
        id: provider.id,
        bio: provider.bio,
        rating: provider.rating,
        experience: provider.experience,
        totalJobs: provider.total_jobs,
        completionRate: provider.completion_rate,
        isVerified: provider.is_verified,
        isAvailable: provider.is_available,
        serviceTypes: provider.service_types,
      },
      stats: {
        totalEarnings,
        completedJobsCount: completedJobs.length,
        activeJobsCount: activeJobs.length,
        pendingRequestsCount: (pendingRequests || []).length,
      },
      activeJobs,
      completedJobs: completedJobs.slice(0, 10),
      pendingRequests: pendingRequests || [],
    });
  } catch (error: any) {
    console.error("Provider dashboard API error:", error);
    return NextResponse.json({ error: error.message || "Failed to load dashboard data" }, { status: 500 });
  }
}
