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
import { Filter } from "bad-words";
import * as tf from "@tensorflow/tfjs";

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
            setMediaUrl(data.url);
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
      // Step 1: Check for vulgar words using the `bad-words` library
      const filter = new Filter();
      const cleanContent = filter.clean(content); // Clean the content
      console.log(cleanContent);

      if (cleanContent !== content) {
        toast({
          title: "Warning",
          description:
            "Your post contains vulgar words. Please consider removing them.",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Analyze the content with TensorFlow.js (Optional sentiment analysis)
      //   const sentimentScore = await analyzeContentWithTFJS(content);

      //   if (sentimentScore < 0) {
      //     toast({
      //       title: "Warning",
      //       description: "Your post seems negative. Please consider revising it.",
      //       variant: "destructive",
      //     });
      //     return;
      //   }

      // Step 3: Create the post after validation
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          content, // Use the cleaned content
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
        window.location.href = "/posts";
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

  // TensorFlow.js content analysis function (Optional)
  //   const analyzeContentWithTFJS = async (content: string): Promise<number> => {
  //     try {
  //       // Ensure TensorFlow.js is ready
  //       await tf.ready();

  //       // Load the pre-trained model
  //       const model = await tf.loadLayersModel("/models/sentiment_model.json");

  //       // Tokenization and preprocessing (adjust based on your model's input format)
  //       const tokenizedInput = tokenizeText(content); // Define your tokenizer function
  //       const inputTensor = tf.tensor([tokenizedInput]);

  //       // Use the model to make a prediction
  //       const prediction = model.predict(inputTensor) as tf.Tensor;

  //       // Extract the sentiment score
  //       const sentimentScore = prediction.dataSync()[0]; // Adjust if model returns more than one value

  //       return sentimentScore;
  //     } catch (error) {
  //       console.error("Error during sentiment analysis:", error);
  //       throw error;
  //     }
  //   };

  // Example tokenizer (adjust to match the model's training process)
  //   const tokenizeText = (text: string): number[] => {
  //     // Replace with actual tokenization logic (e.g., word-to-index mapping, padding)
  //     // For example, a simple dummy tokenizer might map each character to its ASCII code
  //     return text.split("").map((char) => char.charCodeAt(0));
  //   };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-2xl space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center text-green-900-">
          Create a Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full resize-none border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Select
              onValueChange={(value: SetStateAction<string>) =>
                setCategory(value)
              }
            >
              <SelectTrigger className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Scriptures</SelectItem>
                <SelectItem value="prayer">Prayer</SelectItem>
                <SelectItem value="meditation">Meditation</SelectItem>
                <SelectItem value="faith">Faith</SelectItem>
                <SelectItem value="manifestation">Manifestation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Select
              onValueChange={(value: SetStateAction<string>) =>
                setMediaType(value)
              }
            >
              <SelectTrigger className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {mediaUrl && (
                <div className="text-sm text-green-600 mt-2">
                  File uploaded successfully!
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            className="w-full py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-[#005aab] transition duration-300"
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
