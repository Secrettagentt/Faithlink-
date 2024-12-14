// /app/api/meetings/[id]/route.ts
import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { channelName, date }: { channelName: string; date: string } =
      await req.json();

    const agoraAppId =
      process.env.AGORA_APP_ID || "998e1c904157414e9010380f7931bd15";
    const agoraAppCertificate =
      process.env.AGORA_APP_CERTIFICATE || "020b0e6e0b5c4333bb459cf118bf6250";

    const startDateObject = new Date(date);
    const expirationTimeInSeconds =
      Math.floor(startDateObject.getTime() / 1000) + 5 * 24 * 60 * 60;

    const token = RtcTokenBuilder.buildTokenWithUid(
      agoraAppId,
      agoraAppCertificate,
      channelName,
      Math.floor(Math.random() * 100),
      RtcRole.PUBLISHER,
      expirationTimeInSeconds
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
