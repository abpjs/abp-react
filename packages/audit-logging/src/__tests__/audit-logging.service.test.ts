/**
 * Tests for AuditLoggingService
 * @abpjs/audit-logging v2.4.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuditLoggingService } from '../services';
import type { AuditLogging } from '../models';

describe('AuditLoggingService', () => {
  let mockRequest: ReturnType<typeof vi.fn>;
  let service: AuditLoggingService;

  beforeEach(() => {
    mockRequest = vi.fn();
    const mockRestService = { request: mockRequest };
    service = new AuditLoggingService(mockRestService as any);
  });

  describe('apiName (v2.4.0)', () => {
    it('should have apiName property set to default', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      service.apiName = 'custom-api';
      expect(service.apiName).toBe('custom-api');
    });

    it('should persist apiName across method calls', () => {
      service.apiName = 'audit-api';
      expect(service.apiName).toBe('audit-api');

      // apiName should still be the same after creating another instance
      const mockRestService2 = { request: vi.fn() };
      const service2 = new AuditLoggingService(mockRestService2 as any);
      expect(service2.apiName).toBe('default'); // New instance has default
      expect(service.apiName).toBe('audit-api'); // Original instance unchanged
    });
  });

  describe('getAuditLogs', () => {
    it('should call request with correct URL and method', async () => {
      const mockResponse: AuditLogging.Response = {
        items: [],
        totalCount: 0,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      await service.getAuditLogs();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs',
        params: {},
      });
    });

    it('should pass query params to request', async () => {
      const mockResponse: AuditLogging.Response = {
        items: [],
        totalCount: 0,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: AuditLogging.AuditLogsQueryParams = {
        userName: 'admin',
        httpMethod: 'GET',
        maxResultCount: 10,
      };

      await service.getAuditLogs(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs',
        params,
      });
    });

    it('should return the response', async () => {
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

      const result = await service.getAuditLogs();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAuditLogById', () => {
    it('should call request with correct URL', async () => {
      const mockLog: AuditLogging.Log = {
        id: '123',
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
      };
      mockRequest.mockResolvedValueOnce(mockLog);

      await service.getAuditLogById('123');

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/123',
      });
    });

    it('should return the audit log', async () => {
      const mockLog: AuditLogging.Log = {
        id: '123',
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
      };
      mockRequest.mockResolvedValueOnce(mockLog);

      const result = await service.getAuditLogById('123');

      expect(result).toEqual(mockLog);
    });
  });

  describe('getAverageExecutionDurationPerDayStatistics', () => {
    it('should call request with correct URL', async () => {
      const mockResponse = { data: { '2024-01-01': 100 } };
      mockRequest.mockResolvedValueOnce(mockResponse);

      await service.getAverageExecutionDurationPerDayStatistics();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
        params: {},
      });
    });

    it('should pass filter params to request', async () => {
      const mockResponse = { data: { '2024-01-01': 100 } };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params = {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T00:00:00Z',
      };

      await service.getAverageExecutionDurationPerDayStatistics(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
        params,
      });
    });
  });

  describe('getErrorRateStatistics', () => {
    it('should call request with correct URL', async () => {
      const mockResponse = { data: { errors: 10, success: 90 } };
      mockRequest.mockResolvedValueOnce(mockResponse);

      await service.getErrorRateStatistics();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/error-rate',
        params: {},
      });
    });

    it('should pass filter params to request', async () => {
      const mockResponse = { data: { errors: 10, success: 90 } };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params = {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T00:00:00Z',
      };

      await service.getErrorRateStatistics(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/error-rate',
        params,
      });
    });
  });
});
