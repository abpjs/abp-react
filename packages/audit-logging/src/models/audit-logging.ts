/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Audit Logging Models
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * @since 3.2.0 - Updated State type to use new proxy DTOs and Record<string, number>
 * @since 4.0.0 - Removed deprecated types (Response, AuditLogsQueryParams, Log, EntityChange,
 *   PropertyChange, AuditLogAction). Removed Statistics namespace. Use proxy DTOs instead.
 */

import type { PagedResultDto } from '@abpjs/core';
import type { AuditLogDto } from '../proxy/audit-logging/models';

/**
 * AuditLogging namespace containing state model
 * for audit log management.
 */
export namespace AuditLogging {
  /**
   * State interface for audit logging
   * @since 3.2.0 - Updated to use new proxy DTOs and Record<string, number>
   */
  export interface State {
    result: PagedResultDto<AuditLogDto>;
    averageExecutionStatistics: Record<string, number>;
    errorRateStatistics: Record<string, number>;
  }
}
