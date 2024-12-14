"use client";

import { useCreateMeeting, useGenerateAgoraToken } from "@/api/meeting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateMeetingPage() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const watchMeetingType = watch("schedule", "instant");

  const { createMeeting, isCreatingMeeting } = useCreateMeeting();
  const { generateToken, isGeneratingToken } = useGenerateAgoraToken();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const meetingData = {
        ...data,
        date:
          data.schedule === "instant"
            ? moment().format("YYYY-MM-DD HH:mm:ss") // Using Moment.js for current date and time
            : moment(data.date).format("YYYY-MM-DD HH:mm:ss"), // Ensures consistent formatting
      };

      const { title, date } = data;

      const { token } = await generateToken({
        channelName: title,
        date,
      });

      if (token) {
        const responses = await createMeeting({
          ...meetingData,
          token: token,
        });
        if (data.schedule === "instant" || responses?.id) {
          // Navigate to meeting detail page for instant meeting
          router.push(`/meeting/${responses.id}`);
        } else {
          // Navigate to meeting list page for scheduled meeting
          router.push("/meeting");
        }
      }
      // Simulate API call
      setSuccess("Meeting created successfully!");
      setError("");
    } catch (error: any) {
      setError("Failed to create meeting. Please try again.");
      setSuccess("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Meeting
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <Input
                {...register("title", { required: true })}
                placeholder="Meeting Title"
                className="w-full"
              />
            </div>
            <div>
              <Input
                {...register("description", { required: true })}
                placeholder="Meeting Description"
                className="w-full"
              />
            </div>

            <RadioGroup
              defaultValue="instant"
              onValueChange={(value) => setValue("schedule", value)}
              className="space-y-2 flex justify-between items-center"
            >
              <div className="flex items-center">
                <RadioGroupItem value="instant" id="instant" />
                <label htmlFor="instant" className="ml-2">
                  Instant Meeting
                </label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="schedule" id="schedule" />
                <label htmlFor="schedule" className="ml-2">
                  Create for Later
                </label>
              </div>
            </RadioGroup>
            {watchMeetingType === "schedule" && (
              <div className="w-full">
                <Input
                  {...register("date", {
                    required: watchMeetingType === "schedule",
                  })}
                  type="datetime-local"
                  className="!w-full"
                />
              </div>
            )}

            <Button
              loading={isCreatingMeeting || isGeneratingToken}
              type="submit"
              className="w-full bg-primary"
            >
              Create Meeting
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
