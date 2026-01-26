import { useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import { AccountService } from '../services/account.service';

/**
 * Hook to access the AccountService
 *
 * Provides account-related API operations like tenant lookup and registration.
 *
 * @returns AccountService instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const accountService = useAccountService();
 *
 *   const handleFindTenant = async (name: string) => {
 *     const result = await accountService.findTenant(name);
 *     if (result.success) {
 *       console.log('Found tenant:', result.tenantId);
 *     }
 *   };
 *
 *   return <button onClick={() => handleFindTenant('myTenant')}>Find</button>;
 * }
 * ```
 *
 * @since 0.9.0
 */
export function useAccountService(): AccountService {
  const restService = useRestService();

  return useMemo(() => new AccountService(restService), [restService]);
}
