/**
 * Identity Route Provider
 * Provides route configuration for the Identity module.
 * @since 3.0.0
 */

import { getRoutesService, type RoutesService, eLayoutType } from '@abpjs/core';
import { eIdentityRouteNames } from '../enums/route-names';
import { eIdentityPolicyNames } from '../enums/policy-names';

/**
 * Configures identity routes using the provided RoutesService.
 * @param routes - The RoutesService instance to configure routes with
 * @returns A function that adds identity routes when called
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '/identity',
        name: eIdentityRouteNames.IdentityManagement,
        requiredPolicy: eIdentityPolicyNames.IdentityManagement,
        layout: eLayoutType.application,
        iconClass: 'fas fa-id-card-o',
        order: 1,
        children: [
          {
            path: '/identity/roles',
            name: eIdentityRouteNames.Roles,
            requiredPolicy: eIdentityPolicyNames.Roles,
            order: 1,
          },
          {
            path: '/identity/users',
            name: eIdentityRouteNames.Users,
            requiredPolicy: eIdentityPolicyNames.Users,
            order: 2,
          },
          {
            path: '/identity/claim-types',
            name: eIdentityRouteNames.ClaimTypes,
            requiredPolicy: eIdentityPolicyNames.ClaimTypes,
            order: 3,
          },
          {
            path: '/identity/organization-units',
            name: eIdentityRouteNames.OrganizationUnits,
            requiredPolicy: eIdentityPolicyNames.OrganizationUnits,
            order: 4,
          },
        ],
      },
    ]);
  };
}

/**
 * Initializes identity routes using the global RoutesService.
 * Convenience function that uses the global RoutesService singleton.
 * @returns A function that adds identity routes when called
 */
export function initializeIdentityRoutes(): () => void {
  const routes = getRoutesService();
  return configureRoutes(routes);
}

/**
 * Identity route providers object.
 * Can be used for DI-style configuration.
 */
export const IDENTITY_ROUTE_PROVIDERS = {
  configureRoutes,
};
