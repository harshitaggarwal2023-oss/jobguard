import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fastapiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
    const backendRes = await fetch(`${fastapiUrl}/health`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!backendRes.ok) {
      return NextResponse.json({
        frontend: "ok",
        backend: "error",
        detail: "Backend health check failed",
      });
    }

    const backendHealth = await backendRes.json();
    return NextResponse.json({
      frontend: "ok",
      backend: backendHealth,
    });
  } catch (e) {
    return NextResponse.json({
      frontend: "ok",
      backend: "unreachable",
      detail: "Cannot connect to backend",
    });
  }
}
