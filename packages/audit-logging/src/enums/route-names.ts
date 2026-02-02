/**
 * Audit Logging Route Names
 * Translated from @volo/abp.ng.audit-logging v2.7.0
 */

/**
 * Enum-like const object for audit logging route names.
 * Used for localization and navigation configuration.
 * @since 2.7.0
 */
export const eAuditLoggingRouteNames = {
  Administration: 'AbpUiNavigation::Menu:Administration',
  AuditLogging: 'AbpAuditLogging::Menu:AuditLogging',
} as const;

/**
 * Type for audit logging route name values
 */
export type AuditLoggingRouteNameKey =
  (typeof eAuditLoggingRouteNames)[keyof typeof eAuditLoggingRouteNames];
