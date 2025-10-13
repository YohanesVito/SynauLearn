"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Courses from "@/components/Courses";
import BottomNav from "@/components/BottomNav";
import WelcomeModal from "@/components/WelcomeModal";
import Drawer from "@/components/Drawer";
import Leaderboard from "@/components/Leaderboard";
import Profile from "@/components/Profile";
import MintBadge from "@/components/MintBadge";
import SignIn from "@/components/SignIn";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady, context } = useMiniKit();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "courses" | "profile" | "leaderboard" | "signin">("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMintBadge, setShowMintBadge] = useState(false);

  // Initialize MiniKit
  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
    // if (typeof window !== 'undefined' &&
    //   process.env.NODE_ENV === 'development' &&
    //   !window.location.hostname.includes('localhost')) {
    //   import('eruda').then((eruda) => eruda.default.init());
    // }
    import('eruda').then((eruda) => eruda.default.init());
  }, [setMiniAppReady, isMiniAppReady]);

  // Check if user is first-time visitor (works for both browser and Farcaster)
  useEffect(() => {
    const checkFirstTimeUser = () => {
      // Create a unique storage key
      // If user has FID (Farcaster), use that. Otherwise use a generic key for browser testing
      const userId = context?.user?.fid || 'browser_user';
      const storageKey = `synaulearn_welcome_${userId}`;
      const hasSeenWelcome = localStorage.getItem(storageKey);

      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }

      setIsChecking(false);
    };

    // Small delay to ensure smooth loading
    const timer = setTimeout(checkFirstTimeUser, 300);
    return () => clearTimeout(timer);
  }, [context]);

  const handleWelcomeComplete = () => {
    // Save that user has seen the welcome
    const userId = context?.user?.fid || 'browser_user';
    const storageKey = `synaulearn_welcome_${userId}`;
    localStorage.setItem(storageKey, 'true');

    setShowWelcome(false);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as "home" | "courses" | "profile" | "leaderboard" | "signin");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  // Loading state while checking first-time user
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render different views based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'leaderboard':
        return <Leaderboard onBack={handleBackToHome} />;
      case 'profile':
        return <Profile onBack={handleBackToHome} />;
      case 'courses':
        return (
          <>
            <Header onMenuClick={() => setIsDrawerOpen(true)} />
            <div className="px-6 py-6">
              <h1 className="text-2xl font-bold text-white mb-4">Courses</h1>
              <p className="text-gray-400">Courses view coming soon...</p>
            </div>
          </>
        );
      case 'home':
      default:
        return (
          <>
            <Header onMenuClick={() => setIsDrawerOpen(true)} />
            <div className="px-6 py-6">
              <Categories />
              <Courses />
            </div>
          </>
        );
      case 'signin':
        return <SignIn onBack={handleBackToHome}/>;
    }
  };

  return (
    <>
      {/* Welcome Modal for first-time users */}
      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}

      {/* Mint Badge Modal */}
      {showMintBadge && <MintBadge onClose={() => setShowMintBadge(false)} />}

      {/* Drawer Navigation */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={currentView}
        onNavigate={handleNavigate}
        onMintBadgeClick={() => setShowMintBadge(true)}
      />

      {/* Main App */}
      <main className="min-h-screen pb-24 bg-slate-950">
        {renderView()}
        <BottomNav currentView={currentView} onNavigate={handleNavigate} />
      </main>
    </>
  );
}