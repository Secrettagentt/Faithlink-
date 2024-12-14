"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

type DifficultyLevel = "easy" | "medium" | "hard";

const BibleQuest: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] =
    useState<DifficultyLevel>("easy");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(60); // Timer starts at 30 seconds
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const questionsByDifficulty = {
    easy: [
      {
        question: "Who built the ark?",
        options: ["Noah", "Moses", "Abraham", "David"],
        correct: 0,
      },
      {
        question: "How many days did it take God to create the world?",
        options: ["3 days", "5 days", "6 days", "7 days"],
        correct: 2,
      },
    ],
    medium: [
      {
        question: "Who was the first king of Israel?",
        options: ["David", "Saul", "Solomon", "Samuel"],
        correct: 1,
      },
      {
        question: "Which prophet was swallowed by a great fish?",
        options: ["Jonah", "Elijah", "Isaiah", "Jeremiah"],
        correct: 0,
      },
    ],
    hard: [
      {
        question: "Who was Methuselah's father?",
        options: ["Noah", "Lamech", "Enoch", "Seth"],
        correct: 2,
      },
      {
        question: "How many years did Jacob serve Laban for Rachel and Leah?",
        options: ["7 years", "10 years", "14 years", "20 years"],
        correct: 2,
      },
    ],
  };

  useEffect(() => {
    if (quizStarted) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Stop the quiz if timer runs out
      if (timer === 0) {
        handleQuizCompletion();
      }

      return () => clearInterval(timerInterval);
    }
  }, [quizStarted, timer]);

  useEffect(() => {
    if (quizStarted) {
      setQuestions([...questionsByDifficulty[currentDifficulty]]);
      setCurrentQuestionIndex(0);
      setCurrentScore(0);
      setIsQuizCompleted(false);
      setTimer(60); // Reset timer
    }
  }, [quizStarted, currentDifficulty]);

  const handleAnswerSelection = (selectedIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correct) {
      setCurrentScore((prev) => prev + 10); // Increase score for correct answer
    }
    loadNextQuestion();
  };

  const loadNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(60); // Reset timer for the next question
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    setIsQuizCompleted(true);
    setQuizStarted(false); // Stop the quiz
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
              <ul className="flex gap-6 items-center">
                <li>
                  <Link
                    href="/meeting"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Meeting
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
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <nav className="p-4 bg-gradient-to-b from-secondary/30 to-background] flex justify-between items-center">
          <div className="text-lg font-bold">Bible Trivia</div>
          <div className="flex items-center space-x-4">
            <button
              className={`bg-yellow-500 text-white px-3 py-1 rounded ${
                darkMode && "bg-gray-700"
              }`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </nav>

        <main className="p-4">
          <div className="mb-6">
            {!quizStarted && !isQuizCompleted && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Select Difficulty</h2>
                <div className="flex justify-center space-x-4 mb-6">
                  {["easy", "medium", "hard"].map((difficulty) => (
                    <button
                      key={difficulty}
                      className={`px-4 py-2 rounded ${
                        currentDifficulty === difficulty
                          ? "bg-green-900 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setCurrentDifficulty(difficulty as any)}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  className="bg-green-900 text-white px-6 py-3 rounded text-xl hover:bg-green-600"
                  onClick={() => setQuizStarted(true)}
                >
                  Start Quiz
                </button>
              </div>
            )}

            {quizStarted && (
              <div>
                <h2 className="text-2xl font-bold">Bible Trivia</h2>
                <div className="bg-gray-100 p-4 rounded shadow-md mt-4">
                  <p className="mb-4 font-semibold">
                    {questions[currentQuestionIndex]?.question}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {questions[currentQuestionIndex]?.options.map(
                      (option: string, index: number) => (
                        <button
                          key={index}
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                          onClick={() => handleAnswerSelection(index)}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                  <p className="mt-4 text-red-500 font-bold">
                    Time Left: {timer}s
                  </p>
                </div>
              </div>
            )}

            {isQuizCompleted && (
              <div className="text-center">
                <h2 className="text-2xl font-bold">Quiz Completed!</h2>
                <p className="text-xl mt-2">Your Total Score: {currentScore}</p>
                <button
                  className="bg-green-500 text-white px-6 py-3 rounded text-xl mt-4 hover:bg-green-600"
                  onClick={() => setQuizStarted(true)}
                >
                  Restart Quiz
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default BibleQuest;
