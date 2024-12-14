"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-background shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-primary">
              <Link href={`/`}>FaithLink</Link>
            </h2>
            <nav>
              <ul className="flex gap-6">
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
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-primary mb-6">
              Welcome to FaithLink
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Connect with fellow believers, share your faith journey, and grow
              together in Christ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Link href="">
                <FeatureCard
                  icon={<Users className="w-8 h-8" />}
                  title="Connect Locally"
                  description="Meet and engage with Christians in your area"
                />
              </Link>
              <Link href="">
                <FeatureCard
                  icon={<MessageCircle className="w-8 h-8" />}
                  title="Share & Grow"
                  description="Share testimonies, devotionals, and prayers"
                />
              </Link>
              <Link href="/quiz">
                <FeatureCard
                  icon={<Heart className="w-8 h-8" />}
                  title="Bible Trivia"
                  description="Join us and grow spiritually and also play bible games"
                />
              </Link>
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
            </div>
          </motion.div>
        </main>
      </div>
    </>
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
