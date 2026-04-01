import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/profile
export async function GET() {
  try {
    const db = await getDb();
    const profile = await db.collection("profile").findOne({});

    if (!profile) {
      return NextResponse.json({ message: "No profile found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT /api/profile
export async function PUT(request) {
  try {
    const db = await getDb();
    const body = await request.json();

    // Remove _id if present so we don't try to update it
    const { _id, ...updateData } = body;

    const result = await db.collection("profile").updateOne(
      {}, // match any single document
      { $set: updateData },
      { upsert: true } // create if doesn't exist
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}