"use client";

import { motion } from "framer-motion";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import MessageList from "@/components/messages/MessageList"
// import MessageThread from "@/components/messages/MessageThread"
import MessageThread from "@/components/messages/MessageThread";
import { Message, User } from "@/types";

export default function MessagesPage() {
  // const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages/${userId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
        >
          {/* <MessageList onSelectUser={setSelectedUser} /> */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2"
        >
          {selectedUser ? (
            <MessageThread user={selectedUser} messages={messages} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
