/**
 * Tests for AuditLoggingStateService
 * @abpjs/audit-logging v2.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuditLoggingStateService } from '../services';
import type { AuditLogging, Statistics } from '../models';

describe('AuditLoggingStateService', () => {
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

  describe('dispatchGetAuditLogs (v2.0.0)', () => {
    it('should call the API and update state', async () => {
      const mockResponse: AuditLogging.Response = {
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
      const mockResponse: AuditLogging.Response = {
        items: [],
        totalCount: 0,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: AuditLogging.AuditLogsQueryParams = {
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

  describe('dispatchGetAverageExecutionDurationPerDay (v2.0.0)', () => {
    it('should call the API and update state', async () => {
      const mockResponse: Statistics.Response = {
        data: { '2024-01-01': 100, '2024-01-02': 150 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await stateService.dispatchGetAverageExecutionDurationPerDay();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
        params: {},
      });
      expect(result).toEqual(mockResponse);
      expect(stateService.getAverageExecutionStatistics()).toEqual(mockResponse.data);
    });

    it('should pass filter parameters to the API', async () => {
      const mockResponse: Statistics.Response = {
        data: { '2024-01-15': 200 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: Statistics.Filter = {
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
      const mockResponse: Statistics.Response = {
        data: {},
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetAverageExecutionDurationPerDay();

      expect(stateService.getAverageExecutionStatistics()).toEqual({});
    });
  });

  describe('dispatchGetErrorRate (v2.0.0)', () => {
    it('should call the API and update state', async () => {
      const mockResponse: Statistics.Response = {
        data: { errors: 5, success: 95 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await stateService.dispatchGetErrorRate();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/error-rate',
        params: {},
      });
      expect(result).toEqual(mockResponse);
      expect(stateService.getErrorRateStatistics()).toEqual(mockResponse.data);
    });

    it('should pass filter parameters to the API', async () => {
      const mockResponse: Statistics.Response = {
        data: { errors: 10, success: 90 },
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: Statistics.Filter = {
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
      const mockResponse: Statistics.Response = {
        data: {},
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetErrorRate();

      expect(stateService.getErrorRateStatistics()).toEqual({});
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle response with undefined data in dispatchGetAverageExecutionDurationPerDay', async () => {
      // Response without data property (undefined)
      const mockResponse = {} as Statistics.Response;
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetAverageExecutionDurationPerDay();

      // Should default to empty object when data is undefined
      expect(stateService.getAverageExecutionStatistics()).toEqual({});
    });

    it('should handle response with undefined data in dispatchGetErrorRate', async () => {
      // Response without data property (undefined)
      const mockResponse = {} as Statistics.Response;
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetErrorRate();

      // Should default to empty object when data is undefined
      expect(stateService.getErrorRateStatistics()).toEqual({});
    });

    it('should handle response with undefined totalCount', async () => {
      // Response without totalCount (relies on || 0 fallback in getTotalCount)
      const mockResponse = {
        items: [],
      } as unknown as AuditLogging.Response;
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetAuditLogs();

      expect(stateService.getTotalCount()).toBe(0);
    });

    it('should handle null data in dispatchGetAverageExecutionDurationPerDay', async () => {
      const mockResponse = { data: null } as unknown as Statistics.Response;
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetAverageExecutionDurationPerDay();

      expect(stateService.getAverageExecutionStatistics()).toEqual({});
    });

    it('should handle null data in dispatchGetErrorRate', async () => {
      const mockResponse = { data: null } as unknown as Statistics.Response;
      mockRequest.mockResolvedValueOnce(mockResponse);

      await stateService.dispatchGetErrorRate();

      expect(stateService.getErrorRateStatistics()).toEqual({});
    });
  });

  describe('state updates', () => {
    it('should update state after multiple dispatch calls', async () => {
      // First dispatch for audit logs
      const logsResponse: AuditLogging.Response = {
        items: [],
        totalCount: 5,
      };
      mockRequest.mockResolvedValueOnce(logsResponse);
      await stateService.dispatchGetAuditLogs();

      // Second dispatch for average execution stats
      const avgStatsResponse: Statistics.Response = {
        data: { '2024-01-01': 100 },
      };
      mockRequest.mockResolvedValueOnce(avgStatsResponse);
      await stateService.dispatchGetAverageExecutionDurationPerDay();

      // Third dispatch for error rate stats
      const errorRateResponse: Statistics.Response = {
        data: { errors: 2 },
      };
      mockRequest.mockResolvedValueOnce(errorRateResponse);
      await stateService.dispatchGetErrorRate();

      // Verify all state was updated correctly
      expect(stateService.getTotalCount()).toBe(5);
      expect(stateService.getAverageExecutionStatistics()).toEqual({ '2024-01-01': 100 });
      expect(stateService.getErrorRateStatistics()).toEqual({ errors: 2 });
    });
  });
});
