/**
 * Lazy Style Handler
 * Translated from @abp/ng.theme.shared/lib/handlers/lazy-style.handler.ts
 *
 * Handles RTL/LTR style switching based on locale direction.
 *
 * @since 2.9.0
 */

import { useEffect, useRef, useState } from 'react';
import { LazyLoadService } from '@abpjs/core';
import type { LocaleDirection } from '../models/common';
import { BOOTSTRAP } from '../constants/styles';

/**
 * Creates a lazy style href by replacing the direction placeholder.
 * @param style - The style pattern with {{dir}} placeholder
 * @param dir - The direction ('ltr' or 'rtl')
 * @returns The resolved style href
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * const href = createLazyStyleHref('bootstrap-{{dir}}.min.css', 'rtl');
 * // Returns: 'bootstrap-rtl.min.css'
 * ```
 */
export function createLazyStyleHref(style: string, dir: string): string {
  return style.replace('{{dir}}', dir);
}

/**
 * Options for the LazyStyleHandler hook.
 * @since 2.9.0
 */
export interface LazyStyleHandlerOptions {
  /**
   * Array of style patterns with {{dir}} placeholder.
   * Defaults to [BOOTSTRAP] if not provided.
   */
  styles?: string[];
  /**
   * Initial direction. Defaults to 'ltr'.
   */
  initialDirection?: LocaleDirection;
}

/**
 * Hook for managing RTL/LTR style switching.
 * Automatically switches Bootstrap and other stylesheets based on locale direction.
 *
 * @param options - Configuration options
 * @returns Object with current direction and setDirection function
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * function App() {
 *   const { direction, setDirection } = useLazyStyleHandler({
 *     styles: [BOOTSTRAP],
 *     initialDirection: 'ltr',
 *   });
 *
 *   // Switch to RTL when needed
 *   const handleLanguageChange = (lang: string) => {
 *     if (lang === 'ar' || lang === 'he') {
 *       setDirection('rtl');
 *     } else {
 *       setDirection('ltr');
 *     }
 *   };
 *
 *   return <div dir={direction}>...</div>;
 * }
 * ```
 */
export function useLazyStyleHandler(options: LazyStyleHandlerOptions = {}) {
  const { styles = [BOOTSTRAP], initialDirection = 'ltr' } = options;
  const [direction, setDirection] = useState<LocaleDirection>(initialDirection);
  const lazyLoadRef = useRef(new LazyLoadService());
  const loadedStylesRef = useRef<Map<string, HTMLLinkElement>>(new Map());

  useEffect(() => {
    // Set body dir attribute
    document.body.dir = direction;

    // Switch CSS files
    const switchCSS = async () => {
      const lazyLoad = lazyLoadRef.current;

      for (const style of styles) {
        const href = createLazyStyleHref(style, direction);

        // Skip if already loaded
        if (lazyLoad.isLoaded(href)) {
          continue;
        }

        // Remove old direction style if exists
        const oldDir = direction === 'ltr' ? 'rtl' : 'ltr';
        const oldHref = createLazyStyleHref(style, oldDir);
        const oldLink = loadedStylesRef.current.get(oldHref);
        if (oldLink && oldLink.parentNode) {
          oldLink.parentNode.removeChild(oldLink);
          lazyLoad.remove(oldHref);
          loadedStylesRef.current.delete(oldHref);
        }

        // Load new direction style
        try {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          document.head.appendChild(link);
          loadedStylesRef.current.set(href, link);
        } catch (error) {
          console.warn(`Failed to load style: ${href}`, error);
        }
      }
    };

    switchCSS();
  }, [direction, styles]);

  return {
    direction,
    setDirection,
  };
}

/**
 * Gets the currently loaded Bootstrap stylesheet direction.
 * @param styles - Array of style patterns to check
 * @returns The current direction or undefined if not loaded
 * @since 2.9.0
 */
export function getLoadedBootstrapDirection(
  styles: string[] = [BOOTSTRAP]
): LocaleDirection | undefined {
  for (const style of styles) {
    const ltrHref = createLazyStyleHref(style, 'ltr');
    const rtlHref = createLazyStyleHref(style, 'rtl');

    const links = document.querySelectorAll('link[rel="stylesheet"]');
    for (const link of links) {
      const href = (link as HTMLLinkElement).href;
      if (href.includes(ltrHref)) return 'ltr';
      if (href.includes(rtlHref)) return 'rtl';
    }
  }

  return undefined;
}

/**
 * Initialize lazy style handler for use in providers.
 * Returns a function that creates the handler.
 *
 * @param options - Configuration options
 * @returns Function that initializes the handler
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // In your provider setup
 * const initHandler = initLazyStyleHandler({ styles: [BOOTSTRAP] });
 * const handler = initHandler();
 * ```
 */
export function initLazyStyleHandler(options: LazyStyleHandlerOptions = {}) {
  return () => {
    const { initialDirection = 'ltr' } = options;
    document.body.dir = initialDirection;
    return { direction: initialDirection };
  };
}
