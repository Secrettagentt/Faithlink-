"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const result = await axios.post("/api/auth/signin", {
        email: data.email,
        password: data.password,
      });
      console.log(result);
      if (!result) {
        setError("Invalid credentials");
        return;
      }

      router.push("/feed");
    } catch (error) {
      setError("An error occurred");
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
          <Button type="submit" className="w-full bg-primary">
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
