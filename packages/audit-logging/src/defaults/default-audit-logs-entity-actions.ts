/**
 * Default Audit Logs Entity Actions
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Default entity actions for the AuditLogsComponent.
 * @since 3.0.0
 */

import type { EntityAction } from '../tokens/extensions.token';
import type { AuditLogging } from '../models/audit-logging';

/**
 * Default entity actions for audit logs.
 * These actions are available by default in the audit logs table.
 */
export const DEFAULT_AUDIT_LOGS_ENTITY_ACTIONS: EntityAction<AuditLogging.Log>[] = [
  // Default actions can be added here
  // Example:
  // {
  //   text: 'AbpAuditLogging::ViewDetails',
  //   action: ({ record }) => { /* view details logic */ },
  //   icon: 'fas fa-eye',
  // },
];
