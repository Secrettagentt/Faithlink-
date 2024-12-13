import { Server } from "socket.io"
import { NextApiRequest } from "next"
import { NextApiResponseServerIO } from "@/types/socket"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected")

      socket.on("message", async (data) => {
        try {
          const session = await getServerSession(authOptions)
          if (!session?.user) return

          const message = await prisma.message.create({
            data: {
              content: data.content,
              senderId: session.user.id,
              receiverId: data.receiverId,
            },
            include: {
              sender: true,
              receiver: true,
            },
          })

          io.emit("message", message)
        } catch (error) {
          console.error("Socket message error:", error)
        }
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected")
      })
    })
  }

  res.end()
}