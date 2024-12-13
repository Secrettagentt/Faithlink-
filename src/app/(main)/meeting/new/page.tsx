"use client";

import { useCreateMeeting, useGenerateAgoraToken } from "@/api/meeting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateMeetingPage() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const watchMeetingType = watch("schedule", "instant");

    
    const {createMeeting } = useCreateMeeting()
    const {generateToken} = useGenerateAgoraToken()
    
  

  const onSubmit = async (data: any) => {
    try {
      const meetingData = {
        ...data,
        date:
          data.schedule === "instant"
            ? moment().format("YYYY-MM-DD HH:mm:ss") // Using Moment.js for current date and time
            : moment(data.date).format("YYYY-MM-DD HH:mm:ss"), // Ensures consistent formatting
      };

          const { title, description, startDate } = data;

          const { token, agoraAppId } = await generateToken(title, startDate);
          if (token) {
       const responses = await createMeeting({
       meetingData,
         token: token,
         //   id: uuidv4(),
         agoraAppId: agoraAppId,
        //  user: currentActiveUserId,
       });
          }
      // Simulate API call
      console.log("Meeting Data:", meetingData);
      setSuccess("Meeting created successfully!");
      setError("");
    } catch (error: any) {
      setError("Failed to create meeting. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Create Meeting</h1>
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

          <Button type="submit" className="w-full bg-primary">
            Create Meeting
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
