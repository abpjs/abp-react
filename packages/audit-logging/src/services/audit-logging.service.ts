/**
 * Audit Logging Service
 * Translated from @volo/abp.ng.audit-logging v0.7.2
 */

import type { RestService } from '@abpjs/core';
import type { AuditLogging, Statistics } from '../models';

/**
 * Service for managing audit logs.
 * This service wraps the REST API calls for audit logging operations.
 */
export class AuditLoggingService {
  constructor(private restService: RestService) {}

  /**
   * Get paginated list of audit logs
   * @param params Query parameters for filtering and pagination
   */
  async getAuditLogs(
    params: AuditLogging.AuditLogsQueryParams = {}
  ): Promise<AuditLogging.Response> {
    return this.restService.request<AuditLogging.Response>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs',
      params: params as Record<string, unknown>,
    });
  }

  /**
   * Get a single audit log by ID
   * @param id The ID of the audit log to retrieve
   */
  async getAuditLogById(id: string): Promise<AuditLogging.Log> {
    return this.restService.request<AuditLogging.Log>({
      method: 'GET',
      url: `/api/audit-logging/audit-logs/${id}`,
    });
  }

  /**
   * Get average execution duration per day statistics
   * @param params Filter parameters for date range
   */
  async getAverageExecutionDurationPerDayStatistics(
    params: Statistics.Filter = {}
  ): Promise<Statistics.Response> {
    return this.restService.request<Statistics.Response>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
      params: params as Record<string, unknown>,
    });
  }

  /**
   * Get error rate statistics
   * @param params Filter parameters for date range
   */
  async getErrorRateStatistics(
    params: Statistics.Filter = {}
  ): Promise<Statistics.Response> {
    return this.restService.request<Statistics.Response>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs/statistics/error-rate',
      params: params as Record<string, unknown>,
    });
  }
}
