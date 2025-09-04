import { NextRequest, NextResponse } from "next/server";
import { streamVideo } from "@/lib/stream-video";

export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    // Generate a token for the agent
    const token = streamVideo.generateUserToken({
      user_id: agentId,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating agent token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
