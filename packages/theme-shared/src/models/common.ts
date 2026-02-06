/**
 * Common types for theme-shared module.
 * Translated from @abp/ng.theme.shared/lib/models/common.ts
 * @since 1.1.0
 * @since 2.7.0 - Added skipHandledErrorCodes, simplified forWhichErrors type
 * @since 2.9.0 - Added LocaleDirection type
 */
import type { ComponentType } from 'react';

/**
 * Locale direction for RTL/LTR support.
 * @since 2.9.0
 */
export type LocaleDirection = 'ltr' | 'rtl';

/**
 * Root parameters for ThemeSharedModule configuration.
 * @since 1.1.0
 */
export interface RootParams {
  httpErrorConfig?: HttpErrorConfig;
}

/**
 * Error screen error codes that can be customized.
 * @since 1.1.0
 */
export type ErrorScreenErrorCodes = 401 | 403 | 404 | 500;

/**
 * Configuration for HTTP error handling.
 * @since 1.1.0
 * @since 2.7.0 - Added skipHandledErrorCodes, simplified forWhichErrors to array
 */
export interface HttpErrorConfig {
  /**
   * Error codes to skip handling (let them pass through).
   * Can be either ErrorScreenErrorCodes or any number.
   * @since 2.7.0
   */
  skipHandledErrorCodes?: ErrorScreenErrorCodes[] | number[];
  /**
   * Custom error screen configuration.
   */
  errorScreen?: {
    /**
     * Custom React component to render for errors.
     */
    component: ComponentType<any>;
    /**
     * Which error codes to show the custom component for.
     * Defaults to all error codes if not specified.
     * @since 2.7.0 - Simplified to just an array of ErrorScreenErrorCodes
     */
    forWhichErrors?: ErrorScreenErrorCodes[];
    /**
     * Whether to hide the close icon on the error screen.
     */
    hideCloseIcon?: boolean;
  };
}
