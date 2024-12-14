import { prisma } from "@/lib/prisma";
import moment from "moment";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../auth/verify-token/route";

export async function GET(req: Request) {
  // const { id } = params; // Extract ID from params

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

  try {
    if (userId) {
      // Fetch all meetings
      const meetings = await prisma.meeting.findMany({
        where: { userId },
      });
      const parsedMeetingData = meetings.map((meeting) => ({
        ...meeting,
        date: moment(meeting.date).toISOString(),
      }));

      const sortedMeetingData = parsedMeetingData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return NextResponse.json(
        { data: sortedMeetingData, total: sortedMeetingData.length },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
    const newMeeting = await req.json();

    if (newMeeting.date) {
      const parsedDate = new Date(newMeeting.date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format. Please provide a valid date." },
          { status: 400 }
        );
      }
      newMeeting.date = parsedDate.toISOString();
    }

    const createdMeeting = await prisma.meeting.create({
      data: {
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        token: newMeeting.token,
        userId,
      },
    });

    return NextResponse.json(createdMeeting, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const updatedMeeting = await req.json();
    const meetingToUpdate = await prisma.meeting.update({
      where: { id: parseInt(id, 10) },
      data: updatedMeeting,
    });
    return NextResponse.json(meetingToUpdate, { status: 200 });
  } catch (error) {
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.meeting.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json(
      { message: "Meeting deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
