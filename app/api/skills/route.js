import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/skills
// Optional ?category=salesforce|sqa|web|programming filter
export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};

    const skills = await db
      .collection("skills")
      .find(query)
      .sort({ category: 1, order: 1 })
      .toArray();

    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/skills
export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();

    const doc = {
      name: body.name || "",
      iconUrl: body.iconUrl || "",       // Cloudinary URL or local path
      category: body.category || "web", // salesforce | sqa | web | programming
      order: body.order || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("skills").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}