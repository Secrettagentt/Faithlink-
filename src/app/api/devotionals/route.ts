import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/token";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get today's date in a specific format (e.g., 'YYYY-MM-DD')
    const today = moment().startOf("day").toISOString();

    // Fetch devotionals from today and before
    const devotionals = await prisma.devotional.findMany({
      // where: {
      //   createdAt: {
      //     lte: today, // Less than or equal to today's date
      //   },
      // },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(devotionals);
  } catch (error) {
    console.error("Error fetching devotionals:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization token missing or invalid" },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    // Verify the token (optional, based on your setup)
    const userId = await verifyAccessToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { title, content, date } = await req.json();
    const formattedDate = moment(date).toISOString(); // Ensures the date is in ISO format

    const devotional = await prisma.devotional.create({
      data: {
        title,
        content,
        userId,
        createdAt: formattedDate,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(devotional, { status: 201 });
  } catch (error) {
    console.error("Error creating devotional:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
