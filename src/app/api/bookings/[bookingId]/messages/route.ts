import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("auth_id", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("customer_id, provider_id")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isCustomer = booking.customer_id === profile.id;

    let isProvider = false;
    if (booking.provider_id) {
      const { data: sp } = await supabase
        .from("service_providers")
        .select("profile_id")
        .eq("id", booking.provider_id)
        .single();
      isProvider = sp?.profile_id === profile.id;
    }

    if (!isCustomer && !isProvider && profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access to chat" }, { status: 403 });
    }

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });

    return NextResponse.json(messages || []);
  } catch (error: any) {
    console.error("Fetch chat messages error:", error);
    return NextResponse.json({ error: error.message || "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(
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
    const { message, messageType, mediaUrl } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("auth_id", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("customer_id, provider_id")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isCustomer = booking.customer_id === profile.id;

    let isProvider = false;
    let providerId: string | undefined;
    if (booking.provider_id) {
      const { data: sp } = await supabase
        .from("service_providers")
        .select("id, profile_id")
        .eq("id", booking.provider_id)
        .single();
      isProvider = sp?.profile_id === profile.id;
      providerId = isProvider ? sp!.id : undefined;
    }

    if (!isCustomer && !isProvider) {
      return NextResponse.json({ error: "Unauthorized to send messages in this chat" }, { status: 403 });
    }

    const { data: newMessage, error } = await supabase
      .from("messages")
      .insert({
        booking_id: bookingId,
        sender_id: profile.id,
        sender_type: isCustomer ? "CUSTOMER" : "PROVIDER",
        message,
        message_type: messageType || "TEXT",
        media_url: mediaUrl || null,
        provider_id: providerId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("Save chat message error:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
