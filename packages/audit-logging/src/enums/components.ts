/**
 * Audit Logging Component Identifiers
 * Translated from @volo/abp.ng.audit-logging v2.7.0
 */

/**
 * Enum-like const object for audit logging component identifiers.
 * Used for component registration and identification.
 * @since 2.4.0 - Added AuditLogs
 * @since 2.7.0 - Added EntityChanges
 */
export const eAuditLoggingComponents = {
  AuditLogs: 'AuditLogging.AuditLogsComponent',
  EntityChanges: 'AuditLogging.EntityChangesComponent',
} as const;

/**
 * Type for audit logging component key values
 */
export type AuditLoggingComponentKey =
  (typeof eAuditLoggingComponents)[keyof typeof eAuditLoggingComponents];
