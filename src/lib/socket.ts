import { io } from "socket.io-client";

export const socket = io("/api/socket", {
  autoConnect: true,
  transports: ["websocket"],
  reconnectionAttempts: 3,
  reconnectionDelay: 3000,
});

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});
