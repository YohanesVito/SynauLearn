import React from "react";
import { ArrowLeft, Edit, Lock } from "lucide-react";
import { useViewProfile } from "@coinbase/onchainkit/minikit";

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const { profile } = useViewProfile();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center overflow-hidden">
              {profile?.pfpUrl ? (
                <img src={profile.pfpUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-8xl">👩‍🦰</div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
              <Edit className="w-5 h-5 text-white" />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-1">
            {profile?.displayName || "Anonymous User"}
          </h2>
          <p className="text-gray-400 mb-2">
            @{profile?.username || "unknown"}
          </p>
          <p className="text-gray-500 text-sm">FID: {profile?.fid}</p>
        </div>
      </div>
    </div>
  );
}
