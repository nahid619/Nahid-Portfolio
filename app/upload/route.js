import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST /api/upload
// Body: FormData with field "file" and optional "folder" and "type"
// type: "image" | "cv" (PDF)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "nahid-portfolio";
    const type = formData.get("type") || "image"; // "image" or "cv"

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadOptions = {
      folder,
      resource_type: type === "cv" ? "raw" : "image",
      // For CV/PDF, preserve the original filename
      ...(type === "cv" && {
        public_id: `cv_nahid_hasan_${Date.now()}`,
        format: "pdf",
      }),
      // For images, auto-optimize
      ...(type === "image" && {
        quality: "auto",
        fetch_format: "auto",
      }),
    };

    const result = await uploadToCloudinary(buffer, uploadOptions);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}