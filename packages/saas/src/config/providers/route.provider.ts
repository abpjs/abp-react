/**
 * SaaS Route Provider
 * Translated from @volo/abp.ng.saas/config v3.0.0
 *
 * Provides route configuration functionality for SaaS module.
 * @since 3.0.0
 */

import type { ABP, RoutesService } from '@abpjs/core';
import { eSaasRouteNames } from '../enums/route-names';

/**
 * Default SaaS route configuration
 * @since 3.0.0
 */
export const SAAS_ROUTE_CONFIG: ABP.Route = {
  path: '/saas',
  name: eSaasRouteNames.Saas,
  iconClass: 'fas fa-building',
  order: 2,
  requiredPolicy: 'Saas.Tenants || Saas.Editions',
  children: [
    {
      path: 'tenants',
      name: eSaasRouteNames.Tenants,
      requiredPolicy: 'Saas.Tenants',
      order: 1,
    },
    {
      path: 'editions',
      name: eSaasRouteNames.Editions,
      requiredPolicy: 'Saas.Editions',
      order: 2,
    },
  ],
};

/**
 * Configure SaaS routes
 * @param routes - The routes service instance
 * @returns A function that adds SaaS routes
 * @since 3.0.0
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([SAAS_ROUTE_CONFIG]);
  };
}

/**
 * Initialize SaaS routes
 * Helper function to immediately configure routes
 * @param routes - The routes service instance
 * @since 3.0.0
 */
export function initializeSaasRoutes(routes: RoutesService): void {
  const configure = configureRoutes(routes);
  configure();
}

/**
 * SaaS route providers configuration object
 * React equivalent of Angular's APP_INITIALIZER pattern
 * @since 3.0.0
 */
export const SAAS_ROUTE_PROVIDERS = {
  /** Configure function factory */
  useFactory: configureRoutes,
  /** Dependencies required by the factory */
  deps: ['RoutesService'] as const,
};
