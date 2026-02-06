/**
 * Text Template Management Route Provider
 * Translated from @volo/abp.ng.text-template-management/config v3.0.0
 *
 * Provides route configuration functionality for Text Template Management module.
 * @since 3.0.0
 */

import type { ABP, RoutesService } from '@abpjs/core';
import { eTextTemplateManagementRouteNames } from '../enums/route-names';
import { eTextTemplateManagementPolicyNames } from '../enums/policy-names';

/**
 * Default Text Template Management route configuration
 * @since 3.0.0
 */
export const TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG: ABP.Route = {
  path: '/text-template-management',
  name: eTextTemplateManagementRouteNames.TextTemplates,
  iconClass: 'fas fa-file-alt',
  order: 100,
  requiredPolicy: eTextTemplateManagementPolicyNames.TextTemplates,
};

/**
 * Configure Text Template Management routes
 * @param routes - The routes service instance
 * @returns A function that adds Text Template Management routes
 * @since 3.0.0
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG]);
  };
}

/**
 * Initialize Text Template Management routes
 * Helper function to immediately configure routes
 * @param routes - The routes service instance
 * @since 3.0.0
 */
export function initializeTextTemplateManagementRoutes(
  routes: RoutesService,
): void {
  const configure = configureRoutes(routes);
  configure();
}

/**
 * Text Template Management route providers configuration object
 * React equivalent of Angular's APP_INITIALIZER pattern
 * @since 3.0.0
 */
export const TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS = {
  /** Configure function factory */
  useFactory: configureRoutes,
  /** Dependencies required by the factory */
  deps: ['RoutesService'] as const,
};
