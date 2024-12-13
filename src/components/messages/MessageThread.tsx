"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socket";
import { Message, User } from "@/types";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

interface Props {
  user: User;
  messages: Message[];
}

export default function MessageThread({ user, messages }: Props) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on("message", handleNewMessage);
    return () => {
      socket.off("message", handleNewMessage);
    };
  }, []);

  const handleNewMessage = (message: Message) => {
    // Update messages state in parent component
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputRef.current?.value.trim()) return;

    socket.emit("message", {
      content: inputRef.current.value,
      receiverId: user.id,
    });

    inputRef.current.value = "";
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{user.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.senderId === (session as any)?.user.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === (session as any)?.user.id
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

      <div className="p-4 border-t flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
