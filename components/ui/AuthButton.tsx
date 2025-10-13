import { useAuthenticate } from '@coinbase/onchainkit/minikit';
import { useState } from 'react';

export default function AuthButton() {
  const { user, authenticate } = useAuthenticate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = async () => {
    setIsAuthenticating(true);
    try {
      const authenticatedUser = await authenticate();
      if (authenticatedUser) {
        console.log('Authenticated user:', authenticatedUser.fid);
        // Save to your backend
        await saveUserSession(authenticatedUser);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (user) {
    return (
      <div>
        <p>✅ Authenticated as FID: {user.fid}</p>
        <button onClick={() => window.location.reload()}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleAuth}
      disabled={isAuthenticating}
    >
      {isAuthenticating ? 'Authenticating...' : 'Sign In with Farcaster'}
    </button>
  );
}