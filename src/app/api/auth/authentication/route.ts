import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "../verify-token/route";

export async function GET(req: NextRequest) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsedCookies = parse(cookies);

    if (!parsedCookies.token) {
      return NextResponse.json(
        { message: "Cookies not found" },
        { status: 200 }
      );
    }

    const token = parsedCookies.token;
    const verification = await verifyAccessToken(token);

    if (!verification) {
      return NextResponse.json(
        { message: "verification failed" },
        { status: 401 }
      );
    }

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const updatedCookie = `token=${token}; Secure; HttpOnly; SameSite=Strict; Path=/; Expires=${expirationDate.toUTCString()}`;

    const user = await prisma.user.findUnique({
      where: { id: verification },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      {
        message: "success",
        id: user.id,
        user,
      },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", updatedCookie);

    return response;
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
