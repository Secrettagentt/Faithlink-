import { io } from "socket.io-client"

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
  autoConnect: false,
})

socket.on("connect", () => {
  console.log("Connected to socket server")
})

socket.on("disconnect", () => {
  console.log("Disconnected from socket server")
})

socket.on("error", (error) => {
  console.error("Socket error:", error)
})