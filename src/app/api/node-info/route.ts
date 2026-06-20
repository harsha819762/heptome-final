import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const LIMIT = 60; // 60 requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute window

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  record.count += 1;
  if (record.count > LIMIT) {
    return { limited: true, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  return { limited: false, retryAfter: 0 };
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  
  const { limited, retryAfter } = isRateLimited(ip);
  if (limited) {
    return new NextResponse(
      JSON.stringify({ error: "Too Many Requests" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString(),
        },
      }
    );
  }

  return NextResponse.json({
    nodeId: process.env.INSTANCE_ID || "Local Dev Server",
  });
}
