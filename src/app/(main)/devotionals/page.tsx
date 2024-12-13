"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import CreateDevotional from "@/components/devotionals/CreateDevotional"

export default function DevotionalsPage() {
  // const { data: session } = useSession();
  const [devotionals, setDevotionals] = useState([]);

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const fetchDevotionals = async () => {
    try {
      const response = await fetch("/api/devotionals");
      const data = await response.json();
      setDevotionals(data);
    } catch (error) {
      console.error("Error fetching devotionals:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* <CreateDevotional onCreated={fetchDevotionals} /> */}
        <div className="space-y-6 mt-8">
          {devotionals.map((devotional: any) => (
            <motion.div
              key={devotional.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-2">{devotional.title}</h2>
                <p className="text-muted-foreground mb-4">
                  By {devotional.user.name} •{" "}
                  {new Date(devotional.createdAt).toLocaleDateString()}
                </p>
                <p className="whitespace-pre-wrap">{devotional.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
