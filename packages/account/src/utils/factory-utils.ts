/**
 * Account module factory utilities
 *
 * Translated from @abp/ng.account v3.0.0 lib/utils/factory-utils.
 *
 * @since 3.0.0
 */
import type { AccountOptions } from '../models';

/**
 * Factory function to create account options with default values
 *
 * This function merges the provided options with default values.
 * Translated from @abp/ng.account v3.0.0 accountOptionsFactory.
 *
 * @param options - Partial account options
 * @returns Account options with defaults applied
 *
 * @example
 * ```tsx
 * import { accountOptionsFactory } from '@abpjs/account';
 *
 * const options = accountOptionsFactory({ redirectUrl: '/dashboard' });
 * // options = { redirectUrl: '/dashboard' }
 *
 * const defaultOptions = accountOptionsFactory({});
 * // defaultOptions = { redirectUrl: '/' }
 * ```
 */
export function accountOptionsFactory(options: AccountOptions): Required<AccountOptions> {
  return {
    redirectUrl: '/',
    ...options,
  };
}
