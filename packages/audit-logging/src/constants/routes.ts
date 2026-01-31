/**
 * Audit Logging Routes
 * Translated from @volo/abp.ng.audit-logging v0.7.2
 */

import type { ABP, eLayoutType } from '@abpjs/core';

/**
 * Default routes for audit logging module
 */
export const AUDIT_LOGGING_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'AuditLogs',
      path: 'audit-logs',
      layout: 'application' as eLayoutType,
      requiredPolicy: 'AuditLogging.AuditLogs',
      order: 100,
    },
  ],
};
