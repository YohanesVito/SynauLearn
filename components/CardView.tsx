"use client";

import { useState } from "react";
import { ArrowLeft} from "lucide-react";
import LessonComplete from "./LessonComplete";

interface Card {
  id: number;
  flashcard: {
    question: string;
    answer: string;
  };
  quiz: {
    question: string;
    description: string;
    options: Array<{
      id: number;
      text: string;
      correct: boolean;
    }>;
  };
}

// Mock data - each card has flashcard + quiz paired together
const mockCards: Card[] = [
  {
    id: 1,
    flashcard: {
      question: "What is a blockchain?",
      answer: "A blockchain is a distributed, decentralized, public ledger that records transactions across many computers. It is the underlying technology behind cryptocurrencies like Bitcoin.",
    },
    quiz: {
      question: "What is a blockchain?",
      description: "Test your understanding of blockchain technology.",
      options: [
        { id: 1, text: "A centralized database", correct: false },
        { id: 2, text: "A distributed ledger", correct: true },
        { id: 3, text: "A single computer", correct: false },
        { id: 4, text: "A private network", correct: false },
      ],
    },
  },
  {
    id: 2,
    flashcard: {
      question: "What is cryptocurrency?",
      answer: "Cryptocurrency is a digital or virtual currency that uses cryptography for security. It operates independently of a central bank.",
    },
    quiz: {
      question: "What is cryptocurrency?",
      description: "Verify your knowledge about cryptocurrency.",
      options: [
        { id: 1, text: "Physical money", correct: false },
        { id: 2, text: "Digital currency", correct: true },
        { id: 3, text: "Bank notes", correct: false },
        { id: 4, text: "Credit cards", correct: false },
      ],
    },
  },
  {
    id: 3,
    flashcard: {
      question: "What does NFT stand for?",
      answer: "NFT stands for Non-Fungible Token. It's a unique digital asset that represents ownership of a specific item or piece of content.",
    },
    quiz: {
      question: "What does NFT stand for?",
      description: "Check your understanding of NFTs.",
      options: [
        { id: 1, text: "New Financial Token", correct: false },
        { id: 2, text: "Non-Fungible Token", correct: true },
        { id: 3, text: "Network File Transfer", correct: false },
        { id: 4, text: "Next Future Technology", correct: false },
      ],
    },
  },
  {
    id: 4,
    flashcard: {
      question: "What is Ethereum?",
      answer: "Ethereum is a decentralized, open-source blockchain platform that enables smart contracts and decentralized applications (dApps) to be built and run.",
    },
    quiz: {
      question: "What is Ethereum?",
      description: "Test your knowledge of Ethereum blockchain.",
      options: [
        { id: 1, text: "A social media platform", correct: false },
        { id: 2, text: "A blockchain platform", correct: true },
        { id: 3, text: "A video game", correct: false },
        { id: 4, text: "A mobile app", correct: false },
      ],
    },
  },
  {
    id: 5,
    flashcard: {
      question: "What is a smart contract?",
      answer: "A smart contract is a self-executing contract with the terms directly written into code. It automatically executes when predetermined conditions are met.",
    },
    quiz: {
      question: "What is a smart contract?",
      description: "Verify your understanding of smart contracts.",
      options: [
        { id: 1, text: "A paper contract", correct: false },
        { id: 2, text: "A self-executing contract", correct: true },
        { id: 3, text: "A lawyer agreement", correct: false },
        { id: 4, text: "A bank document", correct: false },
      ],
    },
  },
];

interface CardViewProps {
  courseTitle: string;
  onBack: () => void;
  onComplete?: () => void;
}

type Step = "flashcard" | "quiz" | "result";

