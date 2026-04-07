export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeFormData } from "@/lib/sanitize";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Parse and sanitize input
    const body = await request.json();
    const sanitized = sanitizeFormData(body);

    // Get session (optional — anonymous allowed)
    let userId: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user && (session.user as { id?: string }).id) {
        userId = (session.user as { id?: string }).id || null;
      }
    } catch {
      // Anonymous is fine
    }

    // Call FastAPI backend
    const fastapiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
    const apiKey = process.env.INTERNAL_API_KEY || "";

    const fastapiResponse = await fetch(`${fastapiUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(sanitized),
      signal: AbortSignal.timeout(30000),
    });

    if (!fastapiResponse.ok) {
      const errorText = await fastapiResponse.text().catch(() => "Unknown error");
      console.error("FastAPI error:", fastapiResponse.status, errorText);
      return NextResponse.json(
        { detail: "Analysis service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    const prediction = await fastapiResponse.json();

    // Generate a result ID
    const resultId = uuidv4();

    // Try to save to Supabase (optional — don't fail if Supabase is not configured)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey && supabaseUrl !== "https://placeholder.supabase.co") {
        const { getServerSupabase } = await import("@/lib/supabase");
        const supabase = getServerSupabase();

        await supabase.from("analyses").insert({
          id: resultId,
          user_id: userId,
          job_title: prediction.job_title,
          company_name: prediction.company_name,
          form_data: sanitized,
          verdict: prediction.verdict,
          fraud_probability: prediction.fraud_probability,
          risk_scores: prediction.risk_scores,
          top_shap_features: prediction.top_shap_features,
          red_flags: prediction.red_flags,
          explanation: prediction.explanation,
          is_public: !userId,
        });
      }
    } catch (e) {
      console.error("Supabase save error (non-fatal):", e);
    }

    return NextResponse.json({ ...prediction, id: resultId });
  } catch (e) {
    console.error("Analyze route error:", e);
    return NextResponse.json(
      { detail: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
