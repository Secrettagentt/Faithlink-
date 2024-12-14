"use client";

import { useGetAllMeetings } from "@/api/meeting";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function MeetingListPage() {
  const { meetings, isPendingMeetings } = useGetAllMeetings();

  const router = useRouter();

  if (isPendingMeetings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  //   if (errorMeetings) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <p className="text-red-500">{errorMeetings}</p>
  //       </div>
  //     );
  //   }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary">
              <Link href={`/`}>FaithConnect</Link>
            </h2>
            <nav>
              <ul className="flex gap-6 items-center">
                <li>
                  <Link href={`/meeting/new`}>
                    <Button className="">Create Meeting</Button>
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
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto w-full"
        >
          <h1 className="text-3xl font-bold text-center mb-6">My Meetings</h1>
          {meetings?.data?.length === 0 ? (
            <p className="text-center text-gray-500">No meetings found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings?.data?.map((meeting: any) => (
                <div
                  key={meeting.id}
                  className="bg-card p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-lg font-semibold">{meeting.title}</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    {meeting.description}
                  </p>
                  <p className="text-sm mt-4 text-primary font-medium">
                    {new Date(meeting.date).toLocaleString()}
                  </p>
                  <Link href={`/meeting/${meeting?.id}`}>
                    <Button className="mt-4 w-full bg-primary">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
