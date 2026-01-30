import React, { createContext, useContext, useMemo } from 'react';
import type { AccountOptions } from '../models';

/**
 * Default account pro options
 * @since 0.7.2
 */
const DEFAULT_OPTIONS: Required<AccountOptions> = {
  redirectUrl: '/',
  redirectToLogin: true,
  loginUrl: '/account/login',
  registerUrl: '/account/register',
  enableSocialLogins: false,
  enableTwoFactor: false,
};

/**
 * Account Pro context value
 * @since 0.7.2
 */
export interface AccountProContextValue {
  options: Required<AccountOptions>;
}

/**
 * Account Pro context
 */
const AccountProContext = createContext<AccountProContextValue | null>(null);

/**
 * Props for AccountProProvider
 */
export interface AccountProProviderProps {
  children: React.ReactNode;
  options?: AccountOptions;
}

/**
 * AccountProProvider - Provides account configuration to the component tree
 *
 * This is the React equivalent of Angular's AccountModule.forRoot(options)
 * from @volo/abp.ng.account.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * <AccountProProvider options={{ redirectUrl: '/dashboard', enableTwoFactor: true }}>
 *   <App />
 * </AccountProProvider>
 * ```
 */
export function AccountProProvider({ children, options }: AccountProProviderProps) {
  const mergedOptions = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
      ...options,
    }),
    [options]
  );

  const value = useMemo<AccountProContextValue>(
    () => ({
      options: mergedOptions,
    }),
    [mergedOptions]
  );

  return (
    <AccountProContext.Provider value={value}>{children}</AccountProContext.Provider>
  );
}

/**
 * Hook to access the account pro context
 *
 * @throws Error if used outside of AccountProProvider
 * @since 0.7.2
 */
export function useAccountProContext(): AccountProContextValue {
  const context = useContext(AccountProContext);
  if (!context) {
    throw new Error('useAccountProContext must be used within an AccountProProvider');
  }
  return context;
}

/**
 * Hook to access account pro options
 *
 * Returns default options if not within AccountProProvider (for standalone usage)
 * @since 0.7.2
 */
export function useAccountProOptions(): Required<AccountOptions> {
  const context = useContext(AccountProContext);
  return context?.options ?? DEFAULT_OPTIONS;
}
