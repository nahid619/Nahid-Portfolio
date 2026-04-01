import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    // Ping the database to confirm connection
    await db.command({ ping: 1 });

    // List existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful ✅",
      database: db.databaseName,
      collections: collectionNames,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed ❌",
        error: error.message,
      },
      { status: 500 }
    );
  }
}