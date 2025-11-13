import React, { useState, useEffect } from 'react';
import { Home, GraduationCap, User, BarChart3, Award, Moon, Sun, Settings, HelpCircle, X } from 'lucide-react';
import { API } from '@/lib/api';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useLocale } from '@/lib/LocaleContext';
import { useTheme } from 'next-themes';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onMintBadgeClick: () => void;
}

export default function Drawer({ isOpen, onClose, currentView, onNavigate, onMintBadgeClick }: DrawerProps) {
  const { t, locale, setLocale } = useLocale();
  const { context } = useMiniKit();
  const { theme, setTheme } = useTheme();
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
    { id: 'home', icon: Home, label: t('drawer.home') },
    { id: 'courses', icon: GraduationCap, label: t('drawer.courses') },
    { id: 'profile', icon: User, label: t('drawer.profile') },
    { id: 'leaderboard', icon: BarChart3, label: t('drawer.leaderboard') },
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
        className={`fixed top-0 left-0 h-full w-80 bg-slate-900 dark:bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  <img
                    src={context?.user?.pfpUrl}
                    alt="Profile"
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%' }}
                  />
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
                    {t('drawer.viewProfile')}
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors lg:hidden"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-gray-300" />
              </button>
            </div>

            {/* User Stats */}
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-800/50 dark:bg-slate-800/70 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-400 dark:text-blue-400">{userStats.totalXP}</div>
                <div className="text-xs text-gray-400 dark:text-gray-400">{t('drawer.totalXP')}</div>
              </div>
              <div className="flex-1 bg-slate-800/50 dark:bg-slate-800/70 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-400 dark:text-purple-400">{userStats.badgeCount}</div>
                <div className="text-xs text-gray-400 dark:text-gray-400">{t('drawer.badges')}</div>
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
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${isActive
                    ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-300 dark:text-gray-200 hover:bg-slate-800 dark:hover:bg-slate-700'
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
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-300 dark:text-gray-200 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all"
            >
              <Award className="w-6 h-6" />
              <span className="text-lg font-medium">{t('drawer.mintBadge')}</span>
            </button>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 space-y-2 border-t border-slate-800 dark:border-slate-700">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-4">
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-gray-300" />
                ) : (
                  <Sun className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
                <span className="text-lg font-medium text-gray-300 dark:text-gray-200">{t('drawer.nightMode')}</span>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`relative w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-400'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Language Switcher */}
            <div className="px-4 py-2 border-b border-slate-800 dark:border-slate-700">
              <div className="text-xs text-gray-400 dark:text-gray-400 mb-2 px-2">Language / Bahasa</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLocale('en')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${locale === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 dark:bg-slate-800 text-gray-300 dark:text-gray-200 hover:bg-slate-700 dark:hover:bg-slate-600'
                    }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => setLocale('id')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${locale === 'id'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 dark:bg-slate-800 text-gray-300 dark:text-gray-200 hover:bg-slate-700 dark:hover:bg-slate-600'
                    }`}
                >
                  🇮🇩 Bahasa
                </button>
              </div>
            </div>

            {/* Settings */}
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-300 dark:text-gray-200 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              <Settings className="w-6 h-6" />
              <span className="text-lg font-medium">{t('drawer.settings')}</span>
            </button>

            {/* Help & Support */}
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-300 dark:text-gray-200 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              <HelpCircle className="w-6 h-6" />
              <span className="text-lg font-medium">{t('drawer.helpSupport')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}