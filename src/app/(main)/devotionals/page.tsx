"use client";

import { useGetAllDevotions } from "@/api/devotion"; // Adjusted to reflect Devotion API
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DevotionListPage() {
  const { devotions, isPendingDevotions } = useGetAllDevotions(); // Adjusted to reflect Devotion data

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filteredDevotions = devotions?.filter((devotion: any) => {
    const matchesTitle = devotion.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate
      ? new Date(devotion.createdAt).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
      : true;
    return matchesTitle && matchesDate;
  });

  const router = useRouter();

  if (isPendingDevotions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
                <li>
                  <Link href={`/devotionals/new`}>
                    <Button>Create Devotion</Button>
                  </Link>
                </li>
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
          <h1 className="text-3xl font-bold text-center mb-6">My Devotions</h1>

          {/* Search and Date Filter */}
          <div className="flex items-center gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search by title..."
              className="border rounded-lg p-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Input
              type="date"
              className="border rounded-lg p-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {filteredDevotions?.length === 0 ? (
            <p className="text-center text-gray-500">No devotions found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevotions?.map((devotion: any) => (
                <div
                  key={devotion.id}
                  className="bg-card p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-lg font-semibold">{devotion.title}</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    {devotion.description}
                  </p>
                  <p className="text-sm mt-4 text-primary font-medium">
                    {new Date(devotion.createdAt).toLocaleString()}
                  </p>
                  <Link href={`/devotionals/${devotion?.id}`}>
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
