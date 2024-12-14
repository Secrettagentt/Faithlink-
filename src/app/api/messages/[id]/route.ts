import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../auth/verify-token/route";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const id = url.pathname.split("/").filter(Boolean).pop() as string;

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
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: id },
          { senderId: id, receiverId: userId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
