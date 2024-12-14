import { NextRequest, NextResponse } from "next/server";
import { Server as SocketServer } from "socket.io";

let io: SocketServer | undefined;

export const GET = async (req: NextRequest) => {
  const { socket } = (req as any).nodeServer; // Extend Next.js behavior

  if (!io) {
    console.log("Initializing Socket.io server...");

    io = new SocketServer(socket, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("joinRoom", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on("message", async (data) => {
        // Logic here remains as is
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ message: "Socket server initialized" });
};
