import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    console.log("Inviting:", email, "as role:", role);

    // ✅ Use environment-based redirect URL (falls back to localhost in dev)
    const baseUrl = process.env.SUPABASE_SITE_URL || "http://localhost:3000";
    const redirectTo = `${baseUrl}/set-password`;

    // 🪄 Debug log to confirm what Supabase will actually use
    console.log("🔗 redirectTo:", redirectTo);

    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo,
      });

    if (inviteError) throw inviteError;

    const userId = inviteData.user?.id;
    if (!userId) throw new Error("Failed to retrieve user ID");

    console.log("✅ New user ID:", userId);

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ id: userId, role });

    if (roleError) throw roleError;

    return NextResponse.json({ message: "Invitation sent successfully" });
  } catch (error: any) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
