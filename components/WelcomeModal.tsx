import React from 'react';
import { BookOpen, Award, Zap, X } from 'lucide-react';

interface WelcomeModalProps {
  onComplete: () => void;
}

export default function WelcomeModal({ onComplete }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 relative">
        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Logo/Icon */}
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white rounded-full"></div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Welcome to SynauLearn! 👋
          </h2>
          
          <p className="text-gray-300 mb-8 text-sm leading-relaxed">
            Master Web3 through interactive lessons, earn badges, and showcase your blockchain expertise.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Interactive Lessons</h3>
                <p className="text-gray-400 text-xs">
                  Learn blockchain, DeFi, NFTs through bite-sized lessons
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Test Your Knowledge</h3>
                <p className="text-gray-400 text-xs">
                  Challenge yourself with quizzes and practical exercises
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Earn Badges</h3>
                <p className="text-gray-400 text-xs">
                  Collect unique badges and showcase your achievements
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}