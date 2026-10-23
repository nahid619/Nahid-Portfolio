// app/api/certifications/route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { normalizeCert } from "@/lib/certFields";

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
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const db = await getDb();
    const body = await request.json();

    const doc = { ...normalizeCert(body), createdAt: new Date() };

    if (!doc.title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const result = await db.collection("certifications").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
