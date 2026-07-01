import { getServerDC } from "@/lib/firebase/server-dc";
import { listAllBookings } from "@dataconnect/generated";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const dc = getServerDC();
    const res = await listAllBookings(dc);
    let bookings = res.data.bookings || [];

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    if (status !== "all") {
      bookings = bookings.filter((b) => b.status === status.toUpperCase());
    }

    const mapped = bookings.map((b) => ({
      id: b.id,
      booking_number: b.id.slice(0, 8).toUpperCase(),
      service_name: b.serviceCategory.name,
      customer_name: b.customer.name,
      customer_email: b.customer.email,
      status: b.status,
      total_price: b.totalAmount,
      scheduled_date: b.bookingDate.split("T")[0],
      scheduled_time: b.bookingDate.split("T")[1]?.slice(0, 5) || "",
      created_at: b.bookingDate,
      payment: null,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
