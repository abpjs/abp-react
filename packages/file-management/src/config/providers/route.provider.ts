/**
 * Route provider for File Management module.
 * Provides route configuration for the file management routes.
 *
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/config/providers/route.provider
 */
import { getRoutesService, RoutesService, eLayoutType } from '@abpjs/core';
import { eFileManagementRouteNames } from '../enums/route-names';
import { eFileManagementPolicyNames } from '../enums/policy-names';

/**
 * Configures the file management module routes.
 * Returns a function that adds the routes to the RoutesService.
 *
 * @param routes - The RoutesService instance to add routes to
 * @returns A function that adds the file management routes when called
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
        path: '/file-management',
        name: eFileManagementRouteNames.FileManagement,
        parentName: 'AbpUiNavigation::Menu:Administration',
        layout: eLayoutType.application,
        iconClass: 'bi bi-folder',
        order: 30,
        requiredPolicy: eFileManagementPolicyNames.DirectoryDescriptor,
      },
    ]);
  };
}

/**
 * File Management route providers configuration object.
 * Use this to configure file management routes in your application.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * const routes = getRoutesService();
 * const addRoutes = FILE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes(routes);
 * addRoutes();
 * ```
 */
export const FILE_MANAGEMENT_ROUTE_PROVIDERS = {
  configureRoutes,
};

/**
 * Initializes the file management module routes using the global services.
 * Call this function during application startup to register file management routes.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * initializeFileManagementRoutes();
 * ```
 */
export function initializeFileManagementRoutes(): void {
  const routes = getRoutesService();

  // Add the routes
  const addRoutes = configureRoutes(routes);
  addRoutes();
}
