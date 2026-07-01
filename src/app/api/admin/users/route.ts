import { getServerDC } from "@/lib/firebase/server-dc";
import { listAllUsers, updateUserRole } from "@dataconnect/generated";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const dc = getServerDC();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const res = await listAllUsers(dc);
    let users = res.data.users || [];

    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    return NextResponse.json(users.slice(0, 50));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ error: "userId and role required" }, { status: 400 });
    }

    const dc = getServerDC();
    const res = await updateUserRole(dc, { id: userId, role });

    return NextResponse.json({ id: res.data.user_update?.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
