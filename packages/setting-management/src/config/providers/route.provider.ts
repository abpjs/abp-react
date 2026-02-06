/**
 * Route provider for Setting Management module.
 * Provides route configuration for the setting management routes.
 *
 * @since 3.0.0
 */
import {
  getRoutesService,
  getSettingTabsService,
  RoutesService,
  SettingTabsService,
  eLayoutType,
} from '@abpjs/core';
import { eSettingManagementRouteNames } from '../enums/route-names';

/**
 * Configures the setting management module routes.
 * Returns a function that adds the routes to the RoutesService.
 *
 * @param routes - The RoutesService instance to add routes to
 * @returns A function that adds the setting management routes when called
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
        path: '/setting-management',
        name: eSettingManagementRouteNames.Settings,
        parentName: 'AbpUiNavigation::Menu:Administration',
        layout: eLayoutType.application,
        iconClass: 'bi bi-gear',
        order: 100,
      },
    ]);
  };
}

/**
 * Hides the setting management route if no setting tabs are registered.
 * This function checks if there are any visible setting tabs and hides
 * the route if none exist.
 *
 * @param routes - The RoutesService instance
 * @param tabs - The SettingTabsService instance
 * @returns A function that conditionally hides the route
 *
 * @since 3.0.0
 */
export function hideRoutes(routes: RoutesService, tabs: SettingTabsService): () => void {
  return () => {
    const visibleTabs = tabs.visible;
    if (!visibleTabs || visibleTabs.length === 0) {
      routes.patch(eSettingManagementRouteNames.Settings, {
        invisible: true,
      });
    }
  };
}

/**
 * Setting Management route providers configuration object.
 * Use this to configure setting management routes in your application.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * const routes = getRoutesService();
 * const addRoutes = SETTING_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes(routes);
 * addRoutes();
 *
 * // To conditionally hide based on tabs:
 * const tabs = getSettingTabsService();
 * const hideIfEmpty = SETTING_MANAGEMENT_ROUTE_PROVIDERS.hideRoutes(routes, tabs);
 * hideIfEmpty();
 * ```
 */
export const SETTING_MANAGEMENT_ROUTE_PROVIDERS = {
  configureRoutes,
  hideRoutes,
};

/**
 * Initializes the setting management module routes using the global services.
 * Call this function during application startup to register setting management routes.
 *
 * @example
 * ```typescript
 * // In your app initialization:
 * initializeSettingManagementRoutes();
 * ```
 */
export function initializeSettingManagementRoutes(): void {
  const routes = getRoutesService();
  const tabs = getSettingTabsService();

  // Add the routes
  const addRoutes = configureRoutes(routes);
  addRoutes();

  // Hide if no tabs
  const hideIfEmpty = hideRoutes(routes, tabs);
  hideIfEmpty();
}
