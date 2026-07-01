import { getAdminAuth } from "@/lib/firebase/server";
import { getServerDC } from "@/lib/firebase/server-dc";
import { listAllUsers, listAllBookings } from "@dataconnect/generated";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = await getAdminAuth().verifyIdToken(token);

    const dc = getServerDC();
    const [usersRes, bookingsRes] = await Promise.all([
      listAllUsers(dc),
      listAllBookings(dc),
    ]);

    const users = usersRes.data.users || [];
    const bookings = bookingsRes.data.bookings || [];

    const totalUsers = users.length;
    const totalProviders = users.filter((u) => u.role === "PARTNER").length;
    const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
    const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
    const inProgressBookings = bookings.filter((b) => b.status === "IN_PROGRESS").length;
    const totalRevenue = bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProviders,
        totalCustomers,
        totalBookings,
        completedBookings,
        pendingBookings,
        inProgressBookings,
        totalRevenue,
      },
      recentUsers: users.slice(0, 8),
      pendingProviders: [],
    });
  } catch (error: any) {
    return NextResponse.json({
      stats: {
        totalUsers: 0,
        totalProviders: 0,
        totalCustomers: 0,
        totalBookings: 0,
        completedBookings: 0,
        pendingBookings: 0,
        inProgressBookings: 0,
        totalRevenue: 0,
      },
      recentUsers: [],
      pendingProviders: [],
    });
  }
}
