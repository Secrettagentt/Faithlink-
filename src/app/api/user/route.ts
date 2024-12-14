import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

  try {
    if (userId) {
      // Validate and parse the ID

      // Fetch meeting by ID for the current user
      const meeting = await prisma.user.findFirst({
        where: { id: userId },
      });

      if (!meeting) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(meeting, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching User:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
