// app/api/categories/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/categories
// Optional ?section=skills|projects filter
export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const query = section ? { section } : {};
    const categories = await db
      .collection("categories")
      .find(query)
      .sort({ order: 1 })
      .toArray();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const doc = {
      name:      body.name    || "",
      value:     body.value   || "",   // slug used as filter param
      section:   body.section || "skills", // "skills" | "projects"
      order:     body.order   || 0,
      createdAt: new Date(),
    };
    const result = await db.collection("categories").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}