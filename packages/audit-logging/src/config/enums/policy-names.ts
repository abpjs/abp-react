/**
 * Audit Logging Policy Names
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 */

/**
 * Enum-like const object for audit logging policy names.
 * Used for permission/policy checks.
 * @since 3.0.0
 */
export const eAuditLoggingPolicyNames = {
  AuditLogging: 'AuditLogging.AuditLogs',
} as const;

/**
 * Type for audit logging policy name values
 */
export type AuditLoggingPolicyNameKey =
  (typeof eAuditLoggingPolicyNames)[keyof typeof eAuditLoggingPolicyNames];
