/**
 * Lazy Styles Token
 * Translated from @abp/ng.theme.shared/lib/tokens/lazy-styles.token.ts
 *
 * Provides configuration for lazy-loaded stylesheets with RTL/LTR support.
 *
 * @since 2.9.0
 */

import { createContext, useContext } from 'react';
import { BOOTSTRAP } from '../constants/styles';

/**
 * Default lazy styles configuration.
 * @since 2.9.0
 */
export const DEFAULT_LAZY_STYLES: string[] = [BOOTSTRAP];

/**
 * Context for lazy styles configuration.
 * @since 2.9.0
 */
export const LazyStylesContext = createContext<string[]>(DEFAULT_LAZY_STYLES);

/**
 * Hook to get lazy styles configuration.
 * @returns Array of style patterns with {{dir}} placeholder
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const lazyStyles = useLazyStyles();
 *   // lazyStyles = ['bootstrap-{{dir}}.min.css']
 * }
 * ```
 */
export function useLazyStyles(): string[] {
  return useContext(LazyStylesContext);
}

/**
 * LAZY_STYLES constant for backwards compatibility.
 * In React, use LazyStylesContext or useLazyStyles() hook instead.
 * @since 2.9.0
 */
export const LAZY_STYLES = DEFAULT_LAZY_STYLES;
