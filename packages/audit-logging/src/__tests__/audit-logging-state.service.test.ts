/**
 * Tests for AuditLoggingStateService
 * @abpjs/audit-logging v4.0.0
 *
 * @since 4.0.0 - Now uses AuditLogsService (proxy) instead of the removed AuditLoggingService
 *   - dispatchGetAuditLogs takes GetAuditLogListDto, returns PagedResultDto<AuditLogDto>
 *   - dispatchGetAverageExecutionDurationPerDay takes GetAverageExecutionDurationPerDayInput (required),
 *     returns GetAverageExecutionDurationPerDayOutput
 *   - dispatchGetErrorRate takes GetErrorRateFilter (required), returns GetErrorRateOutput
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuditLoggingStateService } from '../services';
import type { PagedResultDto } from '@abpjs/core';
import type {
  AuditLogDto,
  GetAuditLogListDto,
  GetAverageExecutionDurationPerDayInput,
  GetAverageExecutionDurationPerDayOutput,
  GetErrorRateFilter,
  GetErrorRateOutput,
} from '../proxy/audit-logging/models';

describe('AuditLoggingStateService (v4.0.0)', () => {
  let mockRequest: ReturnType<typeof vi.fn>;
  let stateService: AuditLoggingStateService;

  beforeEach(() => {
    mockRequest = vi.fn();
    const mockRestService = { request: mockRequest };
    stateService = new AuditLoggingStateService(mockRestService as any);
  });

  describe('getters', () => {
    it('should return empty result initially', () => {
      const result = stateService.getResult();
      expect(result).toEqual({ items: [], totalCount: 0 });
    });

    it('should return 0 total count initially', () => {
      const totalCount = stateService.getTotalCount();
      expect(totalCount).toBe(0);
    });

    it('should return empty average execution statistics initially', () => {
      const stats = stateService.getAverageExecutionStatistics();
      expect(stats).toEqual({});
    });

    it('should return empty error rate statistics initially', () => {
      const stats = stateService.getErrorRateStatistics();
      expect(stats).toEqual({});
    });
  });

  describe('dispatchGetAuditLogs', () => {
    it('should call the API and update state', async () => {
      const mockResponse: PagedResultDto<AuditLogDto> = {
        items: [
          {
            id: '1',
            userId: 'user1',
            userName: 'admin',
            tenantId: '',
            impersonatorUserId: '',
            impersonatorTenantId: '',
            executionTime: '2024-01-01T00:00:00Z',
            executionDuration: 100,
            clientIpAddress: '127.0.0.1',
            clientName: 'Browser',
            browserInfo: 'Chrome',
            httpMethod: 'GET',
            url: '/api/test',
            exceptions: '',
            comments: '',
            httpStatusCode: 200,
            applicationName: 'TestApp',
            correlationId: 'corr-123',
            extraProperties: {},
            entityChanges: [],
            actions: [],
          },
        ],
        totalCount: 1,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await stateService.dispatchGetAuditLogs();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs',
        params: {},
      });
      expect(result).toEqual(mockResponse);
      expect(stateService.getResult()).toEqual(mockResponse);
      expect(stateService.getTotalCount()).toBe(1);
    });

    it('should pass query parameters to the API', async () => {
      const mockResponse: PagedResultDto<AuditLogDto> = {
        items: [],
        totalCount: 0,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetAuditLogListDto = {
        userName: 'admin',
        httpMethod: 'POST',
        maxResultCount: 20,
      };

      await stateService.dispatchGetAuditLogs(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs',
        params,
      });
    });
  });

  describe('dispatchGetAverageExecutionDurationPerDay', () => {
    it('should call the API and update state', async () => {
      const mockResponse: GetAverageExecutionDurationPerDayOutput = {
        data: { '2024-01-01': 100, '2024-01-02': 150 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetAverageExecutionDurationPerDayInput = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const result = await stateService.dispatchGetAverageExecutionDurationPerDay(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
        params,
      });
      expect(result).toEqual(mockResponse);
      expect(stateService.getAverageExecutionStatistics()).toEqual(mockResponse.data);
    });

    it('should pass filter parameters to the API', async () => {
      const mockResponse: GetAverageExecutionDurationPerDayOutput = {
        data: { '2024-01-15': 200 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetAverageExecutionDurationPerDayInput = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetAverageExecutionDurationPerDay(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
        params,
      });
    });

    it('should handle empty data in response', async () => {
      const mockResponse: GetAverageExecutionDurationPerDayOutput = {
        data: {},
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetAverageExecutionDurationPerDayInput = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetAverageExecutionDurationPerDay(params);

      expect(stateService.getAverageExecutionStatistics()).toEqual({});
    });
  });

  describe('dispatchGetErrorRate', () => {
    it('should call the API and update state', async () => {
      const mockResponse: GetErrorRateOutput = {
        data: { errors: 5, success: 95 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetErrorRateFilter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const result = await stateService.dispatchGetErrorRate(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/error-rate',
        params,
      });
      expect(result).toEqual(mockResponse);
      expect(stateService.getErrorRateStatistics()).toEqual(mockResponse.data);
    });

    it('should pass filter parameters to the API', async () => {
      const mockResponse: GetErrorRateOutput = {
        data: { errors: 10, success: 90 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetErrorRateFilter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetErrorRate(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/error-rate',
        params,
      });
    });

    it('should handle empty data in response', async () => {
      const mockResponse: GetErrorRateOutput = {
        data: {},
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetErrorRateFilter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetErrorRate(params);

      expect(stateService.getErrorRateStatistics()).toEqual({});
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle response with undefined data in dispatchGetAverageExecutionDurationPerDay', async () => {
      // Response without data property (undefined)
      const mockResponse = {} as GetAverageExecutionDurationPerDayOutput;
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetAverageExecutionDurationPerDayInput = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetAverageExecutionDurationPerDay(params);

      // Should default to empty object when data is undefined
      expect(stateService.getAverageExecutionStatistics()).toEqual({});
    });

    it('should handle response with undefined data in dispatchGetErrorRate', async () => {
      // Response without data property (undefined)
      const mockResponse = {} as GetErrorRateOutput;
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetErrorRateFilter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetErrorRate(params);

      // Should default to empty object when data is undefined
      expect(stateService.getErrorRateStatistics()).toEqual({});
    });

    it('should handle response with undefined totalCount', async () => {
      // Response without totalCount (relies on || 0 fallback in getTotalCount)
      const mockResponse = {
        items: [],
      } as unknown as PagedResultDto<AuditLogDto>;
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetAuditLogs();

      expect(stateService.getTotalCount()).toBe(0);
    });

    it('should handle null data in dispatchGetAverageExecutionDurationPerDay', async () => {
      const mockResponse = { data: null } as unknown as GetAverageExecutionDurationPerDayOutput;
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetAverageExecutionDurationPerDayInput = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetAverageExecutionDurationPerDay(params);

      expect(stateService.getAverageExecutionStatistics()).toEqual({});
    });

    it('should handle null data in dispatchGetErrorRate', async () => {
      const mockResponse = { data: null } as unknown as GetErrorRateOutput;
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: GetErrorRateFilter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await stateService.dispatchGetErrorRate(params);

      expect(stateService.getErrorRateStatistics()).toEqual({});
    });
  });

  describe('state updates', () => {
    it('should update state after multiple dispatch calls', async () => {
      // First dispatch for audit logs
      const logsResponse: PagedResultDto<AuditLogDto> = {
        items: [],
        totalCount: 5,
      };
      mockRequest.mockResolvedValueOnce(logsResponse);
      await stateService.dispatchGetAuditLogs();

      // Second dispatch for average execution stats
      const avgStatsResponse: GetAverageExecutionDurationPerDayOutput = {
        data: { '2024-01-01': 100 },
      };
      mockRequest.mockResolvedValueOnce(avgStatsResponse);
      await stateService.dispatchGetAverageExecutionDurationPerDay({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      // Third dispatch for error rate stats
      const errorRateResponse: GetErrorRateOutput = {
        data: { errors: 2 },
      };
      mockRequest.mockResolvedValueOnce(errorRateResponse);
      await stateService.dispatchGetErrorRate({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      // Verify all state was updated correctly
      expect(stateService.getTotalCount()).toBe(5);
      expect(stateService.getAverageExecutionStatistics()).toEqual({ '2024-01-01': 100 });
      expect(stateService.getErrorRateStatistics()).toEqual({ errors: 2 });
    });
  });
});
