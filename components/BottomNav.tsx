"use client";

type View = "home" | "courses" | "profile" | "leaderboard" | "signin";

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  {
    id: "home" as const,
    label: "Home",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: "courses" as const,
    label: "Courses",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: "signin" as const,
    label: "SignIn",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },

  // Optional Leaderboard button:
  // {
  //   id: "leaderboard" as const,
  //   label: "Leaderboard",
  //   icon: <TrophyIcon className="w-6 h-6" />
  // },
];

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1d2e] border-t border-[#2a2d42] px-6 py-4 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="flex flex-col items-center gap-1 transition-colors"
          >
            <div className={currentView === id ? "text-blue-500" : "text-gray-500"}>
              {icon}
            </div>
            <span
              className={`text-xs ${currentView === id ? "text-blue-500 font-medium" : "text-gray-500"
                }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
