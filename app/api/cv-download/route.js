// app/api/cv-download/route.js
// Proxies the CV PDF from Cloudinary through Next.js so the browser never
// hits Cloudinary directly — avoids the 401 on authenticated delivery.

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // 1. Get the stored CV URL from the profile document
    const db      = await getDb();
    const profile = await db.collection("profile").findOne({});

    if (!profile?.cvFileUrl) {
      return NextResponse.json({ message: "No CV uploaded yet." }, { status: 404 });
    }

    const cvUrl = profile.cvFileUrl;

    // 2. Generate a short-lived signed URL so Cloudinary serves it with full auth
    //    This works even if the delivery type ends up as "authenticated".
    //    Extract the public_id from the stored URL (strip version + extension).
    //    Stored URL pattern:
    //      https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<folder>/<file>.pdf
    const publicId = profile.cvPublicId || extractPublicId(cvUrl);

    let fetchUrl = cvUrl; // default: try the stored URL directly

    if (publicId) {
      // Generate a signed URL valid for 60 seconds
      fetchUrl = cloudinary.url(publicId, {
        resource_type: "image",
        type:          "upload",
        sign_url:      true,
        expires_at:    Math.floor(Date.now() / 1000) + 60,
        format:        "pdf",
      });
    }

    // 3. Fetch the PDF server-side (Next.js server has no auth restrictions)
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      console.error("[cv-download] Cloudinary fetch failed:", response.status, fetchUrl);
      return NextResponse.json(
        { message: `Could not retrieve CV (Cloudinary ${response.status})` },
        { status: 502 }
      );
    }

    // 4. Stream the PDF back to the browser with download headers
    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": 'attachment; filename="Nahid-Hasan-CV.pdf"',
        "Cache-Control":       "no-store",
      },
    });

  } catch (error) {
    console.error("[cv-download] Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * Fallback: extract Cloudinary public_id from a full secure URL.
 * e.g. https://res.cloudinary.com/cloud/image/upload/v123/folder/file.pdf
 *   → "folder/file"  (no extension, no version)
 */
function extractPublicId(url) {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;
    // Strip file extension
    return match[1].replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}