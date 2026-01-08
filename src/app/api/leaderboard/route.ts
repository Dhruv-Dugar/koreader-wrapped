import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import ReadingStats from "@/models/readingStats";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await clientPromise;

    const leaderboard = await ReadingStats.aggregate([
      {
        $sort: { "core.totalPagesRead": -1 },
      },
      {
        $group: {
          _id: "$userId",
          total_pages_read: { $first: "$core.totalPagesRead" },
          doc_id: { $first: "$_id" },
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.privacy": "public",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          totalPagesRead: "$total_pages_read",
        },
      },
    ]);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
