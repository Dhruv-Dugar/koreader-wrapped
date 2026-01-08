import { NextRequest, NextResponse } from "next/server";
import { parseKoReaderDb } from "@/lib/sqlite-parser";
import { computeStatistics } from "@/lib/stats-engine";
import connectDB from "@/lib/mongoose";
import ReadingStats from "@/models/readingStats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    
    const { books, pageStats } = await parseKoReaderDb(bytes);

    if (books.length === 0) {
      return NextResponse.json(
        { error: "No reading data found in this file" },
        { status: 400 }
      );
    }

    const processedStats = computeStatistics(books, pageStats);

    const readingStats = new ReadingStats({
      ...processedStats,
      pageStats,
      userId: session.user.id,
    });
    await readingStats.save();

    return NextResponse.json({
      id: readingStats._id,
      ...processedStats,
      pageStats,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
