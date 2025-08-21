import { useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';

export function useUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync user data when Clerk user changes
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      syncUserData();
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const syncUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync user data');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error('Error syncing user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    if (clerkUser) {
      syncUserData();
    }
  };

  return {
    user,
    clerkUser,
    isLoaded,
    isSignedIn,
    loading,
    error,
    refreshUser,
    syncUserData
  };
}
