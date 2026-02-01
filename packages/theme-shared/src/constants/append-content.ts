import { createContext } from 'react';

/**
 * Context for theme shared append content functionality.
 * Used to append scripts or stylesheets to the document.
 *
 * This is the React equivalent of Angular's THEME_SHARED_APPEND_CONTENT InjectionToken.
 *
 * @since 2.4.0
 *
 * @example
 * ```tsx
 * // Provide a custom append content function
 * import { ThemeSharedAppendContentContext } from '@abpjs/theme-shared';
 *
 * function App() {
 *   const appendContent = async () => {
 *     // Custom logic to append scripts/styles
 *   };
 *
 *   return (
 *     <ThemeSharedAppendContentContext.Provider value={appendContent}>
 *       <YourApp />
 *     </ThemeSharedAppendContentContext.Provider>
 *   );
 * }
 * ```
 */
export const ThemeSharedAppendContentContext = createContext<
  (() => Promise<void>) | undefined
>(undefined);

/**
 * Token name constant for THEME_SHARED_APPEND_CONTENT.
 * Matches the Angular InjectionToken name.
 *
 * @since 2.4.0
 */
export const THEME_SHARED_APPEND_CONTENT = 'THEME_SHARED_APPEND_CONTENT';
