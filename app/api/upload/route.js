// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

export async function POST(request) {
  try {
    const formData    = await request.formData();
    const file        = formData.get("file");
    const folder      = formData.get("folder")      || "nahid-portfolio";
    const type        = formData.get("type")        || "image";
    const oldPublicId = formData.get("oldPublicId") || null;
    const oldResType  = formData.get("oldResType")  || "image";

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const isCV   = type === "cv";

    // KEY FIX: Upload PDF as resource_type "image" with format "pdf"
    // This stores it as an image-type asset which Cloudinary serves publicly
    // without authentication. resource_type "raw" always gives 401 on free tier.
    const uploadOptions = {
      folder,
      resource_type: "image",
      format:        isCV ? "pdf" : undefined,
      access_mode:   "public",
      type:          "upload",
      ...(isCV && { public_id: `cv_nahid_${Date.now()}` }),
      ...(!isCV && { quality: "auto" }),
    };

    const result = await uploadBuffer(buffer, uploadOptions);
    console.log(`[Upload] OK — ${result.secure_url}`);

    // Delete old file if replacing
    if (oldPublicId) {
      try {
        // Both image and image/pdf are resource_type "image"
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: "image",
          type: "upload",
        });
        console.log(`[Upload] Deleted old: ${oldPublicId}`);
      } catch (e) {
        console.warn("[Upload] Could not delete old:", e.message);
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
      { message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}