import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { moderateContent } from "@/lib/ai";
import { verifyAccessToken } from "@/lib/token";

export async function GET(req: Request) {
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

    console.log("Fetching posts...");
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Posts fetched successfully:", posts);
    return NextResponse.json(posts, { status: 201 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log(req.headers);
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization token missing or invalid" },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    console.log(token);
    // Verify the token (optional, based on your setup)
    const userId = await verifyAccessToken(token);
    console.log(userId);

    if (!userId) {
      return NextResponse.json({ message: "Unable to verify access token" });
    } else {
      const { content, mediaUrl, mediaType, category } = await req.json();

      // Moderate content using AI
      const isAppropriate = await moderateContent(content);
      if (!isAppropriate) {
        return NextResponse.json(
          { message: "Content violates community guidelines" },
          { status: 400 }
        );
      }

      const post = await prisma.post.create({
        data: {
          content,
          mediaUrl,
          mediaType,
          category,
          userId: userId,
        },
        include: {
          user: true,
        },
      });

      return NextResponse.json(post, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
