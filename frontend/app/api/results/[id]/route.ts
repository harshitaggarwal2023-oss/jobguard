export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { getServerSupabase } = await import("@/lib/supabase");
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error || !data) {
      return NextResponse.json({ detail: "Result not found" }, { status: 404 });
    }

    // Check access: public or owner
    if (!data.is_public) {
      const session = await getServerSession(authOptions);
      const userId = session?.user ? (session.user as { id?: string }).id : null;
      if (data.user_id && data.user_id !== userId) {
        return NextResponse.json({ detail: "Access denied" }, { status: 403 });
      }
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Result detail error:", e);
    return NextResponse.json({ detail: "Failed to load result" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const { id } = params;

    const { getServerSupabase } = await import("@/lib/supabase");
    const supabase = getServerSupabase();

    // Soft delete
    const { error } = await supabase
      .from("analyses")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete result error:", e);
    return NextResponse.json({ detail: "Failed to delete result" }, { status: 500 });
  }
}
