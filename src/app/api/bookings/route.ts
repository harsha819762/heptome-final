import { getServerDC } from "@/lib/firebase/server-dc";
import { createBooking } from "@dataconnect/generated";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { serviceCategoryId, scheduledDate, scheduledTime, totalPrice } = body;

    if (!serviceCategoryId || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dc = getServerDC();
    const res = await createBooking(dc, {
      status: "PENDING",
      bookingDate: `${scheduledDate || new Date().toISOString().split("T")[0]}T${scheduledTime || "10:00"}:00Z`,
      totalAmount: totalPrice,
      customerId: "7f9b887a-dc8f-4f81-8cb0-6fb535a0f670",
      serviceCategoryId,
    });

    return NextResponse.json({ booking: { id: res.data.booking_insert.id } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
