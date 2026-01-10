import { useCallback, useEffect, useState } from 'react';
import { User } from 'oidc-client-ts';
import { useUserManager, useCurrentUser } from '../contexts/abp.context';

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const userManager = useUserManager();
  const user = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userManager) {
      userManager.getUser().then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [userManager]);

  const login = useCallback(
    async (redirectUri?: string) => {
      if (!userManager) {
        throw new Error('UserManager not configured');
      }
      await userManager.signinRedirect({
        state: { redirectUrl: redirectUri || window.location.href },
      });
    },
    [userManager]
  );

  const logout = useCallback(async () => {
    if (!userManager) {
      throw new Error('UserManager not configured');
    }
    await userManager.signoutRedirect();
  }, [userManager]);

  const handleCallback = useCallback(async (): Promise<User | null> => {
    if (!userManager) {
      throw new Error('UserManager not configured');
    }
    try {
      const user = await userManager.signinRedirectCallback();
      return user;
    } catch (error) {
      console.error('Error handling auth callback:', error);
      return null;
    }
  }, [userManager]);

  const silentRefresh = useCallback(async (): Promise<User | null> => {
    if (!userManager) {
      throw new Error('UserManager not configured');
    }
    try {
      const user = await userManager.signinSilent();
      return user;
    } catch (error) {
      console.error('Error during silent refresh:', error);
      return null;
    }
  }, [userManager]);

  const isAuthenticated = !!user && !user.expired;
  const accessToken = user?.access_token || null;

  return {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    login,
    logout,
    handleCallback,
    silentRefresh,
  };
}

/**
 * Hook to check if user has valid access token
 */
export function useHasValidAccessToken(): boolean {
  const user = useCurrentUser();
  return !!user && !user.expired;
}
