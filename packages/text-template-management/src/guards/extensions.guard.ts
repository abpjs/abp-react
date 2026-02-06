/**
 * Text Template Management Extensions Guard
 * Translated from @volo/abp.ng.text-template-management v3.0.0
 *
 * Guard for protecting Text Template Management routes and ensuring extensions are loaded.
 *
 * @since 3.0.0
 */

import { useState, useEffect } from 'react';

/**
 * Text Template Management extensions guard function
 * Async guard function that can be used for route protection.
 *
 * @returns Promise<boolean> - True if navigation should proceed
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * // In route configuration
 * const canActivate = await textTemplateManagementExtensionsGuard();
 * if (canActivate) {
 *   // Proceed with navigation
 * }
 * ```
 */
export async function textTemplateManagementExtensionsGuard(): Promise<boolean> {
  // In React, this guard ensures extensions are ready before route activation
  // Currently returns true as extensions are loaded synchronously
  // This can be extended to wait for async extension loading
  return Promise.resolve(true);
}

/**
 * Hook for Text Template Management extensions guard state
 * Provides reactive state for extension loading.
 *
 * @returns Object with isLoaded and loading state
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * function ProtectedRoute({ children }) {
 *   const { isLoaded, loading } = useTextTemplateManagementExtensionsGuard();
 *
 *   if (loading) return <Loading />;
 *   if (!isLoaded) return <Navigate to="/unauthorized" />;
 *
 *   return children;
 * }
 * ```
 */
export function useTextTemplateManagementExtensionsGuard(): {
  isLoaded: boolean;
  loading: boolean;
} {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkExtensions = async () => {
      try {
        const result = await textTemplateManagementExtensionsGuard();
        if (!cancelled) {
          setIsLoaded(result);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setIsLoaded(false);
          setLoading(false);
        }
      }
    };

    checkExtensions();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isLoaded, loading };
}

/**
 * Text Template Management Extensions Guard class
 * Class-based guard implementation for compatibility with Angular patterns.
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * const guard = new TextTemplateManagementExtensionsGuard();
 * const canActivate = await guard.canActivate();
 * ```
 */
export class TextTemplateManagementExtensionsGuard {
  /**
   * Check if the route can be activated
   * @returns Promise<boolean> - True if navigation should proceed
   */
  async canActivate(): Promise<boolean> {
    return textTemplateManagementExtensionsGuard();
  }
}