export default function CardView({ courseTitle, onBack, onComplete }: CardViewProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [step, setStep] = useState<Step>("flashcard");
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentCard = mockCards[currentCardIndex];
  const totalCards = mockCards.length;
  const isLastCard = currentCardIndex === totalCards - 1;

  // Step 1: User views flashcard and flips it
  const handleFlashcardContinue = () => {
    setXpEarned(xpEarned + 5); // +5 XP for viewing flashcard
    setStep("quiz");
  };

  // Step 2: User selects answer
  const handleAnswerSelect = (optionId: number) => {
    const selected = currentCard.quiz.options.find((opt) => opt.id === optionId);
    setSelectedAnswer(optionId);
    setIsCorrect(selected?.correct || false);
    
    if (selected?.correct) {
      setXpEarned(xpEarned + 10); // +10 XP for correct answer
      setCorrectCount(correctCount + 1);
    }
    
    setStep("result");
  };

  // Step 3: Move to next card or complete lesson
  const handleNext = () => {
    if (isLastCard) {
      // Lesson complete - add bonus XP
      const bonusXP = 25;
      const finalXP = xpEarned + bonusXP;
      setXpEarned(finalXP);
      setShowCompletion(true);
    } else {
      // Next card
      setCurrentCardIndex(currentCardIndex + 1);
      setStep("flashcard");
      setIsFlipped(false);
      setSelectedAnswer(null);
    }
  };

  const handleRetry = () => {
    setStep("quiz");
    setSelectedAnswer(null);
  };

  // Show completion screen
  if (showCompletion) {
    return (
      <LessonComplete
        courseTitle={courseTitle}
        totalXP={xpEarned}
        cardsCompleted={totalCards}
        correctAnswers={correctCount}
        onBackToCourses={onBack}
        onNextLesson={onComplete}
        hasNextLesson={false}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">{courseTitle}</h1>
          <div className="text-blue-500 font-bold text-sm">{xpEarned} XP</div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {mockCards.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentCardIndex
                  ? "w-8 bg-blue-600"
                  : index < currentCardIndex
                  ? "w-1.5 bg-blue-600"
                  : "w-1.5 bg-[#2a2d42]"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm">
          Card {currentCardIndex + 1} of {totalCards}
          {step === "quiz" && " - Quiz"}
          {step === "result" && " - Result"}
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* FLASHCARD STEP */}
        {step === "flashcard" && (
          <div className="w-full max-w-md">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full bg-[#252841] rounded-3xl p-8 min-h-[400px] flex items-center justify-center cursor-pointer hover:bg-[#2a2d46] transition-all border border-[#2a2d42]"
              style={{
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                {!isFlipped ? (
                  <div className="text-center">
                    <div className="text-6xl mb-6">📇</div>
                    <h2 className="text-2xl font-bold mb-6">
                      {currentCard.flashcard.question}
                    </h2>
                    <p className="text-gray-400 text-sm">Tap to flip</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Answer:</p>
                    <p className="text-lg leading-relaxed mb-6">
                      {currentCard.flashcard.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isFlipped && (
              <button
                onClick={handleFlashcardContinue}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
              >
                Continue to Quiz →
              </button>
            )}
          </div>
        )}

        {/* QUIZ STEP */}
        {step === "quiz" && (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Test Your Knowledge
              </h3>
              <p className="text-gray-400 text-sm">
                {currentCard.quiz.description}
              </p>
            </div>

            <h2 className="text-xl font-bold mb-6">
              {currentCard.quiz.question}
            </h2>

            <div className="space-y-3">
              {currentCard.quiz.options.map((option) => (
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
          </div>
        )}

        {/* RESULT STEP */}
        {step === "result" && (
          <div className="w-full max-w-md text-center">
            <div className="text-7xl mb-6">{isCorrect ? "✅" : "❌"}</div>
            
            <h2 className="text-3xl font-bold mb-4">
              {isCorrect ? "Correct!" : "Not quite right"}
            </h2>

            {!isCorrect && (
              <p className="text-gray-400 mb-4">
                The correct answer is:{" "}
                <strong className="text-white">
                  {currentCard.quiz.options.find((o) => o.correct)?.text}
                </strong>
              </p>
            )}

            {isCorrect && (
              <div className="mb-6 inline-block px-6 py-3 bg-green-500/20 text-green-400 text-xl font-bold rounded-full">
                +10 XP
              </div>
            )}

            <div className="space-y-3 mt-8">
              {isCorrect ? (
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
                >
                  {isLastCard ? "Complete Lesson 🎉" : "Next Card →"}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetry}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-full bg-[#2a2d42] hover:bg-[#333649] text-white font-bold py-4 px-8 rounded-2xl transition-all"
                  >
                    Skip & Continue
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}