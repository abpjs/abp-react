/**
 * Common types for theme-shared module.
 * Translated from @abp/ng.theme.shared/lib/models/common.ts
 * @since 1.1.0
 */
import type { ComponentType } from 'react';

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
 */
export interface HttpErrorConfig {
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
     */
    forWhichErrors?:
      | [ErrorScreenErrorCodes]
      | [ErrorScreenErrorCodes, ErrorScreenErrorCodes]
      | [ErrorScreenErrorCodes, ErrorScreenErrorCodes, ErrorScreenErrorCodes]
      | [ErrorScreenErrorCodes, ErrorScreenErrorCodes, ErrorScreenErrorCodes, ErrorScreenErrorCodes];
    /**
     * Whether to hide the close icon on the error screen.
     */
    hideCloseIcon?: boolean;
  };
}
