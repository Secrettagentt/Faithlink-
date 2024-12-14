import { prisma } from "@/lib/prisma";
import { Server as HttpServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketServer } from "socket.io";
import { verifyAccessToken } from "../auth/verify-token/route";

// Extend Next.js Response to include Socket.io
interface ExtendedNextApiResponse extends NextApiResponse {
  socket: {
    server: HttpServer & {
      io?: SocketServer;
    };
  };
}

const SocketHandler = async (
  req: NextApiRequest,
  res: ExtendedNextApiResponse
) => {
  if (!res.socket?.server?.io) {
    console.log("Initializing Socket.io server...");

    // Create a new Socket.io server
    const io = new SocketServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*", // Adjust based on your CORS policy
        methods: ["GET", "POST"],
      },
    });

    // Attach the Socket.io server to the Next.js response
    res.socket.server.io = io;

    // Handle socket connections
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Handle the 'joinRoom' event to subscribe users to their respective rooms
      socket.on("joinRoom", (userId: string) => {
        socket.join(userId); // Join the room based on userId
        console.log(`User ${userId} joined room`);
      });

      // Listen for message events
      socket.on("message", async (data) => {
        try {
          const authHeader = req.headers.authorization;

          // Validate the authorization header
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            socket.emit("error", {
              message: "Authorization token missing or invalid",
            });
            return;
          }

          // Extract and verify the access token
          const token = authHeader.split(" ")[1];
          const userId = await verifyAccessToken(token);

          if (!userId) {
            socket.emit("error", { message: "Invalid or expired token" });
            return;
          }

          // Save the message to the database
          const message = await prisma.message.create({
            data: {
              content: data.content,
              senderId: userId,
              receiverId: data.receiverId,
            },
            include: {
              sender: true,
              receiver: true,
            },
          });

          // Emit the message to the receiver's room
          io.to(data.receiverId).emit("message", message); // Emit only to the receiver's room
        } catch (error) {
          console.error("Error handling message event:", error);
          socket.emit("error", { message: "Internal server error" });
        }
      });

      // Handle client disconnections
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  } else {
    console.log("Socket.io server already initialized");
  }

  res.status(200).end();
};

export default SocketHandler;
