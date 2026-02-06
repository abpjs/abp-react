/**
 * Audit Logging Route Names
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * @since 3.0.0 - Moved to config/enums, removed Administration entry
 */

/**
 * Enum-like const object for audit logging route names.
 * Used for localization and navigation configuration.
 *
 * Note: In v3.0.0, the Administration entry was removed from this enum.
 * Use eAbpRouteNames.Administration from @abpjs/core instead.
 */
export const eAuditLoggingRouteNames = {
  AuditLogging: 'AbpAuditLogging::Menu:AuditLogging',
} as const;

/**
 * Type for audit logging route name values
 */
export type AuditLoggingRouteNameKey =
  (typeof eAuditLoggingRouteNames)[keyof typeof eAuditLoggingRouteNames];
