import { NextResponse } from "next/server";
import { getLocation } from "@/lib/location-store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;
  const loc = getLocation(bookingId);
  if (!loc) return NextResponse.json({ lat: null, lng: null, timestamp: null });
  return NextResponse.json(loc);
}
