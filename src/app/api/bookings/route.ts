import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, phone")
      .eq("auth_id", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      service_type, service_name, service_description, special_instructions,
      scheduled_date, scheduled_time, estimated_duration,
      base_price, add_on_price, discount, total_price,
      address, payment_method,
    } = body;

    if (!service_type || !service_name || !scheduled_date || !scheduled_time || !total_price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingNumber = "US-" + Math.floor(100000 + Math.random() * 900000).toString();

    let customerPhone = profile.phone || "";
    const { data: spPhone } = await supabase
      .from("service_providers")
      .select("phone")
      .eq("profile_id", profile.id)
      .single();
    if (spPhone?.phone) customerPhone = spPhone.phone;

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert({
        booking_number: bookingNumber,
        customer_id: profile.id,
        customer_phone: customerPhone || session.user.email || "",
        customer_address: address || { flatNo: "", street: "", city: "", pincode: "" },
        service_type,
        service_name,
        service_description: service_description || "",
        special_instructions: special_instructions || null,
        scheduled_date,
        scheduled_time,
        estimated_duration: estimated_duration || 60,
        status: "PENDING",
        base_price: base_price || total_price,
        add_on_price: add_on_price || 0,
        discount: discount || 0,
        total_price,
      })
      .select()
      .single();

    if (bookingErr) throw bookingErr;

    if (payment_method) {
      const platformFee = Math.round(total_price * 0.2 * 100) / 100;
      const providerPayout = total_price - platformFee;

      await supabase.from("payments").insert({
        booking_id: booking.id,
        amount: total_price,
        method: payment_method.toUpperCase(),
        status: "PENDING",
        platform_fee: platformFee,
        provider_payout: providerPayout,
      });
    }

    await supabase.from("notifications").insert({
      profile_id: profile.id,
      title: "Booking Created",
      message: `Your booking ${bookingNumber} has been placed successfully.`,
      type: "NEW_BOOKING",
      booking_id: booking.id,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create booking" }, { status: 500 });
  }
}
