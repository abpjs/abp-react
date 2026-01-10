import { useState, useCallback } from 'react';
import { useAbp, useConfig, configActions } from '@abpjs/core';
import { useNavigate } from 'react-router-dom';
import { useAccountOptions } from '../providers';
import type { PasswordFlowResult } from '../models';

/**
 * Token response from OAuth token endpoint
 */
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * Options for password flow login
 */
export interface PasswordFlowOptions {
  /**
   * If true, store tokens in localStorage (persistent)
   * If false, store in sessionStorage (session only)
   * @default false
   */
  remember?: boolean;
}

/**
 * Hook for OAuth Resource Owner Password Credentials (ROPC) flow
 *
 * This hook provides password-based authentication, which is used by the
 * login form to authenticate users with username and password.
 *
 * Note: ROPC flow is considered legacy by OAuth 2.1 but is still used
 * in many enterprise scenarios where the client is trusted.
 */
export function usePasswordFlow() {
  const { store, axiosInstance, applicationConfigurationService } = useAbp();
  const config = useConfig();
  const options = useAccountOptions();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get the token endpoint URL from the OAuth config or discovery
   */
  const getTokenEndpoint = useCallback((): string => {
    const oAuthConfig = config.environment.oAuthConfig;

    // Try metadata_uri first (authority + .well-known/openid-configuration)
    if (oAuthConfig?.authority) {
      // Standard token endpoint path
      return `${oAuthConfig.authority}/connect/token`;
    }

    throw new Error('OAuth authority not configured');
  }, [config.environment.oAuthConfig]);

  /**
   * Perform password flow login
   */
  const login = useCallback(
    async (
      username: string,
      password: string,
      flowOptions?: PasswordFlowOptions
    ): Promise<PasswordFlowResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const oAuthConfig = config.environment.oAuthConfig;

        if (!oAuthConfig?.client_id) {
          throw new Error('OAuth client_id not configured');
        }

        const tokenEndpoint = getTokenEndpoint();

        // Build form data for token request
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', username);
        formData.append('password', password);
        formData.append('client_id', oAuthConfig.client_id);

        if (oAuthConfig.scope) {
          formData.append('scope', oAuthConfig.scope);
        }

        // Make token request
        const response = await axiosInstance.post<TokenResponse>(
          tokenEndpoint,
          formData.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const tokenData = response.data;

        // Determine storage based on "remember" option
        const storage = flowOptions?.remember ? localStorage : sessionStorage;

        // Store tokens (matching angular-oauth2-oidc storage format)
        const storageKey = `oidc.user:${oAuthConfig.authority}:${oAuthConfig.client_id}`;
        const userData = {
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          expires_at: Math.floor(Date.now() / 1000) + tokenData.expires_in,
          refresh_token: tokenData.refresh_token,
          scope: tokenData.scope,
          profile: {}, // Will be filled after config fetch
        };

        storage.setItem(storageKey, JSON.stringify(userData));

        // Also store in oidc-client-ts format for compatibility
        // This allows the UserManager to pick up the session
        const oidcKey = `oidc.user:${oAuthConfig.authority}:${oAuthConfig.client_id}`;
        storage.setItem(oidcKey, JSON.stringify(userData));

        // Refresh application configuration to get updated user info
        const appConfig =
          await applicationConfigurationService.getConfiguration();
        store.dispatch(configActions.setApplicationConfiguration(appConfig));

        // Navigate to redirect URL
        const redirectUrl =
          (window.history.state as { redirectUrl?: string })?.redirectUrl ||
          options.redirectUrl;

        navigate(redirectUrl);

        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error_description ||
          err.response?.data?.error ||
          err.message ||
          'Login failed';

        setError(errorMessage);
        setIsLoading(false);
        console.error('Password flow error:', errorMessage);

        return { success: false, error: errorMessage };
      }
    },
    [
      config.environment.oAuthConfig,
      getTokenEndpoint,
      axiosInstance,
      applicationConfigurationService,
      store,
      options.redirectUrl,
      navigate,
    ]
  );

  /**
   * Clear any stored error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    isLoading,
    error,
    clearError,
  };
}
