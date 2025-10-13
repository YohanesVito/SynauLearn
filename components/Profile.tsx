"use client";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export default function Profile() {
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