/**
 * Audit Logging State Service
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * This service provides facade methods for dispatching audit logging actions.
 * In Angular, this uses NGXS store dispatch. In React, we wrap the API calls.
 *
 * @since 2.0.0
 * @since 4.0.0 - Now uses AuditLogsService (proxy) instead of the removed AuditLoggingService
 */

import type { PagedResultDto, RestService } from '@abpjs/core';
import type { AuditLogDto, GetAuditLogListDto, GetAverageExecutionDurationPerDayInput, GetAverageExecutionDurationPerDayOutput, GetErrorRateFilter, GetErrorRateOutput } from '../proxy/audit-logging/models';
import { AuditLogsService } from '../proxy/audit-logging/audit-logs.service';

/**
 * State service for audit logging operations.
 * Provides facade methods that mirror the Angular AuditLoggingStateService.
 *
 * @since 2.0.0
 */
export class AuditLoggingStateService {
  private auditLogsService: AuditLogsService;

  // State
  private _result: PagedResultDto<AuditLogDto> = { items: [], totalCount: 0 };
  private _averageExecutionStatistics: Record<string, number> = {};
  private _errorRateStatistics: Record<string, number> = {};

  constructor(restService: RestService) {
    this.auditLogsService = new AuditLogsService(restService);
  }

  /**
   * Get the current audit logs result
   */
  getResult(): PagedResultDto<AuditLogDto> {
    return this._result;
  }

  /**
   * Get the total count of audit logs
   */
  getTotalCount(): number {
    return this._result.totalCount || 0;
  }

  /**
   * Get average execution duration statistics
   */
  getAverageExecutionStatistics(): Record<string, number> {
    return this._averageExecutionStatistics;
  }

  /**
   * Get error rate statistics
   */
  getErrorRateStatistics(): Record<string, number> {
    return this._errorRateStatistics;
  }

  /**
   * Dispatch get audit logs action
   * @param params Query parameters for fetching audit logs
   * @returns Promise resolving to the audit logs response
   * @since 2.0.0
   */
  async dispatchGetAuditLogs(
    params?: GetAuditLogListDto
  ): Promise<PagedResultDto<AuditLogDto>> {
    const response = await this.auditLogsService.getList(params);
    this._result = response;
    return response;
  }

  /**
   * Dispatch get average execution duration per day action
   * @param params Filter parameters for date range
   * @returns Promise resolving to the statistics response
   * @since 2.0.0
   */
  async dispatchGetAverageExecutionDurationPerDay(
    params: GetAverageExecutionDurationPerDayInput
  ): Promise<GetAverageExecutionDurationPerDayOutput> {
    const response = await this.auditLogsService.getAverageExecutionDurationPerDay(params);
    this._averageExecutionStatistics = response.data || {};
    return response;
  }

  /**
   * Dispatch get error rate action
   * @param params Filter parameters for date range
   * @returns Promise resolving to the statistics response
   * @since 2.0.0
   */
  async dispatchGetErrorRate(
    params: GetErrorRateFilter
  ): Promise<GetErrorRateOutput> {
    const response = await this.auditLogsService.getErrorRate(params);
    this._errorRateStatistics = response.data || {};
    return response;
  }
}
