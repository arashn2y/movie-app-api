import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";
import { jwtVerify, JWTPayload } from "jose";
import { serverEnv } from "@/env/server";
import { aj } from "./utils/arcjet";

// Define routes that don't require authentication
const publicRoutes = ["/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/docs"];

export async function middleware(req: NextRequest) {
  const decision = await aj.protect(req, { requested: 5 });
  console.log("Arcjet decision", decision.conclusion);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests", reason: decision.reason }, { status: 429 });
    }
    return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
  }

  // Allow public routes
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Read token from HttpOnly cookie
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the JWT token
    const secret = new TextEncoder().encode(serverEnv.JWT_SECRET);
    const { payload } = await jwtVerify<{ id: string }>(token, secret);

    if (!payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Add user info to headers so API routes can access it
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id);

    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}

// 🔹 Apply middleware only to API routes
export const config = {
  matcher: "/api/:path*"
};
