/**
 * Audit Logging Route Provider
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Provides route configuration for the audit logging module.
 * @since 3.0.0
 */

import { eLayoutType, getRoutesService } from '@abpjs/core';
import type { RoutesService } from '@abpjs/core';
import { eAuditLoggingRouteNames } from '../enums/route-names';
import { eAuditLoggingPolicyNames } from '../enums/policy-names';

/**
 * Configure audit logging routes.
 * Returns a function that adds the routes when called.
 *
 * @param routes - The routes service instance
 * @returns A function that adds the audit logging routes
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '/audit-logging',
        name: eAuditLoggingRouteNames.AuditLogging,
        parentName: 'AbpUiNavigation::Menu:Administration',
        layout: eLayoutType.application,
        iconClass: 'fas fa-file-alt',
        order: 6,
        requiredPolicy: eAuditLoggingPolicyNames.AuditLogging,
      },
    ]);
  };
}

/**
 * Audit logging route providers configuration.
 * Can be used to add route providers to the application.
 */
export const AUDIT_LOGGING_ROUTE_PROVIDERS = {
  configureRoutes,
};

/**
 * Initialize audit logging routes using the global RoutesService.
 * Convenience function for quick route initialization.
 *
 * @returns The function returned by configureRoutes
 */
export function initializeAuditLoggingRoutes(): () => void {
  const routes = getRoutesService();
  return configureRoutes(routes);
}

export { getRoutesService };
