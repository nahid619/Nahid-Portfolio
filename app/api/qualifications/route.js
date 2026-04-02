// app/api/qualifications/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db   = await getDb();
    const docs = await db.collection("qualifications").find({}).sort({ order: 1 }).toArray();
    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db   = await getDb();
    const body = await request.json();
    const doc  = {
      title:       body.title       || "",
      subtitle:    body.subtitle    || "",
      institution: body.institution || "",
      period:      body.period      || "",
      detail:      body.detail      || "",
      highlights:  body.highlights  || [],   // array of strings
      side:        body.side        || "left", // "left" | "right"
      order:       body.order       || 0,
      createdAt:   new Date(),
    };
    const result = await db.collection("qualifications").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}