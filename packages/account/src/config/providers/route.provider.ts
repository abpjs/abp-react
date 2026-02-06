/**
 * Account route provider for ABP Framework route configuration
 *
 * This provider registers account-related routes with the ABP routing system.
 * Translated from @abp/ng.account/config v3.0.0 ACCOUNT_ROUTE_PROVIDERS.
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * import { configureRoutes, ACCOUNT_ROUTE_PROVIDERS } from '@abpjs/account/config';
 * import { getRoutesService } from '@abpjs/core';
 *
 * // Using the configureRoutes function directly
 * const addRoutes = configureRoutes(getRoutesService());
 * addRoutes();
 *
 * // Or use the initialization helper
 * initializeAccountRoutes();
 * ```
 */
import { getRoutesService, RoutesService, eLayoutType } from '@abpjs/core';
import { eAccountRouteNames } from '../enums/route-names';

/**
 * Configure account routes using the provided RoutesService
 *
 * @param routes - The RoutesService instance to add routes to
 * @returns A function that adds the account routes when called
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '/account',
        name: eAccountRouteNames.Account,
        invisible: true,
        layout: eLayoutType.application,
        order: 1,
      },
      {
        path: '/account/login',
        name: eAccountRouteNames.Login,
        parentName: eAccountRouteNames.Account,
        order: 1,
      },
      {
        path: '/account/register',
        name: eAccountRouteNames.Register,
        parentName: eAccountRouteNames.Account,
        order: 2,
      },
      {
        path: '/account/manage-profile',
        name: eAccountRouteNames.ManageProfile,
        parentName: eAccountRouteNames.Account,
        order: 3,
      },
    ]);
  };
}

/**
 * Account route providers configuration
 *
 * This is the React equivalent of Angular's ACCOUNT_ROUTE_PROVIDERS.
 * It provides a configureRoutes function that can be used to set up routes.
 */
export const ACCOUNT_ROUTE_PROVIDERS = {
  /**
   * Factory function to configure routes
   */
  configureRoutes,
};

/**
 * Initialize account routes using the default RoutesService
 *
 * Call this function during app initialization to register account routes.
 *
 * @example
 * ```tsx
 * // In your app initialization
 * import { initializeAccountRoutes } from '@abpjs/account/config';
 *
 * initializeAccountRoutes();
 * ```
 */
export function initializeAccountRoutes(): void {
  const routes = getRoutesService();
  const addRoutes = configureRoutes(routes);
  addRoutes();
}
