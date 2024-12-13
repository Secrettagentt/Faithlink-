"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import ProfileForm from "@/components/profile/ProfileForm"
// import UserPosts from "@/components/profile/UserPosts"
// import UserDevotionals from "@/components/profile/UserDevotionals"

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${(session as any)?.user.id}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.location}</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
          <p className="text-lg">{profile.bio || "No bio yet"}</p>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            {/* <UserPosts userId={profile.id} /> */}
          </TabsContent>
          <TabsContent value="devotionals">
            {/* <UserDevotionals userId={profile.id} /> */}
          </TabsContent>
          <TabsContent value="settings">
            {/* <ProfileForm profile={profile} onUpdate={fetchProfile} /> */}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
