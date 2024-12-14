"use client";

import { useGetDevotionById } from "@/api/devotion"; // Assuming you have this API hook
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { FaShareAlt } from "react-icons/fa";

export default function DevotionDetailPage() {
  const { id } = useParams(); // Get the meeting ID directly from the URL

  const { devotion, isPendingDevotion } = useGetDevotionById(id as string);

  if (isPendingDevotion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  //   if (errorDevotion) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <p className="text-red-500">{errorDevotion}</p>
  //       </div>
  //     );
  //   }
  const handleShareToSocialMedia = async () => {
    const referralLink = window.location.href; // Get the current page URL as the referral link

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Invite Your Friends",
          text: "Join me and earn bonuses!",
          url: referralLink, // Use the current page URL as the referral link
        });
        console.log("Share successful");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto w-full"
      >
        <div className="bg-card p-6 top-0 sticky z-10">
          <div className="flex items-center justify-between">
            <Button
              className="w-fit bg-primary"
              onClick={() => window.history.back()} // Go back to the previous page
            >
              Back to Devotions
            </Button>

            <h1 className="text-3xl font-bold text-center mb-6">
              {devotion?.title}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-primary font-medium">
              {new Date(devotion?.createdAt).toLocaleString()}
            </p>
            <button
              onClick={handleShareToSocialMedia}
              className="bg-primary p-2 rounded-full text-white hover:bg-primary/80"
              aria-label="Share this meeting"
            >
              <FaShareAlt size={24} />
            </button>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg mt-4">
          {/* <h2 className="text-lg font-semibold mb-4">Contents</h2> */}
          <div className="markdown">
            <div
              className={
                "!font-garamond text-[20px] text-black font-normal pt-3"
              }
              dangerouslySetInnerHTML={{
                __html: devotion?.content! || "",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
