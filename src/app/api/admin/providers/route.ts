import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_id", session.user.id)
      .single();

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";

    let query = supabase
      .from("service_providers")
      .select("*, profiles!inner(name, email, image, role)")
      .order("created_at", { ascending: false });

    if (filter === "pending") {
      query = query.eq("is_verified", false);
    } else if (filter === "verified") {
      query = query.eq("is_verified", true);
    }

    const { data: rawProviders } = await query;

    const providers = (rawProviders || []).map((p: any) => ({
      ...p,
      userId: p.profile_id,
      user: p.profiles || { name: "", email: "", image: null },
      profiles: undefined,
    }));

    return NextResponse.json(providers);
  } catch (error: any) {
    console.error("Admin providers list error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_id", session.user.id)
      .single();

    if (!adminProfile || adminProfile.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { providerId, action } = await req.json();

    if (!providerId || !action) {
      return NextResponse.json({ error: "providerId and action required" }, { status: 400 });
    }

    if (action === "verify") {
      const { data: provider, error: fetchErr } = await supabase
        .from("service_providers")
        .select("profile_id")
        .eq("id", providerId)
        .single();

      if (fetchErr || !provider) {
        return NextResponse.json({ error: "Provider not found" }, { status: 404 });
      }

      const { error: spErr } = await supabase
        .from("service_providers")
        .update({ is_verified: true })
        .eq("id", providerId);

      if (spErr) throw spErr;

      await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", provider.profile_id);

      await supabase.from("notifications").insert({
        profile_id: provider.profile_id,
        title: "Account Verified!",
        message: "Congratulations! Your provider account has been verified by Heptome. You can now accept service requests.",
        type: "BOOKING_ACCEPTED",
      });

      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      const { error } = await supabase
        .from("service_providers")
        .update({ is_verified: false })
        .eq("id", providerId);

      if (error) throw error;

      return NextResponse.json({ success: true, message: "Provider rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin provider action error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
