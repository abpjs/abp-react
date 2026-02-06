/**
 * Account module factory utilities.
 * Provides factory functions for creating account configuration.
 *
 * @since 3.0.0
 */

import { AccountConfigOptions } from '../models/config-options';

/**
 * Factory function to create account options with defaults.
 * Merges provided options with default values.
 *
 * @param options - The account configuration options to merge
 * @returns The merged account options with defaults applied
 *
 * @example
 * ```typescript
 * const options = accountOptionsFactory({ redirectUrl: '/dashboard' });
 * // Returns: { redirectUrl: '/dashboard' }
 *
 * const defaultOptions = accountOptionsFactory({});
 * // Returns: { redirectUrl: '/' }
 * ```
 *
 * @since 3.0.0
 */
export function accountOptionsFactory(options: AccountConfigOptions): {
  redirectUrl: string;
} {
  return {
    redirectUrl: options.redirectUrl ?? '/',
  };
}
