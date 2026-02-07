/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Audit Logging Models
 * Translated from @volo/abp.ng.audit-logging v3.2.0
 *
 * @since 3.2.0 - Updated State type to use new proxy DTOs and Record<string, number>
 *   - State.result now uses PagedResultDto<AuditLogDto>
 *   - State.averageExecutionStatistics now uses Record<string, number>
 *   - State.errorRateStatistics now uses Record<string, number>
 *   - Response, AuditLogsQueryParams, Log are deprecated (use proxy DTOs)
 */

import type { ABP, PagedResultDto } from '@abpjs/core';
import type { AuditLogDto } from '../proxy/audit-logging/models';

/**
 * AuditLogging namespace containing all models
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

  /**
   * Paginated response of audit logs
   * @deprecated To be removed in v4.0. Use PagedResultDto<AuditLogDto> from proxy instead.
   */
  export type Response = ABP.PagedResponse<Log>;

  /**
   * Query parameters for fetching audit logs
   * @deprecated To be removed in v4.0. Use GetAuditLogListDto from proxy instead.
   */
  export interface AuditLogsQueryParams extends ABP.PageQueryParams {
    url?: string;
    userName?: string;
    applicationName?: string;
    correlationId?: string;
    httpMethod?: string;
    httpStatusCode?: number;
    minExecutionDuration?: number;
    maxExecutionDuration?: number;
    hasException?: boolean;
    startTime?: string;
    endTime?: string;
  }

  /**
   * Audit log entry
   * @deprecated To be removed in v4.0. Use AuditLogDto from proxy instead.
   */
  export interface Log {
    id: string;
    userId: string;
    userName: string;
    tenantId: string;
    impersonatorUserId: string;
    impersonatorTenantId: string;
    executionTime: string;
    executionDuration: number;
    clientIpAddress: string;
    clientName: string;
    browserInfo: string;
    httpMethod: string;
    url: string;
    exceptions: string;
    comments: string;
    httpStatusCode: number;
    applicationName: string;
    correlationId: string;
    extraProperties: Record<string, unknown>;
    entityChanges: EntityChange[];
    actions: AuditLogAction[];
  }

  /**
   * Entity change within an audit log
   * @deprecated To be removed in v4.0. Use EntityChangeDto from proxy instead.
   */
  export interface EntityChange {
    id: string;
    auditLogId: string;
    tenantId?: string;
    changeTime: string;
    changeType: number;
    entityTenantId?: string;
    entityId: string;
    entityTypeFullName: string;
    propertyChanges: PropertyChange[];
    extraProperties: Record<string, unknown>;
  }

  /**
   * Property change within an entity change
   * @deprecated To be removed in v4.0. Use EntityPropertyChangeDto from proxy instead.
   */
  export interface PropertyChange {
    id: string;
    entityChangeId: string;
    newValue?: string;
    originalValue?: string;
    propertyName: string;
    propertyTypeFullName: string;
  }

  /**
   * Action within an audit log
   * @deprecated To be removed in v4.0. Use AuditLogActionDto from proxy instead.
   */
  export interface AuditLogAction {
    id: string;
    auditLogId: string;
    tenantId?: string;
    serviceName: string;
    methodName: string;
    parameters: string;
    executionTime: string;
    executionDuration: number;
    extraProperties: Record<string, unknown>;
  }
}

/**
 * Statistics namespace for audit logging metrics
 * @deprecated To be removed in v4.0. Use GetAverageExecutionDurationPerDayOutput and GetErrorRateOutput from proxy instead.
 */
export namespace Statistics {
  /**
   * Filter parameters for statistics queries
   * @deprecated To be removed in v4.0. Use GetAverageExecutionDurationPerDayInput or GetErrorRateFilter from proxy instead.
   */
  export interface Filter {
    startDate?: string;
    endDate?: string;
  }

  /**
   * Statistics data (key-value pairs)
   * @deprecated To be removed in v4.0. Use Record<string, number> directly.
   */
  export type Data = Record<string, number>;

  /**
   * Statistics response from API
   * @deprecated To be removed in v4.0. Use GetAverageExecutionDurationPerDayOutput or GetErrorRateOutput from proxy instead.
   */
  export interface Response {
    data: Data;
  }
}
