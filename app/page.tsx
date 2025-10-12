"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Courses from "@/components/Courses";
import BottomNav from "@/components/BottomNav";
import WelcomeModal from "@/components/WelcomeModal";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady, context } = useMiniKit();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "courses" | "profile">("home");

  // Initialize MiniKit
  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
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

  // Loading state while checking first-time user
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Modal for first-time users */}
      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}
      
      {/* Main App */}
      <main className="min-h-screen pb-24">
        <Header />
        <div className="px-6 py-6">
          <Categories />
          <Courses />
        </div>
        <BottomNav currentView={currentView} onNavigate={setCurrentView} />
      </main>
    </>
  );
}