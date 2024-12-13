import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const devotionals = await prisma.devotional.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(devotionals)
  } catch (error) {
    console.error("Error fetching devotionals:", error)
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

    const { title, content } = await req.json()

    const devotional = await prisma.devotional.create({
      data: {
        title,
        content,
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(devotional, { status: 201 })
  } catch (error) {
    console.error("Error creating devotional:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}