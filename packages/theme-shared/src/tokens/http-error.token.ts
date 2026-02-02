/**
 * HTTP Error configuration tokens.
 * Translated from @abp/ng.theme.shared/lib/tokens/http-error.token.ts
 *
 * @since 2.7.0
 */

import { createContext, useContext } from 'react';
import type { HttpErrorConfig } from '../models/common';

/**
 * Token name constant for HTTP_ERROR_CONFIG.
 * Matches the Angular InjectionToken name.
 *
 * @since 2.7.0
 */
export const HTTP_ERROR_CONFIG = 'HTTP_ERROR_CONFIG';

/**
 * Context for HTTP error configuration.
 * Use this to provide custom HTTP error handling configuration.
 *
 * This is the React equivalent of Angular's HTTP_ERROR_CONFIG InjectionToken.
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * import { HttpErrorConfigContext } from '@abpjs/theme-shared';
 *
 * function App() {
 *   const httpErrorConfig: HttpErrorConfig = {
 *     skipHandledErrorCodes: [404],
 *     errorScreen: {
 *       component: MyCustomErrorComponent,
 *       forWhichErrors: [401, 403, 500],
 *     },
 *   };
 *
 *   return (
 *     <HttpErrorConfigContext.Provider value={httpErrorConfig}>
 *       <YourApp />
 *     </HttpErrorConfigContext.Provider>
 *   );
 * }
 * ```
 */
export const HttpErrorConfigContext = createContext<HttpErrorConfig | undefined>(undefined);

/**
 * Factory function to create default HTTP error config.
 * Matches Angular's httpErrorConfigFactory function.
 *
 * @returns Default HttpErrorConfig
 * @since 2.7.0
 */
export function httpErrorConfigFactory(): HttpErrorConfig {
  return {
    skipHandledErrorCodes: [],
    errorScreen: undefined,
  };
}

/**
 * Hook to access the HTTP error configuration.
 *
 * @returns HttpErrorConfig or default config if not provided
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const config = useHttpErrorConfig();
 *
 *   if (config.skipHandledErrorCodes?.includes(404)) {
 *     // Skip handling 404 errors
 *   }
 * }
 * ```
 */
export function useHttpErrorConfig(): HttpErrorConfig {
  const context = useContext(HttpErrorConfigContext);
  return context ?? httpErrorConfigFactory();
}
