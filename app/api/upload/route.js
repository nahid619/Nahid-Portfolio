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

    let result;

    if (isCV) {
      // Upload PDF as resource_type "raw" with access_mode "public"
      // This is the correct approach — raw keeps the PDF intact and accessible
      result = await uploadBuffer(buffer, {
        folder,
        resource_type: "raw",
        type:          "upload",
        access_mode:   "public",
        public_id:     `cv_nahid_${Date.now()}`,
        format:        "pdf",
        use_filename:  false,
      });
      console.log("[Upload CV] URL:", result.secure_url);
    } else {
      // Images and SVGs — auto detect, optimize
      result = await uploadBuffer(buffer, {
        folder,
        resource_type: "auto",
        type:          "upload",
        access_mode:   "public",
        quality:       "auto",
      });
      console.log("[Upload Image] URL:", result.secure_url);
    }

    // Delete old file from Cloudinary if replacing
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: oldResType === "cv" ? "raw" : "image",
          type: "upload",
        });
        console.log("[Upload] Deleted old:", oldPublicId);
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
      { message: error.message || "Upload failed. Check Cloudinary credentials." },
      { status: 500 }
    );
  }
}