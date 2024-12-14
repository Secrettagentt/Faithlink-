import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    // Validate authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization token missing or invalid" },
        { status: 401 }
      );
    }

    // Extract and verify token
    const token = authHeader.split(" ")[1];
    const userId = await verifyAccessToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { content, receiverId } = await req.json();

    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
