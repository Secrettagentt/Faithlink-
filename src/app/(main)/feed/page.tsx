"use client";

import { Post } from "@/types";
import { motion } from "framer-motion";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import PostCard from "@/components/posts/PostCard"
// import CreatePost from "@/components/posts/CreatePost"
// import { Post } from "@/types"

export default function FeedPage() {
  // const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);

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
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <CreatePost onPostCreated={fetchPosts} /> */}
      <div className="space-y-6 mt-8">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* <PostCard post={post} /> */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
