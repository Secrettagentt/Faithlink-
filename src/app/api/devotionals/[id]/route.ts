import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/token";
import { NextResponse } from "next/server";

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
    console.log(id);
    if (id) {
      // Validate and parse the ID

      // Fetch meeting by ID for the current user
      const devotional = await prisma.devotional.findFirst({
        where: { id },
      });

      if (!devotional) {
        return NextResponse.json(
          { error: "Devotional not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(devotional, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching Devotional:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
