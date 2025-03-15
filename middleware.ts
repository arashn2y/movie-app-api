import { NextResponse, NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { serverEnv } from "@/env/server";
import type { JwtPayload } from "jsonwebtoken";

// Define protected API routes
const protectedRoutes = ["/api/movies", "/api/users"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply authentication to protected routes
  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    const user = verify(token, serverEnv.JWT_SECRET) as JwtPayload;

    // Pass user data to API routes by adding headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-email", user.email);

    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"]
};
