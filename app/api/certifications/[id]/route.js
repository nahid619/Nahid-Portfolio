import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT /api/certifications/[id]
export async function PUT(request, { params }) {
  try {
    const db = await getDb();
    const { id } = await params;
    const body = await request.json();
    const { _id, ...updateData } = body;

    const result = await db
      .collection("certifications")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/certifications/[id]
export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const { id } = await params;

    const result = await db
      .collection("certifications")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}