/**
 * Audit Logging Services
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * @since 3.2.0 - AuditLogsService from proxy is the new primary service
 * @since 4.0.0 - Removed AuditLoggingService and EntityChangeService (use AuditLogsService instead)
 */
export { AuditLoggingStateService } from './audit-logging-state.service';

// Re-export proxy service for convenience
export { AuditLogsService } from '../proxy/audit-logging/audit-logs.service';
