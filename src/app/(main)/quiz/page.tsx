"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function QuizPage() {
  // const { data: session } = useSession()
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch("/api/quiz/random");
      const data = await response.json();
      setCurrentQuiz(data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === currentQuiz.answer) {
      setScore((prev) => prev + 1);
    }
    fetchQuiz();
    setSelectedAnswer("");
  };

  if (!currentQuiz) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{currentQuiz.question}</h2>
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-4"
          >
            {currentQuiz.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-lg">Current Score: {score}</p>
            <Button onClick={handleSubmit} disabled={!selectedAnswer}>
              Submit Answer
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
