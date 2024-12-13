// /app/api/meetings/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const { id } = params;

  try {
    if (!id) {
      const meetings: any = await prisma.meeting.findMany();
      const parsedMeetingData: any = meetings.map((meeting: any) => ({
        ...meeting,
        date: moment(meeting.date).toISOString(),
      }));
      const sortedMeetingData = parsedMeetingData.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return NextResponse.json(sortedMeetingData, { status: 200 });
    } else {
      const meeting = await prisma.meeting.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!meeting) {
        return NextResponse.json(
          { error: "Meeting not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(meeting, { status: 200 });
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
    const newMeeting = await req.json();
    const createdMeeting = await prisma.meeting.create({
      data: newMeeting,
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
