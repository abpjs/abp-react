/**
 * Account options token
 * Provides dependency injection token for account configuration options.
 *
 * @since 3.0.0
 */

import { AccountConfigOptions } from '../models/config-options';

/**
 * Symbol key for the ACCOUNT_OPTIONS token.
 * Used for dependency injection of account configuration options.
 *
 * In React, this is used with Context API instead of Angular's InjectionToken.
 *
 * @since 3.0.0
 */
export const ACCOUNT_OPTIONS = Symbol('ACCOUNT_OPTIONS');

/**
 * Type declaration for the ACCOUNT_OPTIONS token.
 * @since 3.0.0
 */
export type AccountOptionsToken = typeof ACCOUNT_OPTIONS;

/**
 * Default account options
 * @since 3.0.0
 */
export const DEFAULT_ACCOUNT_OPTIONS: AccountConfigOptions = {
  redirectUrl: '/',
};
