"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Mock data for demonstration purposes
const devotionals = [
  {
    title: "God's Love for You",
    bibleVerse: "John 3:16",
    memoryVerse: "For God so loved the world...",
    reference: "John 3:16",
    content:
      "Today, reflect on the profound love God has for you. He sent His only Son to die for our sins, offering us the gift of eternal life. Take time to meditate on this immeasurable love and its impact on your life. Remember, you are cherished and valued beyond measure. Let this truth guide your actions and strengthen your faith, knowing that God's love is unchanging, everlasting, and always present, no matter the circumstances you face.",
  },
];

const prayers = [
  {
    date: "Today",
    prayer: [
      "Heavenly Father, thank You for the gift of a new day. Guide my steps and grant me wisdom in all my decisions.",
      "Lord, help me to reflect Your love in my interactions with others. Teach me to forgive as You have forgiven me.",
      "I pray for strength and courage to face any challenges that may come my way today. Help me to trust in Your plan.",
      "Thank You for Your provision and protection. I commit my family, friends, and loved ones into Your hands.",
      "Father, as I go through this day, let my actions glorify You and bring others closer to Your light.",
    ],
  },
];

const testimonies = [
  {
    user: "Jane Doe",
    content:
      "God healed me after years of illness. I had lost hope, but through the prayers of my church community and unwavering faith, I experienced a miraculous recovery. Praise the Lord!",
  },
  {
    user: "John Smith",
    content:
      "After months of unemployment, God opened a door for me that I never imagined. I now have a job that aligns perfectly with my skills and passion. Truly, His timing is perfect.",
  },
  {
    user: "Emily Johnson",
    content:
      "God saved my marriage when it seemed irreparable. Through prayer, counseling, and faith, my spouse and I found our way back to each other. I am forever grateful for His grace.",
  },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-background shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary">
              <Link href={`/`}>FaithConnect</Link>
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
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-primary mb-6">
              FaithConnect
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Join a community of believers, share your testimonies, reflect on
              devotionals, and strengthen your faith journey together in Christ.
            </p>

            {/* Devotionals Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Devotion for the Day
              </h2>
              {devotionals.map((devotion, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-lg shadow-lg mb-4"
                >
                  <h3 className="text-xl font-semibold">{devotion.title}</h3>
                  <p className="text-muted-foreground">{devotion.bibleVerse}</p>
                  <p className="text-muted-foreground italic">
                    {devotion.memoryVerse}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {devotion.content}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Reference: {devotion.reference}
                  </p>
                </div>
              ))}
            </section>

            {/* Testimonies Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Testimonies
              </h2>
              {testimonies.map((testimony, index) => (
                <div
                  key={index}
                  className="p-4 bg-card rounded-lg shadow-lg mb-2"
                >
                  <p className="text-muted-foreground">
                    <strong>{testimony.user}:</strong> {testimony.content}
                  </p>
                </div>
              ))}
            </section>

            {/* Daily Prayers Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Daily Prayer
              </h2>
              {prayers.map((prayer, index) => (
                <div
                  key={index}
                  className="p-4 bg-card rounded-lg shadow-lg mb-2"
                >
                  <ul className="list-disc list-inside text-muted-foreground">
                    {prayer.prayer.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
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
