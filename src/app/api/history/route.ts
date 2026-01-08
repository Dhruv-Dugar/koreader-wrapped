import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import ReadingStats from "@/models/readingStats";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await clientPromise;
    const history = await ReadingStats.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .select("_id createdAt core.totalBooksStarted core.totalPagesRead");

    return NextResponse.json(history);
}
