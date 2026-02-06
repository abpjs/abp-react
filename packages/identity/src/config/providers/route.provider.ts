/**
 * Route provider for Identity module.
 * Provides route configuration for the identity management routes.
 *
 * @since 3.0.0
 */
import { getRoutesService, RoutesService, eLayoutType } from '@abpjs/core';
import { eIdentityRouteNames } from '../enums/route-names';
import { eIdentityPolicyNames } from '../enums/policy-names';

/**
 * Configures the identity module routes.
 * Returns a function that adds the routes to the RoutesService.
 *
 * @param routes - The RoutesService instance to add routes to
 * @returns A function that adds the identity routes when called
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
        path: '/identity',
        name: eIdentityRouteNames.IdentityManagement,
        parentName: 'AbpUiNavigation::Menu:Administration',
        requiredPolicy: eIdentityPolicyNames.IdentityManagement,
        layout: eLayoutType.application,
        iconClass: 'bi bi-people',
        order: 1,
      },
      {
        path: '/identity/roles',
        name: eIdentityRouteNames.Roles,
        parentName: eIdentityRouteNames.IdentityManagement,
        requiredPolicy: eIdentityPolicyNames.Roles,
        order: 1,
      },
      {
        path: '/identity/users',
        name: eIdentityRouteNames.Users,
        parentName: eIdentityRouteNames.IdentityManagement,
        requiredPolicy: eIdentityPolicyNames.Users,
        order: 2,
      },
    ]);
  };
}

/**
 * Identity route providers configuration object.
 * Use this to configure identity routes in your application.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * const routes = getRoutesService();
 * const addRoutes = IDENTITY_ROUTE_PROVIDERS.configureRoutes(routes);
 * addRoutes();
 * ```
 */
export const IDENTITY_ROUTE_PROVIDERS = {
  configureRoutes,
};

/**
 * Initializes the identity module routes using the global RoutesService.
 * Call this function during application startup to register identity routes.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * initializeIdentityRoutes();
 * ```
 */
export function initializeIdentityRoutes(): void {
  const routes = getRoutesService();
  const addRoutes = configureRoutes(routes);
  addRoutes();
}
