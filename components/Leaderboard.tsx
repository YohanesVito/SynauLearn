import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy, Medal, Award } from 'lucide-react';
import { API } from '@/lib/api';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface LeaderboardProps {
  onBack: () => void;
}

interface LeaderboardUser {
  id: string;
  fid: number;
  username: string | null;
  display_name: string | null;
  total_xp: number;
  rank?: number;
  isCurrentUser?: boolean;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const { context } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab, context]);

  async function loadLeaderboard() {
    try {
      setLoading(true);
      
      // Fetch top users
      const leaderboardData = await API.getLeaderboard(50); // Get top 50
      
      // Add rank and check for current user
      const rankedUsers = leaderboardData.map((user, index) => ({
        ...user,
        rank: index + 1,
        isCurrentUser: context?.user?.fid === user.fid,
      }));

      // Find current user's rank
      const currentUser = rankedUsers.find(u => u.isCurrentUser);
      if (currentUser) {
        setCurrentUserRank(currentUser.rank!);
      }

      setUsers(rankedUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300 fill-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400 fill-orange-400" />;
      default:
        return null;
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = (user: LeaderboardUser) => {
    return user.display_name || user.username || `User ${user.fid}`;
  };

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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading rankings...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No rankings yet</p>
            <p className="text-gray-500 text-sm">Be the first to earn XP!</p>
          </div>
        </div>
      ) : (
        <>
          {/* Current User Rank Banner (if not in top 10) */}
          {currentUserRank && currentUserRank > 10 && (
            <div className="mx-6 mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold">Your Rank</span>
                <span className="text-white font-bold">#{currentUserRank}</span>
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          <div className="px-6 py-6 space-y-3">
            {users.slice(0, 50).map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
                  user.isCurrentUser 
                    ? 'bg-blue-500/10 border-2 border-blue-500' 
                    : 'bg-slate-900/50 border border-slate-800'
                }`}
              >
                {/* Rank */}
                <div className="w-12 text-center flex items-center justify-center">
                  {user.rank && user.rank <= 3 ? (
                    getRankIcon(user.rank)
                  ) : (
                    <span className="text-xl font-bold text-gray-400">
                      #{user.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                  user.rank === 1 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                    : user.rank === 2
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800'
                    : user.rank === 3
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                    : user.isCurrentUser
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    : 'bg-slate-800 text-gray-300'
                }`}>
                  {getInitials(user.display_name || user.username)}
                </div>

                {/* Name and XP */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${
                    user.isCurrentUser ? 'text-blue-400' : 'text-white'
                  }`}>
                    {getDisplayName(user)}
                    {user.isCurrentUser && (
                      <span className="ml-2 text-xs text-blue-400">(You)</span>
                    )}
                  </h3>
                  <p className="text-blue-500 font-medium text-sm">
                    {user.total_xp.toLocaleString()} XP
                  </p>
                </div>

                {/* Star for current user */}
                {user.isCurrentUser && (
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}