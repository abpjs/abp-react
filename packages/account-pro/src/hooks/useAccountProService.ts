import { useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import { AccountProService } from '../services/account-pro.service';

/**
 * Hook to access the AccountProService
 *
 * Provides account-related API operations like tenant lookup, registration,
 * password management, and profile updates.
 *
 * @returns AccountProService instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const accountService = useAccountProService();
 *
 *   const handleFindTenant = async (name: string) => {
 *     const result = await accountService.findTenant(name);
 *     if (result.success) {
 *       console.log('Found tenant:', result.tenantId);
 *     }
 *   };
 *
 *   const handleForgotPassword = async (email: string) => {
 *     await accountService.sendPasswordResetCode({ email });
 *     console.log('Password reset code sent');
 *   };
 *
 *   return <button onClick={() => handleFindTenant('myTenant')}>Find</button>;
 * }
 * ```
 *
 * @since 0.7.2
 */
export function useAccountProService(): AccountProService {
  const restService = useRestService();

  return useMemo(() => new AccountProService(restService), [restService]);
}
