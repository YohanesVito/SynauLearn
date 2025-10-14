import React from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';

interface HomeProps {
  userName?: string;
}

export default function HomeView({ userName = "Alex" }: HomeProps) {
  return (
    <div className="px-6 py-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-400 text-sm">Continue Learning</p>
      </div>

      {/* Continue Learning Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden h-32 cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <div className="relative h-full p-4 flex flex-col justify-end">
            <h3 className="text-white font-semibold text-sm mb-1">
              Introduction to Blockchain
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-white text-xs font-medium">75%</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden h-32 cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500"></div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <div className="relative h-full p-4 flex flex-col justify-end">
            <h3 className="text-white font-semibold text-sm mb-1">
              Ethereum Basics
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '50%' }}></div>
              </div>
              <span className="text-white text-xs font-medium">50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2">Daily Challenge</h3>
            <p className="text-gray-400 text-sm mb-1">Master 10 New Web3 Terms</p>
            <p className="text-gray-500 text-xs">Complete to earn bonus XP</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-all">
            Start →
          </button>
        </div>
        
        {/* Challenge Image/Illustration */}
        <div className="relative h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Target className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Progress Snapshot */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Progress Snapshot</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">120</div>
            <div className="text-xs text-gray-400">Blockchain Mastered</div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">8</div>
            <div className="text-xs text-gray-400">Courses Completed</div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-xs text-gray-400">Learning Streak</div>
          </div>
        </div>
      </div>

      {/* Recommended for You */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Recommended for You</h3>
        <div className="space-y-3">
          {/* Course Card 1 */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm mb-1">Advanced Smart Contracts</h4>
              <p className="text-gray-400 text-xs mb-2">
                Write complex smart contracts with Solidity
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-400">12 lessons</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Intermediate</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
              Start
            </button>
          </div>

          {/* Course Card 2 */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💰</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm mb-1">DeFi Explained</h4>
              <p className="text-gray-400 text-xs mb-2">
                Understanding decentralized finance protocols
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-400">8 lessons</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Beginner</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}