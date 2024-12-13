"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function MeetingListPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Simulating API call for user-specific meetings
        const response = await fetch("/api/meetings?createdBy=me");
        if (!response.ok) throw new Error("Failed to fetch meetings");
        const data = await response.json();
        setMeetings(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-6">My Meetings</h1>
        {meetings.length === 0 ? (
          <p className="text-center text-gray-500">No meetings found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
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
                <Button className="mt-4 w-full bg-primary">View Details</Button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
