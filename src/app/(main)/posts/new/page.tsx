"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      try {
        // Read the file as base64
        const reader = new FileReader();

        reader.onloadend = async () => {
          // Get base64 content from the reader result
          const base64Content = reader.result?.toString().split(",")[1];

          if (!base64Content) {
            throw new Error("No base64 content found");
          }

          // Prepare the data to send to the API
          const formData = {
            fileName: selectedFile.name,
            content: base64Content,
          };

          // Replace with your upload endpoint
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (uploadResponse.ok) {
            const data = await uploadResponse.json();
            setMediaUrl(data.url); // Assuming the response contains the uploaded file URL
            toast({
              title: "File uploaded",
              description: "Your file has been successfully uploaded.",
              variant: "default",
            });
          } else {
            throw new Error("File upload failed");
          }
        };

        reader.onerror = (error) => {
          console.error("File read error:", error);
          toast({
            title: "Error",
            description: "Failed to read the file. Please try again.",
            variant: "destructive",
          });
        };

        // Read the file as base64
        reader.readAsDataURL(selectedFile);
      } catch (error) {
        console.error("File upload error:", error);
        toast({
          title: "Error",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          content,
          mediaType,
          mediaUrl,
        }),
      });

      if (response.ok) {
        setCategory("");
        setContent("");
        setMediaType("");
        setMediaUrl("");
        setFile(null);
        toast({
          title: "Post created",
          description: "Your post has been successfully created.",
          variant: "default",
        });
        router.push("/posts");
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl p-6 bg-card rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Create a Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Select
              onValueChange={(value: SetStateAction<string>) =>
                setCategory(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full resize-none"
          />
          <div>
            <Select
              onValueChange={(value: SetStateAction<string>) =>
                setMediaType(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mediaType !== "none" && (
            <>
              <Input
                type="file"
                accept={mediaType === "image" ? "image/*" : "video/*"}
                onChange={handleFileChange}
                className="w-full"
              />
              {mediaUrl && (
                <div className="text-sm text-green-600">
                  File uploaded successfully!
                </div>
              )}
            </>
          )}
          <Button
            type="submit"
            className="w-full bg-primary"
            disabled={
              isLoading ||
              !content.trim() ||
              !category ||
              (mediaType !== "none" && !mediaUrl.trim())
            }
          >
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
