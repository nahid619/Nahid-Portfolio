import { NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/upload
// FormData fields:
//   file        — the file blob
//   folder      — cloudinary folder (optional)
//   type        — "image" | "cv"
//   oldPublicId — previous public_id to delete on replace (optional)
export async function POST(request) {
  try {
    const formData    = await request.formData();
    const file        = formData.get("file");
    const folder      = formData.get("folder")      || "nahid-portfolio";
    const type        = formData.get("type")        || "image";
    const oldPublicId = formData.get("oldPublicId") || null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const isCV   = type === "cv";

    const uploadOptions = {
      folder,
      resource_type: isCV ? "raw" : "auto",
      ...(isCV  && { public_id: `cv_nahid_${Date.now()}`, format: "pdf" }),
      ...(!isCV && { quality: "auto", fetch_format: "auto" }),
    };

    const result = await uploadToCloudinary(buffer, uploadOptions);

    // Delete old file if replacing
    if (oldPublicId) {
      try {
        await deleteFromCloudinary(oldPublicId, isCV ? "raw" : "image");
      } catch (e) {
        console.warn("Old file delete skipped:", e.message);
      }
    }

    return NextResponse.json({
      success:      true,
      url:          result.secure_url,
      publicId:     result.public_id,
      format:       result.format,
      resourceType: result.resource_type,
    });

  } catch (error) {
    console.error("[Upload Error]", error);
    return NextResponse.json({ message: error.message || "Upload failed" }, { status: 500 });
  }
}