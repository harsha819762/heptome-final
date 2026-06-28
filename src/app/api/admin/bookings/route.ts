import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    let query = supabase
      .from("bookings")
      .select("*, profiles!inner(name, email)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (status !== "all") {
      query = query.eq("status", status.toUpperCase());
    }

    const { data: bookings } = await query;

    const mapped = (bookings || []).map((b: any) => ({
      id: b.id,
      booking_number: b.booking_number,
      service_name: b.service_name,
      customer_name: b.profiles?.name || "Unknown",
      customer_email: b.profiles?.email || "",
      status: b.status,
      total_price: b.total_price,
      scheduled_date: b.scheduled_date,
      scheduled_time: b.scheduled_time,
      created_at: b.created_at,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Admin bookings list error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
