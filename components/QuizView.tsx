"use client";

import { useState } from "react";

interface QuizViewProps {
  onBack: () => void;
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

export default function QuizView({ onBack }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const question = quizData[currentQuestion];

  const handleAnswerSelect = (optionId: number) => {
    setSelectedAnswer(optionId);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-gray-400 mb-8">Great job on completing the quiz</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-lg font-medium">{currentQuestion + 1}/{quizData.length}</span>
        </div>
        
        <div className="w-full bg-[#2a2d42] rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
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

        {selectedAnswer && (
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all"
          >
            {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}