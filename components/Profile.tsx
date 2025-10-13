'use client';

import React from 'react';
import { ArrowLeft, Edit, Lock } from 'lucide-react';
import { useAuthenticate, useViewProfile } from '@coinbase/onchainkit/minikit';

interface ProfileProps {
  onBack: () => void;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

const badges: Badge[] = [
  { id: '1', name: 'DeFi Beginner', icon: '💼', unlocked: true },
  { id: '2', name: 'NFT Novice', icon: '🖼️', unlocked: false },
  { id: '3', name: 'Blockchain Basics', icon: '🏷️', unlocked: false },
  { id: '4', name: 'Smart Contract Pro', icon: '📄', unlocked: false },
  { id: '5', name: 'Crypto Trader', icon: '💹', unlocked: false },
  { id: '6', name: 'Web3 Pioneer', icon: '🚀', unlocked: false },
];

export default function Profile({ onBack }: ProfileProps) {
  const { user } = useAuthenticate();
  const { profile, loading, error } = useViewProfile(user?.fid);
//   const { context } = useMiniKit(); // reserved for future UX

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
        {loading ? (
          <p className="text-gray-400 text-center">Loading profile...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Failed to load profile</p>
        ) : (
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center overflow-hidden">
                {profile?.pfpUrl ? (
                  <img
                    src={profile.pfpUrl}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-8xl">👩‍🦰</div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <Edit className="w-5 h-5 text-white" />
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-1">
              {profile?.displayName || 'Unnamed User'}
            </h2>
            <p className="text-gray-400 mb-2">@{profile?.username || 'unknown'}</p>
            <p className="text-gray-500 text-sm">Joined January 2022</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Modules', value: 12 },
            { label: 'Quizzes', value: 8 },
            { label: 'Days Active', value: 25 },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Badges</h3>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-3 transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600'
                      : 'bg-slate-900/50 border-2 border-slate-800 opacity-50'
                  }`}
                >
                  {badge.unlocked ? badge.icon : <Lock className="w-8 h-8 text-gray-600" />}
                </div>
                <p
                  className={`text-xs text-center leading-tight ${
                    badge.unlocked ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
