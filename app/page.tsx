"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import WelcomeModal from "@/components/WelcomeModal";
import Drawer from "@/components/Drawer";
import Leaderboard from "@/components/Leaderboard";
import Profile from "@/components/Profile";
import MintBadge from "@/components/MintBadge";
import SignIn from "@/components/SignIn";
import CoursesView from "@/components/CoursesView";
import HomeView from "@/components/HomeView";
import MyBalance from "@/components/MyBalance";
// import AuthButton from "@/components/ui/AuthButton";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady, isFrameReady, setFrameReady } = useMiniKit();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "courses" | "profile" | "leaderboard" | "signin" | "balance" | "mintbadge">("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { context } = useMiniKit();

  // const isBaseApp = context?.client?.clientFid?.toString() === "309857";
  // const isFarcaster = context?.client?.clientFid?.toString() === "1";

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

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
    setCurrentView(view as "home" | "courses" | "profile" | "leaderboard" | "signin" | "balance" | "mintbadge");
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
        return <CoursesView onBack={handleBackToHome} />;

      case 'mintbadge':
        return <MintBadge onBack={handleBackToHome} />;

      case 'signin':
        return <SignIn onBack={handleBackToHome} />;

      case 'balance':
        return <MyBalance onBack={handleBackToHome} />;

      case 'home':
      default:
        return (
          <>
            <Header onMenuClick={() => setIsDrawerOpen(true)} />
            <HomeView userName={context?.user?.displayName || context?.user?.username || "User"} />
          </>
        );
    }
  };

  return (
    <>
      {/* Welcome Modal for first-time users */}
      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}

      {/* Drawer Navigation */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={currentView}
        onNavigate={handleNavigate}
        onMintBadgeClick={() => {
          setIsDrawerOpen(false);
          handleNavigate('mintbadge');
        }}
      />

      {/* Main App */}
      <main className="min-h-screen pb-24 bg-slate-950">
        {renderView()}
        <BottomNav currentView={currentView} onNavigate={handleNavigate} />
      </main>
    </>
  );
}