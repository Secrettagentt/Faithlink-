import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "./prisma";

const secretKey: string = process.env.JWT_SECRET_KEY || "";

export async function generateAccessToken(userId: string): Promise<string> {
  return jwt.sign({ userId }, secretKey, { expiresIn: "30d" });
}

export async function verifyAccessToken(token: string) {
  try {
    const verify = jwt.verify(token, secretKey) as JwtPayload;

    const userId = verify.userId as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    return userId;
  } catch (e) {
    console.error("Invalid token:", (e as Error).message);
  }
}
