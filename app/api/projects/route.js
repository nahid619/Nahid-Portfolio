// app/api/projects/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/projects
// Optional ?category=sqa|salesforce|web filter
export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};

    const projects = await db
      .collection("projects")
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/projects
export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();

    const doc = {
      title: body.title || "",
      category: body.category || "web",       // sqa | salesforce | web
      description: body.description || "",
      highlights: body.highlights || [],       // array of strings
      challenges: body.challenges || "",
      techStack: body.techStack || [],         // array of strings
      projectImageUrl: body.projectImageUrl || "",
      videoUrl: body.videoUrl || "",
      githubUrl: body.githubUrl || "",
      liveUrl: body.liveUrl || "",
      publishedDate: body.publishedDate || new Date().toISOString().split("T")[0],
      order: body.order || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("projects").insertOne(doc);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}