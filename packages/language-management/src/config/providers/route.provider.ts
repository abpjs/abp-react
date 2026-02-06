/**
 * Language Management Route Provider
 * Provides route configuration for the Language Management module.
 * @since 3.0.0
 */

import { getRoutesService, type RoutesService, eLayoutType } from '@abpjs/core';
import { eLanguageManagementRouteNames } from '../enums/route-names';
import { eLanguageManagementPolicyNames } from '../enums/policy-names';

/**
 * Configures language management routes using the provided RoutesService.
 * @param routes - The RoutesService instance to configure routes with
 * @returns A function that adds language management routes when called
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '/language-management',
        name: eLanguageManagementRouteNames.LanguageManagement,
        requiredPolicy: eLanguageManagementPolicyNames.LanguageManagement,
        layout: eLayoutType.application,
        iconClass: 'fas fa-globe',
        order: 6,
        children: [
          {
            path: '/language-management/languages',
            name: eLanguageManagementRouteNames.Languages,
            requiredPolicy: eLanguageManagementPolicyNames.Languages,
            order: 1,
          },
          {
            path: '/language-management/texts',
            name: eLanguageManagementRouteNames.LanguageTexts,
            requiredPolicy: eLanguageManagementPolicyNames.LanguageTexts,
            order: 2,
          },
        ],
      },
    ]);
  };
}

/**
 * Initializes language management routes using the global RoutesService.
 * Convenience function that uses the global RoutesService singleton.
 * @returns A function that adds language management routes when called
 */
export function initializeLanguageManagementRoutes(): () => void {
  const routes = getRoutesService();
  return configureRoutes(routes);
}

/**
 * Language Management route providers object.
 * Can be used for DI-style configuration.
 */
export const LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS = {
  configureRoutes,
};
