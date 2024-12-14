"use client";

import { useCreateDevotion } from "@/api/devotion";
import TinyEditor from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateDevotionPage() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  // Watch the content field to ensure it's updated
  // const content = watch("content");

  const { createDevotion, isCreatingDevotion } = useCreateDevotion();

  const onSubmit = async (data: any) => {
    try {
      const devotionData = {
        ...data,
        date: moment(data.date).format("YYYY-MM-DD HH:mm:ss"), // Ensures consistent formatting
      };
      const responses = await createDevotion(devotionData);
      // Simulate API call
      if (responses) {
        // Navigate to meeting detail page for instant meeting
        router.push(`/devotionals`);
      }
      console.log("Devotion Created:", devotionData);
      setSuccess("Devotion created successfully!");
      setError("");
    } catch (error: any) {
      setError("Failed to create devotion. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl p-8 bg-card rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Create Devotion</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Input
              {...register("title", { required: true })}
              placeholder="Devotion Title"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Input
              {...register("date")}
              type="datetime-local"
              className="!w-full"
            />
          </div>

          <div>
            <TinyEditor
              initialValue={""}
              onEditorChange={(content: string) => {
                setValue("content", content); // Update the form's content field
              }}
              id="wysiwygEditor"
              placeholder="Devotion Description"
              className="w-full"
            />
          </div>
          <Button
            loading={isCreatingDevotion}
            type="submit"
            className="w-full bg-primary"
          >
            Create Devotion
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
