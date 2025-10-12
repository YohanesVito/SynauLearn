"use client";

import { useState, useRef } from "react";

interface QuizViewProps {
  cardIndex: number;
  onBack: () => void;
  onBackToFlashcard: () => void;
}

const quizData = [
  {
    id: 1,
    question: "What is a blockchain?",
    description: "A blockchain is a distributed, decentralized, public ledger that records transactions across many computers. It is the underlying technology behind cryptocurrencies like Bitcoin.",
    options: [
      { id: 1, text: "A centralized database", correct: false },
      { id: 2, text: "A distributed ledger", correct: true },
      { id: 3, text: "A single computer", correct: false },
      { id: 4, text: "A private network", correct: false },
    ],
  },
  {
    id: 2,
    question: "What is cryptocurrency?",
    description: "Cryptocurrency is a digital or virtual currency that uses cryptography for security.",
    options: [
      { id: 1, text: "Physical money", correct: false },
      { id: 2, text: "Digital currency", correct: true },
      { id: 3, text: "Bank notes", correct: false },
      { id: 4, text: "Credit cards", correct: false },
    ],
  },
  {
    id: 3,
    question: "What does NFT stand for?",
    description: "NFT stands for Non-Fungible Token.",
    options: [
      { id: 1, text: "New Financial Token", correct: false },
      { id: 2, text: "Non-Fungible Token", correct: true },
      { id: 3, text: "Network File Transfer", correct: false },
      { id: 4, text: "Next Future Technology", correct: false },
    ],
  },
  {
    id: 4,
    question: "What is Ethereum?",
    description: "Ethereum is a blockchain platform with smart contract functionality.",
    options: [
      { id: 1, text: "A social media platform", correct: false },
      { id: 2, text: "A blockchain platform", correct: true },
      { id: 3, text: "A video game", correct: false },
      { id: 4, text: "A mobile app", correct: false },
    ],
  },
  {
    id: 5,
    question: "What is a smart contract?",
    description: "A smart contract is a self-executing contract with terms directly written into code.",
    options: [
      { id: 1, text: "A paper contract", correct: false },
      { id: 2, text: "A self-executing contract", correct: true },
      { id: 3, text: "A lawyer agreement", correct: false },
      { id: 4, text: "A bank document", correct: false },
    ],
  },
];

export default function QuizView({ cardIndex, onBack, onBackToFlashcard }: QuizViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const question = quizData[cardIndex] || quizData[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.y || !touchEnd.y) return;

    const distanceY = touchStart.y - touchEnd.y;
    const isVerticalSwipe = Math.abs(distanceY) > minSwipeDistance;

    // Swipe down to go back to flashcard
    if (isVerticalSwipe && distanceY < 0) {
      onBackToFlashcard();
    }
  };

  if (!question) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col items-center justify-center px-6">
        <p className="text-gray-400">Quiz not found</p>
        <button
          onClick={onBack}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
        >
          Back to Courses
        </button>
      </div>
    );
  }


  const handleAnswerSelect = (optionId: number) => {
    const selected = question.options.find(opt => opt.id === optionId);
    setSelectedAnswer(optionId);
    setIsCorrect(selected?.correct || false);
    setShowResult(true);
  };

  const handleContinue = () => {
    onBackToFlashcard();
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">{isCorrect ? "🎉" : "😔"}</div>
          <h2 className="text-3xl font-bold mb-4">
            {isCorrect ? "Correct!" : "Incorrect"}
          </h2>
          <p className="text-gray-400 mb-8">
            {isCorrect 
              ? "Great job! You got it right." 
              : "Don't worry, review the flashcard and try again."}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
            >
              Back to Flashcard
            </button>
            <button
              onClick={onBack}
              className="w-full bg-[#2a2d42] hover:bg-[#333649] text-white font-bold py-4 px-8 rounded-2xl transition-all"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBackToFlashcard} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          <span className="text-lg font-medium">Card {cardIndex + 1} Quiz</span>
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-32 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">{question.description}</p>

        <div className="space-y-3 mb-8">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(option.id)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all ${
                selectedAnswer === option.id
                  ? "bg-[#2a2d42] text-white border-2 border-blue-600"
                  : "bg-[#2a2d42] text-white hover:bg-[#333649] border-2 border-transparent"
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Swipe down to return to flashcard</span>
        </div>
      </div>
    </div>
  );
}
