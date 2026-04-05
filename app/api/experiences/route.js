// app/api/experiences/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/experiences
// Returns all experiences sorted by startDate descending (latest first)
export async function GET() {
  try {
    const db = await getDb();
    const experiences = await db
      .collection("experiences")
      .find({})
      .sort({ startDate: -1 })
      .toArray();

    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/experiences
export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();

    const doc = {
      role: body.role || "",
      company: body.company || "",
      companyLogoUrl: body.companyLogoUrl || "",
      companyUrl: body.companyUrl || "",
      employmentType: body.employmentType || "Full-time",
      location: body.location || "",
      startDate: body.startDate || "",   // "YYYY-MM"
      endDate: body.endDate || null,     // "YYYY-MM" or null
      isCurrent: body.isCurrent || false,
      description: body.description || "",
      skills: body.skills || [],         // array of strings
      order: body.order || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("experiences").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}