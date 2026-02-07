/**
 * Audit Logging Services
 * Translated from @volo/abp.ng.audit-logging v3.2.0
 *
 * @since 3.2.0 - AuditLogsService from proxy is the new primary service
 */
export { AuditLoggingStateService } from './audit-logging-state.service';
export { AuditLoggingService } from './audit-logging.service';
export { EntityChangeService } from './entity-change.service';

// Re-export proxy service for convenience
export { AuditLogsService } from '../proxy/audit-logging/audit-logs.service';
