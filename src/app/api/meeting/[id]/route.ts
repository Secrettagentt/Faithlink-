import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../auth/verify-token/route";

export async function GET(req: Request) {
  // const { id } = params; // Extract ID from params
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

  try {
    if (id) {
      // Validate and parse the ID

      // Fetch meeting by ID for the current user
      const meeting = await prisma.meeting.findFirst({
        where: { id },
      });

      if (!meeting) {
        return NextResponse.json(
          { error: "Meeting not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(meeting, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
