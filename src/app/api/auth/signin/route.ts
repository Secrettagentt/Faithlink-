import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../verify-token/route";
import cookie from "cookie";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const accessToken = await generateAccessToken(existingUser.id);

    const cookieHeader = cookie.serialize("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "strict",
    });

    const response = NextResponse.json(
      {
        message: "Sign-in successful",
        user: { email: existingUser.email, name: existingUser.name },
      },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", cookieHeader);

    return response;
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
