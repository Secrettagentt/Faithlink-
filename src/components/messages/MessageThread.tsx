"use client";

import { useGetMessages, useSendMessage } from "@/api/message";
import { useGetUserById } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/context";
import { socket } from "@/lib/socket";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  userId: string;
}

export default function MessageThread({ userId }: Props) {
  const { user } = useCurrentUser();
  const { userDetail } = useGetUserById(userId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | any>(null);
  const { sendMessage, isMessaging } = useSendMessage();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const { messages: initialMessages, refetchMessage } = useGetMessages(userId);

  // Local state for messages
  const [messages, setMessages] = useState<any>(initialMessages || []);

  const handleSend = useCallback(async () => {
    try {
      const messageContent = inputRef.current?.value.trim();
      if (!messageContent) return;

      const newMessage = {
        content: messageContent,
        receiverId: userId,
        senderId: user?.id,
        id: Date.now(), // Temporary ID for the message
      };

      // Emit the message to the server
      socket.emit("message", newMessage);

      // Add message to local state for immediate display
      // setMessages((prev) => [...prev, newMessage]);

      await sendMessage({
        content: messageContent,
        receiverId: userId,
      });

      scrollToBottom();
      inputRef.current.value = ""; // Clear input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [sendMessage, userId, user?.id, refetchMessage, scrollToBottom]);

  useEffect(() => {
    // Listen for incoming messages
    const handleIncomingMessage = (message: any) => {
      console.log(message);
      setMessages((prev: any) => {
        const isDuplicate = prev.some((msg: any) => msg.id === message.id);
        return isDuplicate ? prev : [...prev, message];
      });
      scrollToBottom();
    };

    socket.emit("joinRoom", user?.id); // Join the user's room upon connection
    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, [scrollToBottom]);

  useEffect(() => {
    setMessages(initialMessages || []);
    scrollToBottom();
  }, [initialMessages, scrollToBottom]);

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{userDetail?.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: any) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.senderId === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === user?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2 w-full">
        <div className="w-full">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
        <Button loading={isMessaging} onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
