import { SafeArea } from "@coinbase/onchainkit/minikit";
import { Star, ArrowRight, Target, BookCheck, Zap } from "lucide-react";
import Image from "next/image";
import BirdMascot from "@/assets/mascot/bird-mascot.svg";

interface CompletePageProps {
  courseTitle: string;
  totalXP: number;
  cardsCompleted: number;
  correctAnswers: number;
  onBackToCourses: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export default function CompletePage({
  courseTitle,
  totalXP,
  cardsCompleted,
  correctAnswers,
  onBackToCourses,
  onNextLesson,
  hasNextLesson = false,
}: CompletePageProps) {
  const accuracy = Math.round((correctAnswers / cardsCompleted) * 100);

  return (
    <SafeArea>
      <div className="bg-[#1a1d2e] z-50 flex flex-col items-center gap-4 justify-center px-6 py-10 -mb-10">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-white">Lesson Complete!</h1>
          <p className="text-gray-400 text-lg">{courseTitle}</p>
        </div>

        <Image src={BirdMascot} alt="bird-mascot" className="w-56 h-56 my-8" />

        {/* Stats Cards */}
        <div className="w-full max-w-md space-y-4">
          <div className="w-full flex justify-between items-center space-x-6">
            <div className="flex-1 flex flex-col border border-primary p-1 gap-2 bg-primary rounded-2xl text-center">
              <p className="text-white text-sm font-semibold">Total XP</p>
              <div className="text-lg bg-[#1a1d2e] rounded-2xl font-bold text-primary p-4 flex gap-2 justify-center items-center">
                <Zap fill="oklch(54.6% 0.245 262.881)" /> {totalXP}
              </div>
            </div>
            <div className="flex-1 flex flex-col border border-gray-400 p-1 gap-2 bg-gray-400 rounded-2xl text-center">
              <p className="text-white text-sm font-semibold">Total Card</p>
              <div className="text-lg bg-[#1a1d2e] rounded-2xl font-bold text-gray-400 p-4 flex gap-2 justify-center items-center">
                <BookCheck /> {cardsCompleted}
              </div>
            </div>
            <div className="flex-1 flex flex-col border border-emerald-600 p-1 gap-2 bg-emerald-600 rounded-2xl text-center">
              <p className="text-white text-sm font-semibold">Accuracy</p>
              <div className="text-lg bg-[#1a1d2e] rounded-2xl font-bold text-emerald-600 p-4 flex gap-2 justify-center items-center">
                <Target /> {accuracy}%
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="bg-[#252841] rounded-2xl p-4 border border-[#2a2d42] flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h3 className="text-white font-bold text-lg">Lesson Master</h3>
              <p className="text-gray-400 text-sm">
                You&apos;ve completed this lesson with{" "}
                <span className="font-bold">{accuracy}%</span> accuracy!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-2">
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
            className="w-full bg-primary hover:bg-[#333649] text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            Continue
          </button>
          {/* Motivational Message */}
          <p className="text-gray-500 text-sm mt-6 text-center">
            Keep learning to unlock more badges and climb the leaderboard! 🚀
          </p>
        </div>
      </div>
    </SafeArea>
  );
}
