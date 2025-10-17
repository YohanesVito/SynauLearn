import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Edit, Lock, Trophy } from 'lucide-react';
import { API } from '@/lib/api';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
// import { SignInButton } from '@farcaster/auth-kit';

interface ProfileProps {
  onBack: () => void;
}

interface Badge {
  id: string;
  courseId: string;
  name: string;
  icon: string;
  unlocked: boolean;
  minted: boolean;
}

export default function Profile({ onBack }: ProfileProps) {
  const { context } = useMiniKit();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalXP: 0,
    cardsCompleted: 0,
    coursesCompleted: 0,
    streak: 3,
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [user, setUser] = useState<{
    username: string;
    displayName: string;
    fid: number;
  } | null>(null);

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);

      if (!context?.user?.fid) return;

      // Get user data
      const userData = await API.getUserOrCreate(
        context.user.fid,
        context.user.username,
        context.user.displayName
      );

      setUser({
        username: userData.username || context.user.username || `user${context.user.fid}`,
        displayName: userData.display_name || context.user.displayName || 'User',
        fid: context.user.fid,
      });

      // Get user stats
      const userStats = await API.getUserStats(userData.id);
      setStats({
        totalXP: userStats.totalXP,
        cardsCompleted: userStats.cardsCompleted,
        coursesCompleted: userStats.coursesCompleted,
        streak: 3, // TODO: Calculate real streak
      });

      // Get all courses and badges
      const courses = await API.getCourses();
      const badgesList: Badge[] = await Promise.all(
        courses.map(async (course) => {
          const progress = await API.getCourseProgressPercentage(userData.id, course.id);
          const isCompleted = progress === 100;

          return {
            id: course.id,
            courseId: course.id,
            name: course.title,
            icon: course.emoji,
            unlocked: isCompleted,
            minted: false, // TODO: Check if minted on-chain
          };
        })
      );

      setBadges(badgesList);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [context]); // ✅ include only what’s used inside

  // ✅ Effect depends on the memoized function
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view profile</p>
          {/* <SignInButton
            onSuccess={({ fid, username }) =>
              console.log(`Hello, ${username}! Your fid is ${fid}.`)
            }
          />
          <p>or</p> */}
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  }

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

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
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-8">
        {/* Avatar and Info */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <div className="text-6xl font-bold text-white">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
              <Edit className="w-5 h-5 text-white" />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-1">{user.displayName}</h2>
          <p className="text-gray-400 mb-2">@{user.username}</p>
          <p className="text-gray-500 text-sm">FID: {user.fid}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold mb-1 text-blue-400">
              {stats.totalXP}
            </div>
            <div className="text-gray-400 text-sm">Total XP</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold mb-1 text-green-400">
              {stats.coursesCompleted}
            </div>
            <div className="text-gray-400 text-sm">Courses</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold mb-1 text-purple-400">
              {stats.cardsCompleted}
            </div>
            <div className="text-gray-400 text-sm">Cards</div>
          </div>
        </div>

        {/* XP Progress to Next Level */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Level Progress</span>
            <span className="text-sm text-blue-400 font-semibold">
              Level {Math.floor(stats.totalXP / 1000) + 1}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
              style={{ width: `${(stats.totalXP % 1000) / 10}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.totalXP % 1000} / 1000 XP to next level
          </p>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Badges</h3>
            <div className="text-sm text-gray-400">
              {unlockedBadges.length} / {badges.length} Unlocked
            </div>
          </div>

          {/* Unlocked Badges */}
          {unlockedBadges.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm text-gray-400 mb-3">Unlocked</h4>
              <div className="grid grid-cols-3 gap-4">
                {unlockedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-orange-500 flex items-center justify-center text-4xl mb-3 relative group cursor-pointer hover:scale-105 transition-transform">
                      {badge.icon}
                      {badge.minted && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-950">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-center leading-tight text-white font-medium">
                      {badge.name}
                    </p>
                    {!badge.minted && (
                      <p className="text-xs text-blue-400 mt-1">Ready to mint</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-400 mb-3">Locked</h4>
              <div className="grid grid-cols-3 gap-4">
                {lockedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center opacity-50">
                    <div className="w-24 h-24 rounded-full bg-slate-900/50 border-2 border-slate-800 flex items-center justify-center text-4xl mb-3">
                      <Lock className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-xs text-center leading-tight text-gray-600">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {unlockedBadges.some(b => !b.minted) && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center">
            <h3 className="text-white font-bold text-lg mb-2">
              🎉 You have {unlockedBadges.filter(b => !b.minted).length} badge(s) ready to mint!
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Mint your badges as NFTs and show them off on-chain
            </p>
            <button
              onClick={() => alert('Open Mint Badge modal')}
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Mint Badges
            </button>
          </div>
        )}
      </div>
    </div>
  );
}