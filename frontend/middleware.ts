import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const PROTECTED_ROUTES = ["/check", "/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Authentication enforcement for protected pages ---
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL("/auth", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // --- Rate limiting header for analyze endpoint ---
  if (pathname === "/api/analyze") {
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const response = NextResponse.next();
    response.headers.set("X-Rate-Limit-IP", ip);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/check", "/check/:path*", "/dashboard", "/dashboard/:path*", "/api/:path*"],
};
