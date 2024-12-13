import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const count = await prisma.quiz.count()
    const skip = Math.floor(Math.random() * count)
    
    const quiz = await prisma.quiz.findFirst({
      skip,
      take: 1,
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Error fetching random quiz:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}