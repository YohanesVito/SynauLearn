import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface User {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  primaryAddress?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authenticateUser() {
      try {
        setIsLoading(true);
        
        // Use Quick Auth to make authenticated request
        // This automatically handles signature and JWT token
        const res = await sdk.quickAuth.fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/auth/me`
        );

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setError(null);
          
          // Notify MiniKit that app is ready
          sdk.actions.ready();
        } else {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Authentication failed');
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    authenticateUser();
  }, []);

  const logout = () => {
    setUser(null);
    setError(null);
    // Clear any local storage if needed
    localStorage.clear();
  };

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await sdk.quickAuth.fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/auth/me`
      );

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        throw new Error('Failed to refetch user data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refetch');
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    user, 
    isLoading, 
    error, 
    logout, 
    refetch,
    isAuthenticated: !!user 
  };
}