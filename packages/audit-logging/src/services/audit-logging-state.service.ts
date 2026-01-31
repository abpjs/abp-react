/**
 * Audit Logging State Service
 * Translated from @volo/abp.ng.audit-logging v2.0.0
 *
 * This service provides facade methods for dispatching audit logging actions.
 * In Angular, this uses NGXS store dispatch. In React, we wrap the API calls.
 *
 * @since 2.0.0
 */

import type { RestService } from '@abpjs/core';
import type { AuditLogging, Statistics } from '../models';
import { AuditLoggingService } from './audit-logging.service';

/**
 * State service for audit logging operations.
 * Provides facade methods that mirror the Angular AuditLoggingStateService.
 *
 * @since 2.0.0
 */
export class AuditLoggingStateService {
  private auditLoggingService: AuditLoggingService;

  // State
  private _result: AuditLogging.Response = { items: [], totalCount: 0 };
  private _averageExecutionStatistics: Statistics.Data = {};
  private _errorRateStatistics: Statistics.Data = {};

  constructor(restService: RestService) {
    this.auditLoggingService = new AuditLoggingService(restService);
  }

  /**
   * Get the current audit logs result
   */
  getResult(): AuditLogging.Response {
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
  getAverageExecutionStatistics(): Statistics.Data {
    return this._averageExecutionStatistics;
  }

  /**
   * Get error rate statistics
   */
  getErrorRateStatistics(): Statistics.Data {
    return this._errorRateStatistics;
  }

  /**
   * Dispatch get audit logs action
   * @param params Query parameters for fetching audit logs
   * @returns Promise resolving to the audit logs response
   * @since 2.0.0
   */
  async dispatchGetAuditLogs(
    params?: AuditLogging.AuditLogsQueryParams
  ): Promise<AuditLogging.Response> {
    const response = await this.auditLoggingService.getAuditLogs(params);
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
    params?: Statistics.Filter
  ): Promise<Statistics.Response> {
    const response = await this.auditLoggingService.getAverageExecutionDurationPerDayStatistics(params);
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
    params?: Statistics.Filter
  ): Promise<Statistics.Response> {
    const response = await this.auditLoggingService.getErrorRateStatistics(params);
    this._errorRateStatistics = response.data || {};
    return response;
  }
}
