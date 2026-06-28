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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await params;
    const { action, photoUrl, photoType } = await req.json();

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("auth_id", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: provider } = await supabase
      .from("service_providers")
      .select("*")
      .eq("profile_id", profile.id)
      .single();

    if (!provider) {
      return NextResponse.json({ error: "Only service providers can perform this action" }, { status: 403 });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (action === "ACCEPT") {
      if (booking.status !== "PENDING") {
        return NextResponse.json({ error: "Job is no longer pending" }, { status: 400 });
      }

      const { data: updated } = await supabase
        .from("bookings")
        .update({ provider_id: provider.id, status: "ACCEPTED" })
        .eq("id", bookingId)
        .select()
        .single();

      await supabase.from("notifications").insert({
        profile_id: booking.customer_id,
        title: "Booking Accepted!",
        message: `Your booking ${booking.booking_number} has been accepted by ${profile.name}.`,
        type: "BOOKING_ACCEPTED",
        booking_id: booking.id,
      });

      return NextResponse.json(mapBooking(updated));
    }

    if (booking.provider_id !== provider.id) {
      return NextResponse.json({ error: "You are not assigned to this booking" }, { status: 403 });
    }

    if (action === "START") {
      if (booking.status !== "ACCEPTED") {
        return NextResponse.json({ error: "Job must be accepted before starting" }, { status: 400 });
      }

      const { data: updated } = await supabase
        .from("bookings")
        .update({ status: "IN_PROGRESS", started_at: new Date().toISOString() })
        .eq("id", bookingId)
        .select()
        .single();

      await supabase.from("notifications").insert({
        profile_id: booking.customer_id,
        title: "Service Started",
        message: `Your service partner ${profile.name} has started the job.`,
        type: "BOOKING_STARTED",
        booking_id: booking.id,
      });

      return NextResponse.json(mapBooking(updated));
    }

    if (action === "UPLOAD_PHOTOS") {
      if (!photoUrl) {
        return NextResponse.json({ error: "Photo URL is required" }, { status: 400 });
      }

      const isBefore = photoType === "before";
      const photoKey = isBefore ? "before_photos" : "after_photos";
      const currentPhotos = isBefore ? booking.before_photos : booking.after_photos;
      const updatedPhotos = [...(currentPhotos || []), photoUrl];

      const { data: updated } = await supabase
        .from("bookings")
        .update({ [photoKey]: updatedPhotos })
        .eq("id", bookingId)
        .select()
        .single();

      return NextResponse.json(mapBooking(updated));
    }

    if (action === "COMPLETE") {
      if (booking.status !== "IN_PROGRESS") {
        return NextResponse.json({ error: "Job must be in progress to mark as complete" }, { status: 400 });
      }

      const { data: updated } = await supabase
        .from("bookings")
        .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
        .eq("id", bookingId)
        .select()
        .single();

      const { data: allProviderBookings } = await supabase
        .from("bookings")
        .select("status")
        .eq("provider_id", provider.id);

      const completedCount = (allProviderBookings || []).filter((b) => b.status === "COMPLETED").length;
      const totalCount = (allProviderBookings || []).length;
      const rate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

      await supabase
        .from("service_providers")
        .update({ total_jobs: completedCount, completion_rate: Math.round(rate * 100) / 100 })
        .eq("id", provider.id);

      const payoutAmount = booking.total_price * 0.8;

      await supabase.from("earnings").insert({
        provider_id: provider.id,
        booking_id: booking.id,
        amount: payoutAmount,
        type: "BOOKING_PAYMENT",
        description: `Payment for booking ${booking.booking_number}`,
        status: "PAID",
        paid_at: new Date().toISOString(),
      });

      await supabase.from("notifications").insert({
        profile_id: booking.customer_id,
        title: "Service Completed!",
        message: `Your service booking ${booking.booking_number} is completed. Please rate the service!`,
        type: "BOOKING_COMPLETED",
        booking_id: booking.id,
      });

      return NextResponse.json(mapBooking(updated));
    }

    if (action === "CANCEL") {
      const { data: updated } = await supabase
        .from("bookings")
        .update({ status: "CANCELLED" })
        .eq("id", bookingId)
        .select()
        .single();

      return NextResponse.json(mapBooking(updated));
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (error: any) {
    console.error("Provider jobs action error:", error);
    return NextResponse.json({ error: error.message || "Action execution failed" }, { status: 500 });
  }
}
