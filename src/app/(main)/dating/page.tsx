"use client";

import { useGetAllUsers } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/context";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function UserListPage() {
  const { usersData, usersLoading } = useGetAllUsers();

  const { user } = useCurrentUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const filteredUsers = usersData
    ?.filter((users: any) => users.id !== user?.id)
    ?.filter((user: any) => {
      const matchesName = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation = user.location
        .toLowerCase()
        .includes(location.toLowerCase());

      return matchesName && matchesLocation;
    });

  if (usersLoading) {
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
              <Link href={`/`}>FaithConnect</Link>
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

      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto w-full"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Users Near You
          </h1>

          {/* Search and Location Filter */}
          <div className="flex items-center gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search by name..."
              className="border rounded-lg p-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Input
              type="text"
              placeholder="Enter your location..."
              className="border rounded-lg p-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {!searchQuery && !location && (
            <p className="text-center text-gray-500">
              Search for users around you
            </p>
          )}
          {filteredUsers?.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || location) &&
                filteredUsers?.map((user: any) => (
                  <div
                    key={user.id}
                    className="bg-card p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-gray-500 text-sm mt-2">{user.email}</p>
                    <p className="text-sm mt-4 text-primary font-medium">
                      {user.location}
                    </p>
                    <Link href={`/dating/messages/${user?.id}`}>
                      <Button className="mt-4 w-full bg-primary">
                        Message
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
