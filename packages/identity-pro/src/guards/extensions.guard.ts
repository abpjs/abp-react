/**
 * Identity Extensions Guard
 * Guard for loading identity extensions before route activation.
 * @since 3.0.0
 */

/**
 * Hook to guard identity routes and load extensions.
 * In Angular, this was a CanActivate guard that loaded entity actions,
 * toolbar actions, entity props, and form props for identity components.
 *
 * In React, this is implemented as a hook that can be used in route loaders
 * or component initialization.
 *
 * @returns Promise that resolves to true when extensions are loaded
 */
export async function identityExtensionsGuard(): Promise<boolean> {
  // In Angular, this guard loads the entity actions, toolbar actions,
  // entity props, and form props from the DEFAULT_IDENTITY_* constants
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
 * import { useIdentityExtensionsGuard } from '@abpjs/identity-pro';
 *
 * function IdentityLayout() {
 *   const { isLoaded, loading } = useIdentityExtensionsGuard();
 *
 *   if (loading) return <Loading />;
 *
 *   return <Outlet />;
 * }
 * ```
 */
export function useIdentityExtensionsGuard(): {
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
 * Identity Extensions Guard class (for compatibility with Angular pattern).
 * @deprecated Use identityExtensionsGuard function or useIdentityExtensionsGuard hook instead.
 */
export class IdentityExtensionsGuard {
  canActivate(): Promise<boolean> {
    return identityExtensionsGuard();
  }
}
