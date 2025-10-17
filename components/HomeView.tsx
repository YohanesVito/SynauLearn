import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';
import { API } from '@/lib/api';
import { SafeArea, useMiniKit } from '@coinbase/onchainkit/minikit';
import { WalletComponents } from './WalletComponents';
// import { ConnectWallet, WalletIsland } from '@coinbase/onchainkit/wallet';

interface HomeProps {
  userName?: string;
}

interface CourseProgress {
  courseId: string;
  title: string;
  progress: number;
  emoji: string;
}

export default function HomeView({ userName = "User" }: HomeProps) {
  const { context } = useMiniKit();
  const [inProgressCourses, setInProgressCourses] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState({
    totalXP: 0,
    cardsCompleted: 0,
    coursesCompleted: 0,
    streak: 3, // TODO: Calculate real streak
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserProgress() {
      try {
        setLoading(true);

        if (context?.user?.fid) {
          // Get or create user
          const user = await API.getUserOrCreate(
            context.user.fid,
            context.user.username,
            context.user.displayName
          );

          // Get user stats
          const userStats = await API.getUserStats(user.id);
          setStats({
            totalXP: userStats.totalXP,
            cardsCompleted: userStats.cardsCompleted,
            coursesCompleted: userStats.coursesCompleted,
            streak: 3, // TODO: Calculate real streak
          });

          // Get courses in progress (progress > 0 but < 100)
          const courses = await API.getCourses();
          const coursesWithProgress = await Promise.all(
            courses.map(async (course) => {
              const progress = await API.getCourseProgressPercentage(user.id, course.id);
              return {
                courseId: course.id,
                title: course.title,
                progress,
                emoji: course.emoji,
              };
            })
          );

          // Filter courses that are in progress (0 < progress < 100)
          const inProgress = coursesWithProgress
            .filter(c => c.progress > 0 && c.progress < 100)
            .slice(0, 2); // Show max 2

          setInProgressCourses(inProgress);
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProgress();
  }, [context]);

  if (loading) {
    return (
      <div className="px-6 py-6 space-y-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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
      {inProgressCourses.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {inProgressCourses.map((course, index) => {
            const gradients = [
              'from-blue-500 via-purple-500 to-pink-500',
              'from-purple-600 via-pink-500 to-red-500',
            ];

            return (
              <div
                key={course.courseId}
                className="relative rounded-2xl overflow-hidden h-32 cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]}`}></div>
                {/* <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div> */}
                <div className="relative h-full p-4 flex flex-col justify-end">
                  {/* <div className="text-3xl mb-2">{course.emoji}</div> */}
                  <SafeArea>
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {course.title}
                    </h3>
                  </SafeArea>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-xs font-medium">{course.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
          <p className="text-gray-400 mb-3">No courses in progress yet</p>
          <p className="text-gray-500 text-sm">Start a course to see your progress here!</p>
        </div>
      )}

      {/* Daily Challenge */}
      {/* <WalletIsland /> */}
      {/* <ConnectWallet /> */}
      {/* <WalletComponents /> */}
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
            <div className="text-2xl font-bold text-white mb-1">{stats.cardsCompleted}</div>
            <div className="text-xs text-gray-400">Cards Mastered</div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.coursesCompleted}</div>
            <div className="text-xs text-gray-400">Courses Done</div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.streak}</div>
            <div className="text-xs text-gray-400">Day Streak</div>
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