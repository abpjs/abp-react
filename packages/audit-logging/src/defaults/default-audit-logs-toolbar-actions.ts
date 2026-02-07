/**
 * Default Audit Logs Toolbar Actions
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * Default toolbar actions for the AuditLogsComponent.
 * @since 3.0.0
 * @since 4.0.0 - Updated type from AuditLogging.Log to AuditLogDto
 */

import type { ToolbarAction } from '../tokens/extensions.token';
import type { AuditLogDto } from '../proxy/audit-logging/models';

/**
 * Default toolbar actions for audit logs.
 * These actions are available in the toolbar above the audit logs table.
 */
export const DEFAULT_AUDIT_LOGS_TOOLBAR_ACTIONS: ToolbarAction<AuditLogDto[]>[] = [
  // Default toolbar actions can be added here
  // Example:
  // {
  //   text: 'AbpAuditLogging::Export',
  //   action: ({ records }) => { /* export logic */ },
  //   icon: 'fas fa-download',
  // },
];
