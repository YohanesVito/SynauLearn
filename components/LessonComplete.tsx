"use client";

import { Trophy, Star, ArrowRight, Home } from "lucide-react";

interface LessonCompleteProps {
  courseTitle: string;
  totalXP: number;
  cardsCompleted: number;
  correctAnswers: number;
  onBackToCourses: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export default function LessonComplete({
  courseTitle,
  totalXP,
  cardsCompleted,
  correctAnswers,
  onBackToCourses,
  onNextLesson,
  hasNextLesson = false,
}: LessonCompleteProps) {
  const accuracy = Math.round((correctAnswers / cardsCompleted) * 100);

  return (
    <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col items-center justify-center px-6">
      {/* Celebration Animation */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">⭐</div>
          <div className="absolute -bottom-4 -left-4 text-4xl animate-spin-slow">✨</div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-white">
          Lesson Complete!
        </h1>
        <p className="text-gray-400 text-lg">
          {courseTitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="w-full max-w-md mb-8 space-y-4">
        {/* XP Earned */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-white" />
          <div className="text-5xl font-bold text-white mb-2">
            +{totalXP} XP
          </div>
          <p className="text-blue-100">Total XP Earned</p>
        </div>

        {/* Performance Stats */}
        <div className="bg-[#252841] rounded-2xl p-6 border border-[#2a2d42]">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {cardsCompleted}
              </div>
              <p className="text-gray-400 text-sm">Cards Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {accuracy}%
              </div>
              <p className="text-gray-400 text-sm">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-[#252841] rounded-2xl p-6 border border-[#2a2d42] flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold mb-1">Lesson Master</h3>
            <p className="text-gray-400 text-sm">
              Youve completed this lesson with {accuracy}% accuracy!
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3">
        {hasNextLesson && onNextLesson && (
          <button
            onClick={onNextLesson}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            Next Lesson
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        
        <button
          onClick={onBackToCourses}
          className="w-full bg-[#2a2d42] hover:bg-[#333649] text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Courses
        </button>
      </div>

      {/* Motivational Message */}
      <p className="text-gray-500 text-sm mt-6 text-center">
        Keep learning to unlock more badges and climb the leaderboard! 🚀
      </p>
    </div>
  );
}