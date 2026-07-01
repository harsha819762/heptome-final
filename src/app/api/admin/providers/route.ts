import { getServerDC } from "@/lib/firebase/server-dc";
import { listAllUsers } from "@dataconnect/generated";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const dc = getServerDC();
    const res = await listAllUsers(dc, { role: "PARTNER" });

    const providers = (res.data.users || []).map((u) => ({
      id: u.id,
      userId: u.id,
      isVerified: true,
      experience: 0,
      rating: u.rating || 0,
      totalJobs: 0,
      phone: u.phoneNumber,
      address: u.address,
      serviceTypes: [],
      createdAt: new Date().toISOString(),
      user: { name: u.name, email: u.email, image: u.avatarUrl },
    }));

    return NextResponse.json(providers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
