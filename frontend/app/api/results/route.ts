export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const offset = (page - 1) * limit;

    try {
      const { getServerSupabase } = await import("@/lib/supabase");
      const supabase = getServerSupabase();

      const { data, error, count } = await supabase
        .from("analyses")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return NextResponse.json({
        results: data || [],
        total: count || 0,
      });
    } catch (e) {
      console.error("Supabase query error:", e);
      return NextResponse.json({ results: [], total: 0 });
    }
  } catch (e) {
    console.error("Results route error:", e);
    return NextResponse.json({ detail: "Failed to load results" }, { status: 500 });
  }
}
