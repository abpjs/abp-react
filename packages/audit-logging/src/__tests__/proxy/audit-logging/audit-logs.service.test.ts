/**
 * Tests for AuditLogsService (Proxy)
 * @abpjs/audit-logging v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RestService } from '@abpjs/core';
import { AuditLogsService } from '../../../proxy/audit-logging/audit-logs.service';
import { EntityChangeType } from '../../../proxy/auditing/entity-change-type.enum';
import type {
  AuditLogDto,
  EntityChangeDto,
  EntityChangeWithUsernameDto,
  GetAuditLogListDto,
  GetAverageExecutionDurationPerDayOutput,
  GetEntityChangesDto,
  GetErrorRateOutput,
} from '../../../proxy/audit-logging/models';

describe('AuditLogsService (v3.2.0)', () => {
  let service: AuditLogsService;
  let mockRestService: { request: ReturnType<typeof vi.fn> };

  const mockAuditLog: AuditLogDto = {
    id: 'log-1',
    userName: 'admin',
    executionTime: '2024-01-15T10:30:00Z',
    executionDuration: 250,
    clientIpAddress: '192.168.1.1',
    clientName: 'WebClient',
    browserInfo: 'Chrome/120',
    httpMethod: 'POST',
    url: '/api/users',
    exceptions: '',
    comments: '',
    applicationName: 'MyApp',
    correlationId: 'corr-123',
    entityChanges: [],
    actions: [],
  };

  const mockEntityChange: EntityChangeDto = {
    id: 'change-1',
    auditLogId: 'log-1',
    changeTime: '2024-01-15T10:30:00Z',
    changeType: EntityChangeType.Created,
    entityId: 'entity-1',
    entityTypeFullName: 'MyApp.Domain.User',
    propertyChanges: [],
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new AuditLogsService(mockRestService as unknown as RestService);
  });

  describe('constructor and apiName', () => {
    it('should have default apiName of "default"', () => {
      expect(service.apiName).toBe('default');
    });

    it('should store the restService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('get', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockAuditLog);

      const result = await service.get('log-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/log-1',
      });
      expect(result).toEqual(mockAuditLog);
    });

    it('should handle different IDs', async () => {
      mockRestService.request.mockResolvedValue(mockAuditLog);

      await service.get('custom-id-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/custom-id-123',
      });
    });

    it('should propagate errors from restService', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.get('log-1')).rejects.toThrow('Network error');
    });
  });

  describe('getList', () => {
    const mockPagedResult = {
      items: [mockAuditLog],
      totalCount: 1,
    };

    it('should call restService.request with empty params when no input provided', async () => {
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const result = await service.getList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs',
        params: {},
      });
      expect(result).toEqual(mockPagedResult);
    });

    it('should call restService.request with filter params', async () => {
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const filter: GetAuditLogListDto = {
        userName: 'admin',
        hasException: true,
        maxResultCount: 10,
      };

      await service.getList(filter);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs',
        params: filter,
      });
    });

    it('should pass all filter properties', async () => {
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const filter: GetAuditLogListDto = {
        url: '/api/users',
        userName: 'admin',
        applicationName: 'MyApp',
        correlationId: 'corr-123',
        httpMethod: 'POST',
        httpStatusCode: 200,
        maxExecutionDuration: 1000,
        minExecutionDuration: 100,
        hasException: false,
        sorting: 'executionTime desc',
        skipCount: 0,
        maxResultCount: 20,
      };

      await service.getList(filter);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs',
        params: filter,
      });
    });
  });

  describe('getAverageExecutionDurationPerDay', () => {
    const mockOutput: GetAverageExecutionDurationPerDayOutput = {
      data: {
        '2024-01-01': 150,
        '2024-01-02': 200,
      },
    };

    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockOutput);

      const filter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const result = await service.getAverageExecutionDurationPerDay(filter);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
        params: filter,
      });
      expect(result).toEqual(mockOutput);
    });

    it('should return data with date-to-duration mapping', async () => {
      mockRestService.request.mockResolvedValue(mockOutput);

      const result = await service.getAverageExecutionDurationPerDay({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(result.data['2024-01-01']).toBe(150);
      expect(result.data['2024-01-02']).toBe(200);
    });
  });

  describe('getErrorRate', () => {
    const mockOutput: GetErrorRateOutput = {
      data: {
        '2024-01-01': 5,
        '2024-01-02': 3,
      },
    };

    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockOutput);

      const filter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const result = await service.getErrorRate(filter);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/statistics/error-rate',
        params: filter,
      });
      expect(result).toEqual(mockOutput);
    });

    it('should return data with date-to-error-count mapping', async () => {
      mockRestService.request.mockResolvedValue(mockOutput);

      const result = await service.getErrorRate({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(result.data['2024-01-01']).toBe(5);
      expect(result.data['2024-01-02']).toBe(3);
    });
  });

  describe('getEntityChange', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockEntityChange);

      const result = await service.getEntityChange('change-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes/change-1',
      });
      expect(result).toEqual(mockEntityChange);
    });

    it('should handle different entity change IDs', async () => {
      mockRestService.request.mockResolvedValue(mockEntityChange);

      await service.getEntityChange('custom-change-id');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes/custom-change-id',
      });
    });
  });

  describe('getEntityChangeWithUsername', () => {
    const mockWithUsername: EntityChangeWithUsernameDto = {
      entityChange: mockEntityChange,
      userName: 'admin',
    };

    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockWithUsername);

      const result = await service.getEntityChangeWithUsername('change-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes-with-username/change-1',
      });
      expect(result).toEqual(mockWithUsername);
    });

    it('should return entity change with username', async () => {
      mockRestService.request.mockResolvedValue(mockWithUsername);

      const result = await service.getEntityChangeWithUsername('change-1');

      expect(result.userName).toBe('admin');
      expect(result.entityChange.id).toBe('change-1');
    });
  });

  describe('getEntityChanges', () => {
    const mockPagedResult = {
      items: [mockEntityChange],
      totalCount: 1,
    };

    it('should call restService.request with filter parameters', async () => {
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const filter: GetEntityChangesDto = {
        entityId: 'entity-1',
        entityChangeType: EntityChangeType.Updated,
      };

      const result = await service.getEntityChanges(filter);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes',
        params: filter,
      });
      expect(result).toEqual(mockPagedResult);
    });

    it('should pass all filter properties', async () => {
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const filter: GetEntityChangesDto = {
        auditLogId: 'log-1',
        entityChangeType: EntityChangeType.Created,
        entityId: 'entity-1',
        entityTypeFullName: 'User',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        sorting: 'changeTime desc',
        skipCount: 0,
        maxResultCount: 10,
      };

      await service.getEntityChanges(filter);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes',
        params: filter,
      });
    });
  });

  describe('getEntityChangesWithUsername', () => {
    const mockResult: EntityChangeWithUsernameDto[] = [
      {
        entityChange: mockEntityChange,
        userName: 'admin',
      },
      {
        entityChange: { ...mockEntityChange, id: 'change-2' },
        userName: 'user1',
      },
    ];

    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockResult);

      const filter = {
        entityId: 'entity-1',
        entityTypeFullName: 'MyApp.Domain.User',
      };

      const result = await service.getEntityChangesWithUsername(filter);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes-with-username',
        params: filter,
      });
      expect(result).toEqual(mockResult);
    });

    it('should return array of entity changes with usernames', async () => {
      mockRestService.request.mockResolvedValue(mockResult);

      const result = await service.getEntityChangesWithUsername({
        entityId: 'entity-1',
        entityTypeFullName: 'MyApp.Domain.User',
      });

      expect(result).toHaveLength(2);
      expect(result[0].userName).toBe('admin');
      expect(result[1].userName).toBe('user1');
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getList', async () => {
      const error = new Error('Server error');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.getList()).rejects.toThrow('Server error');
    });

    it('should propagate errors from getAverageExecutionDurationPerDay', async () => {
      const error = new Error('Statistics unavailable');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.getAverageExecutionDurationPerDay({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        })
      ).rejects.toThrow('Statistics unavailable');
    });

    it('should propagate errors from getErrorRate', async () => {
      const error = new Error('Rate limit exceeded');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.getErrorRate({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        })
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('should propagate errors from getEntityChange', async () => {
      const error = new Error('Entity change not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.getEntityChange('non-existent')).rejects.toThrow(
        'Entity change not found'
      );
    });

    it('should propagate errors from getEntityChanges', async () => {
      const error = new Error('Database error');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.getEntityChanges({})).rejects.toThrow(
        'Database error'
      );
    });

    it('should propagate errors from getEntityChangesWithUsername', async () => {
      const error = new Error('User not authorized');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.getEntityChangesWithUsername({
          entityId: 'e1',
          entityTypeFullName: 'User',
        })
      ).rejects.toThrow('User not authorized');
    });
  });

  describe('method binding', () => {
    it('should have all methods bound correctly (arrow functions)', () => {
      // Arrow functions are already bound
      expect(typeof service.get).toBe('function');
      expect(typeof service.getList).toBe('function');
      expect(typeof service.getAverageExecutionDurationPerDay).toBe('function');
      expect(typeof service.getErrorRate).toBe('function');
      expect(typeof service.getEntityChange).toBe('function');
      expect(typeof service.getEntityChangeWithUsername).toBe('function');
      expect(typeof service.getEntityChanges).toBe('function');
      expect(typeof service.getEntityChangesWithUsername).toBe('function');
    });

    it('should work when methods are destructured', async () => {
      mockRestService.request.mockResolvedValue(mockAuditLog);

      const { get } = service;
      const result = await get('log-1');

      expect(result).toEqual(mockAuditLog);
    });
  });
});
