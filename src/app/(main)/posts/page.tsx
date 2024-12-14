"use client";

import { Post } from "@/types";
import { motion } from "framer-motion";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { Post } from "@/types"

export default function FeedPage() {
  // const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

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
                <li>
                  <Link
                    href="/devotionals"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Devotionals
                  </Link>
                </li>
                <li>
                  <Link href={`/posts/new`}>
                    <Button className=""> Create Post</Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div className="">
        <div className="space-y-6 mt-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{post.user.name}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
                <div className="">
                  {post.mediaUrl ? (
                    post.mediaUrl.endsWith(".mp4") ||
                    post.mediaUrl.endsWith(".webm") ? (
                      // If the media is a video
                      <video
                        className="w-full h-[400px]"
                        autoPlay
                        controls
                        loop
                      >
                        <source src={post.mediaUrl} type="video/mp4" />
                        <source
                          src={post.mediaUrl.replace(".mp4", ".webm")}
                          type="video/webm"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // If the media is an image
                      <img
                        src={post.mediaUrl}
                        className="w-full h-[400px]"
                        alt="Media content"
                      />
                    )
                  ) : (
                    <p>No media available</p> // Fallback message if no mediaUrl is available
                  )}
                </div>

                <CardFooter className="flex justify-between m-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-5 h-5 mr-1" />
                    1000 likes
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-5 h-5 mr-1" />
                    200 comments
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-5 h-5 mr-1" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
