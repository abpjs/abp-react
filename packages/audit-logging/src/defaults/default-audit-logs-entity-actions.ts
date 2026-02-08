/**
 * Default Audit Logs Entity Actions
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * Default entity actions for the AuditLogsComponent.
 * @since 3.0.0
 * @since 4.0.0 - Updated type from AuditLogging.Log to AuditLogDto
 */

import type { EntityAction } from '../tokens/extensions.token';
import type { AuditLogDto } from '../proxy/audit-logging/models';

/**
 * Default entity actions for audit logs.
 * These actions are available by default in the audit logs table.
 */
export const DEFAULT_AUDIT_LOGS_ENTITY_ACTIONS: EntityAction<AuditLogDto>[] = [
  // Default actions can be added here
  // Example:
  // {
  //   text: 'AbpAuditLogging::ViewDetails',
  //   action: ({ record }) => { /* view details logic */ },
  //   icon: 'fas fa-eye',
  // },
];
