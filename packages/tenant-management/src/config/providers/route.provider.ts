/**
 * Route provider for Tenant Management module.
 * Provides route configuration for the tenant management routes.
 *
 * @since 3.0.0
 */
import { getRoutesService, RoutesService, eLayoutType } from '@abpjs/core';
import { eTenantManagementRouteNames } from '../enums/route-names';
import { eTenantManagementPolicyNames } from '../enums/policy-names';

/**
 * Configures the tenant management module routes.
 * Returns a function that adds the routes to the RoutesService.
 *
 * @param routes - The RoutesService instance to add routes to
 * @returns A function that adds the tenant management routes when called
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
        path: '/tenant-management',
        name: eTenantManagementRouteNames.TenantManagement,
        parentName: 'AbpUiNavigation::Menu:Administration',
        layout: eLayoutType.application,
        iconClass: 'bi bi-people',
        order: 2,
        requiredPolicy: eTenantManagementPolicyNames.TenantManagement,
      },
      {
        path: '/tenant-management/tenants',
        name: eTenantManagementRouteNames.Tenants,
        parentName: eTenantManagementRouteNames.TenantManagement,
        layout: eLayoutType.application,
        requiredPolicy: eTenantManagementPolicyNames.Tenants,
      },
    ]);
  };
}

/**
 * Tenant Management route providers configuration object.
 * Use this to configure tenant management routes in your application.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * const routes = getRoutesService();
 * const addRoutes = TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes(routes);
 * addRoutes();
 * ```
 */
export const TENANT_MANAGEMENT_ROUTE_PROVIDERS = {
  configureRoutes,
};

/**
 * Initializes the tenant management module routes using the global services.
 * Call this function during application startup to register tenant management routes.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * initializeTenantManagementRoutes();
 * ```
 */
export function initializeTenantManagementRoutes(): void {
  const routes = getRoutesService();

  // Add the routes
  const addRoutes = configureRoutes(routes);
  addRoutes();
}
