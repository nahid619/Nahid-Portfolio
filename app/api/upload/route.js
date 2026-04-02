// app/api/upload/route.js
import { NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData    = await request.formData();
    const file        = formData.get("file");
    const folder      = formData.get("folder")      || "nahid-portfolio";
    const type        = formData.get("type")        || "image";
    const oldPublicId = formData.get("oldPublicId") || null;
    const oldType     = formData.get("oldType")     || "image"; // for correct deletion

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const isCV   = type === "cv";

    let uploadOptions;

    if (isCV) {
      // Upload PDF as resource_type "image" — this is the correct Cloudinary
      // approach for PDFs. It gives a proper accessible URL that browsers can
      // open and download. resource_type "raw" causes 401/blank page issues.
      uploadOptions = {
        folder,
        resource_type: "image",
        format: "pdf",
        public_id: `cv_nahid_${Date.now()}`,
        access_mode: "public",
        type: "upload",
      };
    } else {
      // Images and SVGs
      uploadOptions = {
        folder,
        resource_type: "auto", // auto detects image/svg/video
        access_mode: "public",
        type: "upload",
        quality: "auto",
        fetch_format: "auto",
      };
    }

    console.log(`[Upload] Starting upload — type: ${type}, folder: ${folder}`);
    const result = await uploadToCloudinary(buffer, uploadOptions);
    console.log(`[Upload] Success — url: ${result.secure_url}`);

    // Delete old file from Cloudinary if replacing
    if (oldPublicId) {
      try {
        // Determine old resource type for deletion
        const oldResourceType = oldType === "cv" ? "image" : "image";
        await deleteFromCloudinary(oldPublicId, oldResourceType);
        console.log(`[Upload] Deleted old file: ${oldPublicId}`);
      } catch (e) {
        console.warn("[Upload] Could not delete old file:", e.message);
        // Non-fatal — keep going
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
    return NextResponse.json(
      { message: error.message || "Upload failed. Check Cloudinary credentials." },
      { status: 500 }
    );
  }
}