import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db      = await getDb();
    const profile = await db.collection("profile").findOne({});
    if (!profile) return NextResponse.json({ message: "No profile found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db   = await getDb();
    const body = await request.json();
    const { _id, ...updateData } = body;

    await db.collection("profile").updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    // Return the updated profile so client can refresh
    const updated = await db.collection("profile").findOne({});
    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}