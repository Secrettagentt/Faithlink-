// /app/api/meetings/[id]/route.ts
import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      channelName,
      startDate,
    }: { channelName: string; startDate: string } = await req.json();

    const agoraAppId = process.env.AGORA_APP_ID || "";
    const agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE || "";

    const startDateObject = new Date(startDate);
    const expirationTimeInSeconds =
      Math.floor(startDateObject.getTime() / 1000) + 86400;

    const token = RtcTokenBuilder.buildTokenWithUid(
      agoraAppId,
      agoraAppCertificate,
      channelName,
      0, // Assuming 0 as default userId
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
