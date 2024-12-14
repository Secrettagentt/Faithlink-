"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const responseData = await response.json();
      if (response.ok) {
        localStorage.setItem("token", responseData.token);
        console.log("Sign-in successful:", data);
      } else {
        console.error("Error:", data.message);
      }
      toast({
        title: "Login success",
        description: "You have successfully login.",
      });
      router.push("/");
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full"
            />
          </div>
          <div>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button loading={loading} type="submit" className="w-full bg-primary">
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
