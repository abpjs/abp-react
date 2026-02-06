/**
 * Route Provider
 * Translated from @abp/ng.theme.shared/lib/providers/route.provider.ts v3.0.0
 *
 * Provides route configuration for the theme-shared module.
 *
 * @since 3.0.0
 */

import { RoutesService, getRoutesService } from '@abpjs/core';
import { eThemeSharedRouteNames } from '../enums/route-names';

/**
 * Configures the theme shared routes.
 * This function is called during app initialization to register
 * the Administration route that other modules can use as a parent.
 *
 * @param routes - The RoutesService instance
 * @returns A function that performs the route configuration
 * @since 3.0.0
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        name: eThemeSharedRouteNames.Administration,
        path: '',
        order: 100,
        iconClass: 'fa fa-wrench',
      },
    ]);
  };
}

/**
 * Theme shared route providers for initialization.
 * Use this in your app setup to configure theme-shared routes.
 *
 * In React, you typically call this during app initialization:
 *
 * @example
 * ```tsx
 * import { initializeThemeSharedRoutes } from '@abpjs/theme-shared';
 *
 * // In your app initialization
 * initializeThemeSharedRoutes();
 * ```
 *
 * @since 3.0.0
 */
export const THEME_SHARED_ROUTE_PROVIDERS = {
  configureRoutes,
};

/**
 * Initialize theme shared routes.
 * Call this function during app initialization to register the Administration route.
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * import { initializeThemeSharedRoutes } from '@abpjs/theme-shared';
 *
 * // Call once during app initialization
 * initializeThemeSharedRoutes();
 * ```
 */
export function initializeThemeSharedRoutes(): void {
  const routesService = getRoutesService();
  configureRoutes(routesService)();
}
