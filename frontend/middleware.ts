import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Rate limiting header for analyze endpoint
  if (request.nextUrl.pathname === "/api/analyze") {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const response = NextResponse.next();
    response.headers.set("X-Rate-Limit-IP", ip);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
