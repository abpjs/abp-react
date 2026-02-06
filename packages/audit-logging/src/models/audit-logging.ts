/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Audit Logging Models
 * Translated from @volo/abp.ng.audit-logging v2.0.0
 */

import type { ABP } from '@abpjs/core';

/**
 * AuditLogging namespace containing all models
 * for audit log management.
 */
export namespace AuditLogging {
  /**
   * State interface for audit logging
   */
  export interface State {
    result: Response;
    averageExecutionStatistics: Statistics.Data;
    errorRateStatistics: Statistics.Data;
  }

  /**
   * Paginated response of audit logs
   */
  export type Response = ABP.PagedResponse<Log>;

  /**
   * Query parameters for fetching audit logs
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
 */
export namespace Statistics {
  /**
   * Filter parameters for statistics queries
   */
  export interface Filter {
    startDate?: string;
    endDate?: string;
  }

  /**
   * Statistics data (key-value pairs)
   */
  export type Data = Record<string, number>;

  /**
   * Statistics response from API
   */
  export interface Response {
    data: Data;
  }
}
