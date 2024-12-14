"use client";

import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Post } from "@/types";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [translating, setTranslating] = useState<{ [key: string]: boolean }>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const translatePost = async (postId: string, content: string) => {
    setTranslating((prev) => ({ ...prev, [postId]: true }));

    try {
      const userPreferredLanguage = navigator.language || "en";
      const response = await fetch("/api/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          target_language: "es",
          source_language: "en",
        }),
      });

      const data = await response.json();

      if (data.translatedText) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, content: data.translatedText }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error translating post:", error);
    } finally {
      setTranslating((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      {/* Sticky header */}

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
                    Meeting
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
                  <Link href={"/posts/new"}>
                    <Button
                      onClick={() => router.push("/posts/new")}
                      className="font-semibold text-gray-800 shadow-lg"
                      style={{ backgroundColor: "#F7DC6F" }}
                    >
                      Create Post
                    </Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      {/* <div className="sticky top-0 z-10 backdrop-blur-md bg-white/30 border-b border-white/20"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* <h1 className="text-2xl font-bold text-gray-800">Feeds</h1> */}
        </div>
      </div>
      {/* </div> */}

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader color="#34C759" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <p className="text-lg text-gray-500">
                No posts available. Be the first to create one!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar
                      className="border-2"
                      style={{ borderColor: "#34C759" }}
                    >
                      <AvatarImage />
                      <AvatarFallback className="bg-gray-100">
                        {post.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {post.user.name}
                      </h2>
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
                    <p className="text-gray-700 leading-relaxed">
                      {post.content}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => translatePost(post.id, post.content)}
                      disabled={translating[post.id]}
                      className="hover:text-[#34C759] transition-colors duration-200"
                    >
                      {translating[post.id] ? "Translating..." : "Translate"}
                    </Button>
                  </CardContent>
                  {post.mediaUrl && (
                    <div className="px-6">
                      {post.mediaUrl.endsWith(".mp4") ||
                      post.mediaUrl.endsWith(".webm") ? (
                        <div className="relative rounded-lg overflow-hidden">
                          <video
                            className="w-full h-[400px] object-cover"
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
                        </div>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden">
                          <img
                            src={post.mediaUrl}
                            className="w-full h-[400px] object-cover"
                            alt="Post media"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <CardFooter className="flex justify-between p-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-[#34C759] transition-colors duration-200"
                    >
                      <Heart className="w-5 h-5 mr-1" />
                      <span className="font-medium">1000</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-[#34C759] transition-colors duration-200"
                    >
                      <MessageCircle className="w-5 h-5 mr-1" />
                      <span className="font-medium">200</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-[#34C759] transition-colors duration-200"
                    >
                      <Share2 className="w-5 h-5 mr-1" />
                      <span className="font-medium">Share</span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
