"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import LessonComplete from "./LessonComplete";
import { API, Card as CardType } from "@/lib/api";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

interface CardViewProps {
  lessonId: string;
  courseTitle: string;
  onBack: () => void;
  onComplete?: () => void;
}

type Step = "flashcard" | "quiz" | "result";

export default function CardView({ 
  lessonId, 
  courseTitle, 
  onBack, 
  onComplete 
}: CardViewProps) {
  const { context } = useMiniKit();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [step, setStep] = useState<Step>("flashcard");
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Load cards from Supabase
  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true);
        
        // Get or create user
        if (context?.user?.fid) {
          const user = await API.getUserOrCreate(
            context.user.fid,
            context.user.username,
            context.user.displayName
          );
          setUserId(user.id);
        }

        // Fetch cards
        const fetchedCards = await API.getCardsForLesson(lessonId);
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error loading cards:", error);
        alert("Failed to load lesson. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [lessonId, context]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No cards found for this lesson</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const totalCards = cards.length;
  const isLastCard = currentCardIndex === totalCards - 1;

  // Convert quiz options to array format
  const quizOptions = [
    { id: 'A', text: currentCard.quiz_option_a, correct: currentCard.quiz_correct_answer === 'A' },
    { id: 'B', text: currentCard.quiz_option_b, correct: currentCard.quiz_correct_answer === 'B' },
    { id: 'C', text: currentCard.quiz_option_c, correct: currentCard.quiz_correct_answer === 'C' },
    { id: 'D', text: currentCard.quiz_option_d, correct: currentCard.quiz_correct_answer === 'D' },
  ];

  // Step 1: User views flashcard
  const handleFlashcardContinue = () => {
    setXpEarned(xpEarned + 5); // +5 XP for viewing flashcard
    setStep("quiz");
  };

  // Step 2: User answers quiz
  const handleAnswerSelect = async (answerId: string) => {
    const correct = answerId === currentCard.quiz_correct_answer;
    setSelectedAnswer(answerId);
    setIsCorrect(correct);
    
    if (correct) {
      setXpEarned(xpEarned + 10); // +10 XP for correct answer
      setCorrectCount(correctCount + 1);
    }
    
    // Save progress to database
    if (userId) {
      try {
        await API.saveCardProgress(userId, currentCard.id, correct);
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
    
    setStep("result");
  };

  // Step 3: Move to next card or complete
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
          {cards.map((_, index) => (
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
                      {currentCard.flashcard_question}
                    </h2>
                    <p className="text-gray-400 text-sm">Tap to flip</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Answer:</p>
                    <p className="text-lg leading-relaxed mb-6">
                      {currentCard.flashcard_answer}
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
            </div>

            <h2 className="text-xl font-bold mb-6">
              {currentCard.quiz_question}
            </h2>

            <div className="space-y-3">
              {quizOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all ${
                    selectedAnswer === option.id
                      ? "bg-[#2a2d42] text-white border-2 border-blue-600"
                      : "bg-[#2a2d42] text-white hover:bg-[#333649] border-2 border-transparent"
                  }`}
                >
                  <span className="font-bold mr-2">{option.id}.</span>
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
                  {currentCard.quiz_correct_answer}.{" "}
                  {quizOptions.find((o) => o.correct)?.text}
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