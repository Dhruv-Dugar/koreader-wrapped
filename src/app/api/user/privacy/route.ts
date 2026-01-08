import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await clientPromise;
    const user = await User.findById(session.user.id);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ privacy: user.privacy });
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { privacy } = await req.json();

    if (!["public", "private"].includes(privacy)) {
        return NextResponse.json({ error: "Invalid privacy setting" }, { status: 400 });
    }

    await clientPromise;
    const user = await User.findByIdAndUpdate(
        session.user.id,
        { privacy },
        { new: true }
    );

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ privacy: user.privacy });
}
