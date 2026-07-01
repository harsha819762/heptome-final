import { getServerDC } from "@/lib/firebase/server-dc";
import { getBookingById, updateBookingStatus, assignProvider } from "@dataconnect/generated";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const { action } = await req.json();

    const dc = getServerDC();

    if (action === "ACCEPT") {
      const res = await assignProvider(dc, { bookingId, providerId: "a2b109c1-4560-4b21-827d-08e17812ef10" });
      return NextResponse.json({ id: res.data.booking_update?.id, status: "IN_PROGRESS" });
    }

    if (action === "START") {
      const res = await updateBookingStatus(dc, { id: bookingId, status: "IN_PROGRESS" });
      return NextResponse.json({ id: res.data.booking_update?.id, status: "IN_PROGRESS" });
    }

    if (action === "COMPLETE") {
      const res = await updateBookingStatus(dc, { id: bookingId, status: "COMPLETED" });
      return NextResponse.json({ id: res.data.booking_update?.id, status: "COMPLETED" });
    }

    if (action === "CANCEL") {
      const res = await updateBookingStatus(dc, { id: bookingId, status: "CANCELLED" });
      return NextResponse.json({ id: res.data.booking_update?.id, status: "CANCELLED" });
    }

    if (action === "UPLOAD_PHOTOS") {
      return NextResponse.json({ id: bookingId });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Action execution failed" }, { status: 500 });
  }
}
