// lib/auth.js
//
// Server-side admin check for Route Handlers.
//
// Why this exists: proxy.js (formerly middleware.js) only guards the
// /admin PAGES. Every POST / PUT / DELETE under /app/api was reachable by
// anyone with curl — no session needed to edit the profile, delete
// projects, or upload/delete files in the Cloudinary account.
//
// Next.js's own guidance is to verify auth inside each Route Handler
// rather than relying on the proxy alone, so every mutating handler calls
// this first:
//
//   const denied = await requireAdmin(request);
//   if (denied) return denied;
//
// The admin dashboard calls these endpoints with same-origin fetch(), which
// sends the NextAuth session cookie automatically, so no client changes
// are needed.

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function requireAdmin(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (token?.role === "admin") return null;
  } catch (error) {
    console.error("[auth] token check failed:", error);
  }
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
