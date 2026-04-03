// app/api/social-links/[id]/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request, { params }) {
  try {
    const db     = await getDb();
    const { id } = await params;
    const body   = await request.json();
    const { _id, ...updateData } = body;

    // Ensure showIn is always stored as an array
    if (updateData.showIn && !Array.isArray(updateData.showIn)) {
      updateData.showIn = [updateData.showIn];
    }

    const result = await db
      .collection("socialLinks")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const db     = await getDb();
    const { id } = await params;

    const result = await db
      .collection("socialLinks")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}