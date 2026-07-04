import { getServerDC } from "@/lib/firebase/server-dc";
import { listProviderBookings, getUserProfile } from "@dataconnect/generated";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const dc = getServerDC();

    const [profileRes, bookingsRes] = await Promise.all([
      getUserProfile(dc, { id: "a2b109c1-4560-4b21-827d-08e17812ef10" }),
      listProviderBookings(dc, { partnerId: "a2b109c1-4560-4b21-827d-08e17812ef10" }),
    ]);

    const profile = profileRes.data.user;
    const bookings = (bookingsRes.data.bookings || []).map((b) => ({
      id: b.id,
      bookingNumber: b.id.slice(0, 8).toUpperCase(),
      serviceName: b.serviceCategory.name,
      serviceDescription: b.partnerNotes || "",
      specialInstructions: "",
      scheduledDate: b.bookingDate.split("T")[0],
      scheduledTime: b.bookingDate.split("T")[1]?.slice(0, 5) || "",
      status: b.status,
      totalPrice: b.totalAmount,
      customerName: b.customer.name,
      customerPhone: b.customer.phoneNumber,
      customerAddress: {
        street: b.customer.address || "",
        city: b.customer.address?.split(",")[1]?.trim() || "",
        flatNo: "",
        pincode: b.customer.address?.match(/\d{6}/)?.[0] || "",
      },
      beforePhotos: [],
      afterPhotos: [],
    }));

    const completedJobs = bookings.filter((b) => b.status === "COMPLETED");
    const activeJobs = bookings.filter(
      (b) => b.status === "ACCEPTED" || b.status === "CONFIRMED" || b.status === "IN_PROGRESS"
    );

    return NextResponse.json({
      provider: {
        id: "a2b109c1-4560-4b21-827d-08e17812ef10",
        bio: "",
        rating: profile?.rating || 0,
        experience: 0,
        totalJobs: completedJobs.length,
        completionRate: bookings.length > 0 ? Math.round((completedJobs.length / bookings.length) * 100) : 0,
        isVerified: true,
        isAvailable: true,
        serviceTypes: [],
      },
      stats: {
        totalEarnings: 0,
        completedJobsCount: completedJobs.length,
        activeJobsCount: activeJobs.length,
        pendingRequestsCount: 0,
      },
      activeJobs,
      completedJobs: completedJobs.slice(0, 10),
      pendingRequests: [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load dashboard data" }, { status: 500 });
  }
}
