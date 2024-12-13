import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const { fileName, content } = await req.json();

    if (!fileName || !content) {
      return NextResponse.json(
        { error: "File data is missing" },
        { status: 400 }
      );
    }
    console.log(fileName, content);
    const uniqueName = `${uuidv4()}-${fileName}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Decode base64 file content and save it
    const buffer = Buffer.from(content, "base64");
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;
    console.log(fileUrl);
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
