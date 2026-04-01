import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/social-links
// Optional ?showIn=footer|contact-modal|both filter
export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const showIn = searchParams.get("showIn");

    // "both" means show everywhere, so we match both "both" and the specific location
    let query = {};
    if (showIn) {
      query = { $or: [{ showIn: "both" }, { showIn: showIn }] };
    }

    const links = await db
      .collection("socialLinks")
      .find(query)
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/social-links
export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();

    const doc = {
      name: body.name || "",
      url: body.url || "",
      logo: body.logo || "",           // emoji or text abbreviation e.g. "in", "GH"
      showIn: body.showIn || "both",   // "both" | "footer" | "contact-modal"
      order: body.order || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("socialLinks").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}