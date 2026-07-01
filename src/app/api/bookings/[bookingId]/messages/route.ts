import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const body = await req.json();
    const { message } = body;
    if (!message) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }
    return NextResponse.json({ id: `msg-${Date.now()}`, message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
