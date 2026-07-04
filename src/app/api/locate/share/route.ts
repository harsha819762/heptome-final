import { NextResponse } from "next/server";
import { setLocation } from "@/lib/location-store";

export async function POST(req: Request) {
  try {
    const { bookingId, lat, lng } = await req.json();
    if (!bookingId || lat == null || lng == null) {
      return NextResponse.json({ error: "bookingId, lat, lng required" }, { status: 400 });
    }
    setLocation(bookingId, lat, lng);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }
}
