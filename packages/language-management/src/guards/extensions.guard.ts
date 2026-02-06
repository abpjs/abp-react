/**
 * Language Management Extensions Guard
 * Guard for loading language management extensions before route activation.
 * @since 3.0.0
 */

/**
 * Hook to guard language management routes and load extensions.
 * In Angular, this was a CanActivate guard that loaded entity actions,
 * toolbar actions, entity props, and form props for language management components.
 *
 * In React, this is implemented as a hook that can be used in route loaders
 * or component initialization.
 *
 * @returns Promise that resolves to true when extensions are loaded
 */
export async function languageManagementExtensionsGuard(): Promise<boolean> {
  // In Angular, this guard loads the entity actions, toolbar actions,
  // entity props, and form props from the DEFAULT_LANGUAGE_MANAGEMENT_* constants
  // and merges them with any contributed extensions.
  //
  // In React, the extensions are typically loaded via context providers
  // at the route level, so this guard just returns true.
  //
  // If you need to preload extensions, you can add logic here to fetch
  // configuration from the server or initialize extension state.
  return true;
}

/**
 * React hook version of the extensions guard.
 * Can be used in route loaders or useEffect.
 *
 * @example
 * ```tsx
 * import { useLanguageManagementExtensionsGuard } from '@abpjs/language-management';
 *
 * function LanguageManagementLayout() {
 *   const { isLoaded, loading } = useLanguageManagementExtensionsGuard();
 *
 *   if (loading) return <Loading />;
 *
 *   return <Outlet />;
 * }
 * ```
 */
export function useLanguageManagementExtensionsGuard(): {
  isLoaded: boolean;
  loading: boolean;
} {
  // This is a simplified implementation.
  // In a full implementation, this would track loading state
  // and initialize extension configuration.
  return {
    isLoaded: true,
    loading: false,
  };
}

/**
 * Language Management Extensions Guard class (for compatibility with Angular pattern).
 * @deprecated Use languageManagementExtensionsGuard function or useLanguageManagementExtensionsGuard hook instead.
 */
export class LanguageManagementExtensionsGuard {
  canActivate(): Promise<boolean> {
    return languageManagementExtensionsGuard();
  }
}
