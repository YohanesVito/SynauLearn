// "use client";

// import React, { useEffect, useState } from "react";
// import { ArrowLeft, Edit, Lock } from "lucide-react";
// import { sdk } from "@farcaster/miniapp-sdk";

// interface ProfileProps {
//   onBack: () => void;
// }

// interface Badge {
//   id: string;
//   name: string;
//   icon: string;
//   unlocked: boolean;
// }

// const badges: Badge[] = [
//   { id: "1", name: "DeFi Beginner", icon: "💼", unlocked: true },
//   { id: "2", name: "NFT Novice", icon: "🖼️", unlocked: false },
//   { id: "3", name: "Blockchain Basics", icon: "🏷️", unlocked: false },
//   { id: "4", name: "Smart Contract Pro", icon: "📄", unlocked: false },
//   { id: "5", name: "Crypto Trader", icon: "💹", unlocked: false },
//   { id: "6", name: "Web3 Pioneer", icon: "🚀", unlocked: false },
// ];

// export default function Profile({ onBack }: ProfileProps) {
//   const [user, setUser] = useState(null);
//   const [isInMiniApp, setIsInMiniApp] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         const miniAppStatus = await sdk.isInMiniApp();
//         setIsInMiniApp(miniAppStatus);

//         if (miniAppStatus) {
//           const context = await sdk.context;
//           setUser(context.user);
//         }
//       } catch (error) {
//         console.error("Error loading user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUserData();
//   }, []);

//   // 1️⃣ Not inside Mini App
//   if (!isInMiniApp) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
//         <p className="text-gray-400 text-center max-w-md px-6">
//           ⚠️ Please open this app inside a Farcaster or Base client to view your profile.
//         </p>
//       </div>
//     );
//   }

//   // 2️⃣ Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-400">
//         Loading user profile...
//       </div>
//     );
//   }

//   // 3️⃣ Main Profile UI
//   return (
//     <div className="min-h-screen bg-slate-950 text-white pb-24">
//       {/* Header */}
//       <div className="bg-slate-900 border-b border-slate-800">
//         <div className="px-6 py-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={onBack}
//               className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
//             >
//               <ArrowLeft className="w-6 h-6" />
//             </button>
//             <h1 className="text-2xl font-bold">Profile</h1>
//           </div>
//         </div>
//       </div>

//       {/* Profile Section */}
//       <div className="px-6 py-8">
//         <div className="flex flex-col items-center text-center mb-8">
//           <div className="relative mb-4">
//             <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center overflow-hidden">
//               {user?.pfpUrl ? (
//                 <img
//                   src={user.pfpUrl}
//                   alt={user.username}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="text-8xl">👩‍🦰</div>
//               )}
//             </div>
//             <button className="absolute bottom-0 right-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
//               <Edit className="w-5 h-5 text-white" />
//             </button>
//           </div>

//           <h2 className="text-2xl font-bold mb-1">
//             {user?.displayName || user?.username || "Unnamed User"}
//           </h2>
//           <p className="text-gray-400 mb-2">@{user?.username || "unknown"}</p>
//           <p className="text-gray-500 text-sm">FID: {user?.fid}</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-8">
//           {[
//             { label: "Modules", value: 12 },
//             { label: "Quizzes", value: 8 },
//             { label: "Days Active", value: 25 },
//           ].map((stat) => (
//             <div
//               key={stat.label}
//               className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center"
//             >
//               <div className="text-3xl font-bold mb-1">{stat.value}</div>
//               <div className="text-gray-400 text-sm">{stat.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Badges Section */}
//         <div className="mb-8">
//           <h3 className="text-2xl font-bold mb-6">Badges</h3>
//           <div className="grid grid-cols-3 gap-4">
//             {badges.map((badge) => (
//               <div key={badge.id} className="flex flex-col items-center">
//                 <div
//                   className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-3 transition-all ${
//                     badge.unlocked
//                       ? "bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600"
//                       : "bg-slate-900/50 border-2 border-slate-800 opacity-50"
//                   }`}
//                 >
//                   {badge.unlocked ? (
//                     badge.icon
//                   ) : (
//                     <Lock className="w-8 h-8 text-gray-600" />
//                   )}
//                 </div>
//                 <p
//                   className={`text-xs text-center leading-tight ${
//                     badge.unlocked ? "text-white" : "text-gray-600"
//                   }`}
//                 >
//                   {badge.name}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import { ArrowLeft} from "lucide-react";

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const [user, setUser] = useState(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false); 

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if we're in a Mini App
        const miniAppStatus = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppStatus);

        if (miniAppStatus) {
          // Get context and extract user info
          const context = await sdk.context;
          setUser(context.user);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  // Show message if not in Mini App
  if (!isInMiniApp) {
    return (
      <div>
        <p>Please open this app in a Farcaster or Base client to see your profile.</p>
      </div>
    );
  }

  // Show user information
  if (user) {
    return (
      
      <div>

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
        <h2>Welcome, {user.displayName || user.username}!</h2>
        <p>FID: {user.fid}</p>
        <p>Username: @{user.username}</p>
        {user.pfpUrl && (
          <img 
            src={user.pfpUrl} 
            alt="Profile" 
            width={64} 
            height={64} 
            style={{ borderRadius: '50%' }}
          />
        )}
      </div>
    );
  }

  return <div>Loading user profile...</div>;
}