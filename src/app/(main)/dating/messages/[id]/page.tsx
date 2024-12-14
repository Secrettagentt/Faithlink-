"use client";

import { motion } from "framer-motion";
// import { useSession } from "next-auth/react";
// import MessageList from "@/components/messages/MessageList"
// import MessageThread from "@/components/messages/MessageThread"
import MessageThread from "@/components/messages/MessageThread";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MessagesPage() {
  const { id } = useParams();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary">
              <Link href={`/`}>FaithLink</Link>
            </h2>
            <nav>
              <ul className="flex gap-6 items-center">
                <li>
                  <Link
                    href="/meeting"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Meetings
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/devotionals"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Devotionals
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/posts"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Posts
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div className="bg-gradient-to-b from-secondary/30 to-background ">
        <div className="max-w-[900px] mx-auto px-4 py-8 ">
          <div className="">
            {/* <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <MessageList
              onSelectUser={setSelectedUser}
              user={[]}
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </motion.div> */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className=""
            >
              {/* {selectedUser ? ( */}
              <MessageThread userId={id as string} />
              {/* ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )} */}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
