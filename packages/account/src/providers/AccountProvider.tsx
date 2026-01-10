import React, { createContext, useContext, useMemo } from 'react';
import type { AccountOptions } from '../models';

/**
 * Default account options
 */
const DEFAULT_OPTIONS: Required<AccountOptions> = {
  redirectUrl: '/',
};

/**
 * Account context value
 */
export interface AccountContextValue {
  options: Required<AccountOptions>;
}

/**
 * Account context
 */
const AccountContext = createContext<AccountContextValue | null>(null);

/**
 * Props for AccountProvider
 */
export interface AccountProviderProps {
  children: React.ReactNode;
  options?: AccountOptions;
}

/**
 * AccountProvider - Provides account configuration to the component tree
 *
 * This is the React equivalent of Angular's AccountModule.forRoot(options)
 *
 * @example
 * ```tsx
 * <AccountProvider options={{ redirectUrl: '/dashboard' }}>
 *   <App />
 * </AccountProvider>
 * ```
 */
export function AccountProvider({ children, options }: AccountProviderProps) {
  const mergedOptions = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
      ...options,
    }),
    [options]
  );

  const value = useMemo<AccountContextValue>(
    () => ({
      options: mergedOptions,
    }),
    [mergedOptions]
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

/**
 * Hook to access the account context
 *
 * @throws Error if used outside of AccountProvider
 */
export function useAccountContext(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
}

/**
 * Hook to access account options
 *
 * Returns default options if not within AccountProvider (for standalone usage)
 */
export function useAccountOptions(): Required<AccountOptions> {
  const context = useContext(AccountContext);
  return context?.options ?? DEFAULT_OPTIONS;
}
