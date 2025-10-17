import React, { useState, useEffect } from 'react';
import { Home, GraduationCap, User, BarChart3, Award, Moon, Settings, HelpCircle, X } from 'lucide-react';
import { API } from '@/lib/api';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onMintBadgeClick: () => void;
}

export default function Drawer({ isOpen, onClose, currentView, onNavigate, onMintBadgeClick }: DrawerProps) {
  const { context } = useMiniKit();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userStats, setUserStats] = useState({
    displayName: 'User',
    username: 'user',
    totalXP: 0,
    badgeCount: 0,
  });

  useEffect(() => {
    async function loadUserData() {
      if (context?.user?.fid && isOpen) {
        try {
          const user = await API.getUserOrCreate(
            context.user.fid,
            context.user.username,
            context.user.displayName
          );

          const stats = await API.getUserStats(user.id);

          setUserStats({
            displayName: user.display_name || context.user.displayName || 'User',
            username: user.username || context.user.username || `user${context.user.fid}`,
            totalXP: stats.totalXP,
            badgeCount: stats.coursesCompleted,
          });
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    }

    loadUserData();
  }, [context, isOpen]);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'courses', icon: GraduationCap, label: 'Courses' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'leaderboard', icon: BarChart3, label: 'Leaderboard' },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const handleMintBadge = () => {
    onMintBadgeClick();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {context?.user?.pfpUrl || userStats.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{userStats.displayName}</h3>
                  <button 
                    onClick={() => {
                      onNavigate('profile');
                      onClose();
                    }}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* User Stats */}
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-400">{userStats.totalXP}</div>
                <div className="text-xs text-gray-400">Total XP</div>
              </div>
              <div className="flex-1 bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-400">{userStats.badgeCount}</div>
                <div className="text-xs text-gray-400">Badges</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-lg font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* Mint Badge Button */}
            <button
              onClick={handleMintBadge}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-300 hover:bg-slate-800 transition-all"
            >
              <Award className="w-6 h-6" />
              <span className="text-lg font-medium">Mint Badge</span>
            </button>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 space-y-2 border-t border-slate-800">
            {/* Night Mode Toggle */}
            <div className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <Moon className="w-6 h-6 text-gray-300" />
                <span className="text-lg font-medium text-gray-300">Night Mode</span>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Settings */}
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-300 hover:bg-slate-800 transition-colors">
              <Settings className="w-6 h-6" />
              <span className="text-lg font-medium">Settings</span>
            </button>

            {/* Help & Support */}
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-300 hover:bg-slate-800 transition-colors">
              <HelpCircle className="w-6 h-6" />
              <span className="text-lg font-medium">Help & Support</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}