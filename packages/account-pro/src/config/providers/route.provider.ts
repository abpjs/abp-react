/**
 * Route provider for Account module.
 * Provides route configuration for the account routes.
 *
 * @since 3.0.0
 */
import { getRoutesService, RoutesService, eLayoutType } from '@abpjs/core';
import { eAccountRouteNames } from '../enums/route-names';

/**
 * Configures the account module routes.
 * Returns a function that adds the routes to the RoutesService.
 *
 * @param routes - The RoutesService instance to add routes to
 * @returns A function that adds the account routes when called
 *
 * @example
 * ```typescript
 * const routes = getRoutesService();
 * const addRoutes = configureRoutes(routes);
 * addRoutes();
 * ```
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '/account',
        name: eAccountRouteNames.Account,
        layout: eLayoutType.account,
        invisible: true,
      },
      {
        path: '/account/login',
        name: eAccountRouteNames.Login,
        parentName: eAccountRouteNames.Account,
        layout: eLayoutType.account,
        order: 1,
      },
      {
        path: '/account/register',
        name: eAccountRouteNames.Register,
        parentName: eAccountRouteNames.Account,
        layout: eLayoutType.account,
        order: 2,
      },
      {
        path: '/account/forgot-password',
        name: eAccountRouteNames.ForgotPassword,
        parentName: eAccountRouteNames.Account,
        layout: eLayoutType.account,
        order: 3,
      },
      {
        path: '/account/reset-password',
        name: eAccountRouteNames.ResetPassword,
        parentName: eAccountRouteNames.Account,
        layout: eLayoutType.account,
        order: 4,
      },
      {
        path: '/account/manage-profile',
        name: eAccountRouteNames.ManageProfile,
        parentName: eAccountRouteNames.Account,
        layout: eLayoutType.application,
        order: 5,
      },
    ]);
  };
}

/**
 * Account route providers configuration object.
 * Use this to configure account routes in your application.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * const routes = getRoutesService();
 * const addRoutes = ACCOUNT_ROUTE_PROVIDERS.configureRoutes(routes);
 * addRoutes();
 * ```
 */
export const ACCOUNT_ROUTE_PROVIDERS = {
  configureRoutes,
};

/**
 * Initializes the account module routes using the global services.
 * Call this function during application startup to register account routes.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * initializeAccountRoutes();
 * ```
 */
export function initializeAccountRoutes(): void {
  const routes = getRoutesService();

  // Add the routes
  const addRoutes = configureRoutes(routes);
  addRoutes();
}
