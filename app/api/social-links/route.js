// app/api/social-links/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/social-links
// Optional ?location=navbar|footer|contact-modal|hero filter
// Returns links where showIn array includes the requested location
export async function GET(request) {
  try {
    const db  = await getDb();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("showIn") || searchParams.get("location");

    let query = {};
    if (location) {
      // showIn is now an array — match if it contains the requested location
      query = { showIn: { $in: [location] } };
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
    const db   = await getDb();
    const body = await request.json();

    const doc = {
      name:         body.name         || "",
      url:          body.url          || "",
      logo:         body.logo         || "",
      iconImageUrl: body.iconImageUrl || "",
      iconPublicId: body.iconPublicId || "",
      // showIn is now an array of locations
      showIn:       Array.isArray(body.showIn) ? body.showIn : [body.showIn || "navbar"],
      order:        body.order        || 0,
      createdAt:    new Date(),
    };

    const result = await db.collection("socialLinks").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}