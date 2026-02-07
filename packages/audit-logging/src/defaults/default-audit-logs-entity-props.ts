/**
 * Default Audit Logs Entity Props
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * Default entity properties for the AuditLogsComponent.
 * @since 3.0.0
 * @since 4.0.0 - Updated type from AuditLogging.Log to AuditLogDto
 */

import type { EntityProp } from '../tokens/extensions.token';
import type { AuditLogDto } from '../proxy/audit-logging/models';

/**
 * Default entity properties for audit logs.
 * These properties define the columns displayed in the audit logs table.
 */
export const DEFAULT_AUDIT_LOGS_ENTITY_PROPS: EntityProp<AuditLogDto>[] = [
  {
    type: 'string',
    name: 'url',
    displayName: 'AbpAuditLogging::Url',
    sortable: true,
  },
  {
    type: 'string',
    name: 'httpMethod',
    displayName: 'AbpAuditLogging::HttpMethod',
    sortable: true,
  },
  {
    type: 'number',
    name: 'httpStatusCode',
    displayName: 'AbpAuditLogging::HttpStatusCode',
    sortable: true,
  },
  {
    type: 'string',
    name: 'userName',
    displayName: 'AbpAuditLogging::UserName',
    sortable: true,
  },
  {
    type: 'date',
    name: 'executionTime',
    displayName: 'AbpAuditLogging::ExecutionTime',
    sortable: true,
  },
  {
    type: 'number',
    name: 'executionDuration',
    displayName: 'AbpAuditLogging::ExecutionDuration',
    sortable: true,
  },
  {
    type: 'string',
    name: 'clientIpAddress',
    displayName: 'AbpAuditLogging::ClientIpAddress',
    sortable: true,
  },
  {
    type: 'string',
    name: 'applicationName',
    displayName: 'AbpAuditLogging::ApplicationName',
    sortable: true,
  },
];
