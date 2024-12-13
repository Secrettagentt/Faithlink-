"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-primary mb-6">
            Welcome to FaithConnect
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Connect with fellow believers, share your faith journey, and grow
            together in Christ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Connect Locally"
              description="Meet and engage with Christians in your area"
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Share & Grow"
              description="Share testimonies, devotionals, and prayers"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Safe Community"
              description="AI-powered content moderation for a wholesome experience"
            />
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-card rounded-lg shadow-lg"
    >
      <div className="flex justify-center mb-4 text-accent">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
