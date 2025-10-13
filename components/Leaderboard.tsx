import React, { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderboardUser[] = [
  { rank: 1, name: 'Sophia', xp: 1200, avatar: '👩‍🦰', isCurrentUser: true },
  { rank: 2, name: 'Ethan', xp: 1150, avatar: '👨‍🦱' },
  { rank: 3, name: 'Olivia', xp: 1100, avatar: '👩‍🦳' },
  { rank: 4, name: 'Noah', xp: 1050, avatar: '👨‍🦲' },
  { rank: 5, name: 'Ava', xp: 1000, avatar: '👩' },
  { rank: 6, name: 'Liam', xp: 950, avatar: '👨' },
  { rank: 7, name: 'Isabella', xp: 900, avatar: '👩‍🦱' },
  { rank: 8, name: 'Jackson', xp: 850, avatar: '👨‍🦰' },
  { rank: 9, name: 'Mia', xp: 800, avatar: '👩‍🦲' },
  { rank: 10, name: 'Lucas', xp: 750, avatar: '🧔' },
];

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
              activeTab === 'weekly' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            Weekly
            {activeTab === 'weekly' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
              activeTab === 'monthly' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            Monthly
            {activeTab === 'monthly' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('alltime')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
              activeTab === 'alltime' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            All Time
            {activeTab === 'alltime' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-6 py-6 space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
              user.isCurrentUser ? 'bg-slate-800/70' : 'bg-slate-900/50'
            }`}
          >
            {/* Rank */}
            <div className="w-12 text-center">
              <span className="text-2xl font-bold text-gray-400">
                #{user.rank}
              </span>
            </div>

            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl border-2 border-slate-700">
              {user.avatar}
            </div>

            {/* Name and XP */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                {user.name}
              </h3>
              <p className="text-blue-500 font-medium">
                {user.xp.toLocaleString()} XP
              </p>
            </div>

            {/* Star for current user */}
            {user.isCurrentUser && (
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}