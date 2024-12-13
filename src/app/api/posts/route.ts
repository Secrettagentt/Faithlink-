import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { moderateContent } from "@/lib/ai"

export async function GET() {
  try {
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
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content, mediaUrl, mediaType, category } = await req.json()

    // Moderate content using AI
    const isAppropriate = await moderateContent(content)
    if (!isAppropriate) {
      return NextResponse.json(
        { message: "Content violates community guidelines" },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        content,
        mediaUrl,
        mediaType,
        category,
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}