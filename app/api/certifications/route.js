// app/api/certifications/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/certifications
export async function GET() {
  try {
    const db = await getDb();
    const certifications = await db
      .collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(certifications);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/certifications
export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();

    const doc = {
      title: body.title || "",
      imageUrl: body.imageUrl || "",  // Cloudinary URL
      order: body.order || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("certifications").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}