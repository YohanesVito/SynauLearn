"use client";

import { useState, useRef, useEffect } from "react";

interface FlashcardViewProps {
  courseTitle: string;
  onStartQuiz: () => void;
  onBack: () => void;
}

const flashcards = [
  {
    id: 1,
    question: "What is a blockchain?",
    answer: "A blockchain is a distributed, decentralized, public ledger that records transactions across many computers. It is the underlying technology behind cryptocurrencies like Bitcoin.",
  },
  {
    id: 2,
    question: "What is cryptocurrency?",
    answer: "Cryptocurrency is a digital or virtual currency that uses cryptography for security. It operates independently of a central bank.",
  },
  {
    id: 3,
    question: "What does NFT stand for?",
    answer: "NFT stands for Non-Fungible Token. It's a unique digital asset that represents ownership of a specific item or piece of content.",
  },
  {
    id: 4,
    question: "What is Ethereum?",
    answer: "Ethereum is a decentralized, open-source blockchain platform that enables smart contracts and decentralized applications (dApps) to be built and run.",
  },
  {
    id: 5,
    question: "What is a smart contract?",
    answer: "A smart contract is a self-executing contract with the terms directly written into code. It automatically executes when predetermined conditions are met.",
  },
];

export default function FlashcardView({ courseTitle, onStartQuiz, onBack }: FlashcardViewProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

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
    if (!touchStart.x || !touchEnd.x) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Horizontal swipe (left/right) for cards
    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        // Swiped left - next card
        handleNextCard();
      } else {
        // Swiped right - previous card
        handlePrevCard();
      }
    }

    // Vertical swipe down for quiz
    if (isVerticalSwipe && distanceY < -minSwipeDistance) {
      onStartQuiz();
    }
  };

  const handleNextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const card = flashcards[currentCard];

  return (
    <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{courseTitle}</h1>
          <div className="w-6" />
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {flashcards.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentCard
                  ? "w-8 bg-blue-600"
                  : index < currentCard
                  ? "w-1.5 bg-blue-600"
                  : "w-1.5 bg-[#2a2d42]"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm">
          Card {currentCard + 1} of {flashcards.length}
        </p>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center px-6 pb-32"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Flashcard */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-md bg-[#252841] rounded-3xl p-8 min-h-[400px] flex items-center justify-center cursor-pointer hover:bg-[#2a2d46] transition-all mb-8 border border-[#2a2d42]"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            {!isFlipped ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">{card.question}</h2>
                <p className="text-gray-400 text-sm">Tap to flip</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg leading-relaxed">{card.answer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Hints */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <p className="text-gray-400 text-xs">Swipe right for next card</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="text-gray-400 text-xs">Scroll down for quiz</p>
          </div>
        </div>
      </div>
    </div>
  );
}