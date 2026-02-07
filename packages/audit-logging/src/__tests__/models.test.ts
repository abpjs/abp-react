/**
 * Tests for audit-logging models
 * @abpjs/audit-logging v3.2.0
 *
 * Note: In v3.2.0, many of these types are deprecated in favor of proxy DTOs.
 * See proxy/audit-logging/models.ts for the new typed DTOs.
 */
import { describe, it, expect } from 'vitest';
import type { AuditLogging, Statistics } from '../models';
import type { AuditLogDto } from '../proxy/audit-logging/models';

describe('AuditLogging Models', () => {
  describe('AuditLogging.Log', () => {
    it('should define Log interface correctly', () => {
      const log: AuditLogging.Log = {
        id: '1',
        userId: 'user1',
        userName: 'admin',
        tenantId: 'tenant1',
        impersonatorUserId: '',
        impersonatorTenantId: '',
        executionTime: '2024-01-01T00:00:00Z',
        executionDuration: 100,
        clientIpAddress: '127.0.0.1',
        clientName: 'Browser',
        browserInfo: 'Chrome/120',
        httpMethod: 'GET',
        url: '/api/test',
        exceptions: '',
        comments: 'Test',
        httpStatusCode: 200,
        applicationName: 'TestApp',
        correlationId: 'corr-123',
        extraProperties: {},
        entityChanges: [],
        actions: [],
      };

      expect(log.id).toBe('1');
      expect(log.userName).toBe('admin');
      expect(log.httpStatusCode).toBe(200);
      expect(log.entityChanges).toEqual([]);
      expect(log.actions).toEqual([]);
    });
  });

  describe('AuditLogging.EntityChange', () => {
    it('should define EntityChange interface correctly', () => {
      const entityChange: AuditLogging.EntityChange = {
        id: 'ec1',
        auditLogId: '1',
        tenantId: 'tenant1',
        changeTime: '2024-01-01T00:00:00Z',
        changeType: 1,
        entityId: 'entity1',
        entityTypeFullName: 'User',
        propertyChanges: [],
        extraProperties: {},
      };

      expect(entityChange.id).toBe('ec1');
      expect(entityChange.changeType).toBe(1);
      expect(entityChange.propertyChanges).toEqual([]);
    });

    it('should allow optional tenantId and entityTenantId', () => {
      const entityChange: AuditLogging.EntityChange = {
        id: 'ec1',
        auditLogId: '1',
        changeTime: '2024-01-01T00:00:00Z',
        changeType: 1,
        entityId: 'entity1',
        entityTypeFullName: 'User',
        propertyChanges: [],
        extraProperties: {},
      };

      expect(entityChange.tenantId).toBeUndefined();
      expect(entityChange.entityTenantId).toBeUndefined();
    });
  });

  describe('AuditLogging.PropertyChange', () => {
    it('should define PropertyChange interface correctly', () => {
      const propertyChange: AuditLogging.PropertyChange = {
        id: 'pc1',
        entityChangeId: 'ec1',
        newValue: 'new',
        originalValue: 'old',
        propertyName: 'Name',
        propertyTypeFullName: 'string',
      };

      expect(propertyChange.id).toBe('pc1');
      expect(propertyChange.newValue).toBe('new');
      expect(propertyChange.originalValue).toBe('old');
    });

    it('should allow optional newValue and originalValue', () => {
      const propertyChange: AuditLogging.PropertyChange = {
        id: 'pc1',
        entityChangeId: 'ec1',
        propertyName: 'Name',
        propertyTypeFullName: 'string',
      };

      expect(propertyChange.newValue).toBeUndefined();
      expect(propertyChange.originalValue).toBeUndefined();
    });
  });

  describe('AuditLogging.AuditLogAction', () => {
    it('should define AuditLogAction interface correctly', () => {
      const action: AuditLogging.AuditLogAction = {
        id: 'a1',
        auditLogId: '1',
        tenantId: 'tenant1',
        serviceName: 'UserService',
        methodName: 'GetUsers',
        parameters: '{}',
        executionTime: '2024-01-01T00:00:00Z',
        executionDuration: 50,
        extraProperties: {},
      };

      expect(action.id).toBe('a1');
      expect(action.serviceName).toBe('UserService');
      expect(action.executionDuration).toBe(50);
    });

    it('should allow optional tenantId', () => {
      const action: AuditLogging.AuditLogAction = {
        id: 'a1',
        auditLogId: '1',
        serviceName: 'UserService',
        methodName: 'GetUsers',
        parameters: '{}',
        executionTime: '2024-01-01T00:00:00Z',
        executionDuration: 50,
        extraProperties: {},
      };

      expect(action.tenantId).toBeUndefined();
    });
  });

  describe('AuditLogging.AuditLogsQueryParams', () => {
    it('should define AuditLogsQueryParams interface correctly', () => {
      const params: AuditLogging.AuditLogsQueryParams = {
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'executionTime desc',
        url: '/api',
        userName: 'admin',
        applicationName: 'TestApp',
        correlationId: 'corr-123',
        httpMethod: 'GET',
        httpStatusCode: 200,
        minExecutionDuration: 0,
        maxExecutionDuration: 1000,
        hasException: false,
        startTime: '2024-01-01',
        endTime: '2024-01-31',
      };

      expect(params.skipCount).toBe(0);
      expect(params.maxResultCount).toBe(10);
      expect(params.httpMethod).toBe('GET');
      expect(params.hasException).toBe(false);
    });

    it('should allow all optional query params', () => {
      const params: AuditLogging.AuditLogsQueryParams = {};

      expect(params.url).toBeUndefined();
      expect(params.userName).toBeUndefined();
      expect(params.hasException).toBeUndefined();
    });
  });

  describe('AuditLogging.State', () => {
    it('should define State interface correctly', () => {
      const state: AuditLogging.State = {
        result: {
          items: [],
          totalCount: 0,
        },
        averageExecutionStatistics: {},
        errorRateStatistics: {},
      };

      expect(state.result.items).toEqual([]);
      expect(state.result.totalCount).toBe(0);
      expect(state.averageExecutionStatistics).toEqual({});
    });

    it('should use PagedResultDto<AuditLogDto> for result (v3.2.0)', () => {
      // In v3.2.0, State.result uses the new proxy DTO types
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

      const state: AuditLogging.State = {
        result: {
          items: [mockAuditLog],
          totalCount: 1,
        },
        averageExecutionStatistics: { '2024-01-01': 150 },
        errorRateStatistics: { '2024-01-01': 5 },
      };

      expect(state.result.items).toHaveLength(1);
      expect(state.result.items[0].id).toBe('log-1');
      expect(state.averageExecutionStatistics['2024-01-01']).toBe(150);
      expect(state.errorRateStatistics['2024-01-01']).toBe(5);
    });

    it('should use Record<string, number> for statistics (v3.2.0)', () => {
      // In v3.2.0, statistics use Record<string, number> directly
      const state: AuditLogging.State = {
        result: { items: [], totalCount: 0 },
        averageExecutionStatistics: {
          '2024-01-01': 100,
          '2024-01-02': 200,
        },
        errorRateStatistics: {
          '2024-01-01': 5,
          '2024-01-02': 3,
        },
      };

      expect(typeof state.averageExecutionStatistics['2024-01-01']).toBe('number');
      expect(typeof state.errorRateStatistics['2024-01-01']).toBe('number');
    });
  });

  describe('deprecation compatibility (v3.2.0)', () => {
    it('should still support deprecated Response type', () => {
      // Response is deprecated but still works for backward compatibility
      const response: AuditLogging.Response = {
        items: [],
        totalCount: 0,
      };

      expect(response.items).toEqual([]);
      expect(response.totalCount).toBe(0);
    });

    it('should still support deprecated AuditLogsQueryParams type', () => {
      // AuditLogsQueryParams is deprecated, use GetAuditLogListDto instead
      const params: AuditLogging.AuditLogsQueryParams = {
        userName: 'admin',
        hasException: true,
      };

      expect(params.userName).toBe('admin');
      expect(params.hasException).toBe(true);
    });

    it('should still support deprecated Log type', () => {
      // Log is deprecated, use AuditLogDto instead
      const log: AuditLogging.Log = {
        id: '1',
        userId: 'user1',
        userName: 'admin',
        tenantId: 'tenant1',
        impersonatorUserId: '',
        impersonatorTenantId: '',
        executionTime: '2024-01-01T00:00:00Z',
        executionDuration: 100,
        clientIpAddress: '127.0.0.1',
        clientName: 'Browser',
        browserInfo: 'Chrome/120',
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

      expect(log.id).toBe('1');
    });
  });
});

/**
 * Statistics namespace is deprecated in v3.2.0.
 * Use GetAverageExecutionDurationPerDayOutput and GetErrorRateOutput from proxy instead.
 */
describe('Statistics Models (deprecated in v3.2.0)', () => {
  describe('Statistics.Filter', () => {
    it('should define Filter interface correctly', () => {
      const filter: Statistics.Filter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      expect(filter.startDate).toBe('2024-01-01');
      expect(filter.endDate).toBe('2024-01-31');
    });

    it('should allow optional dates', () => {
      const filter: Statistics.Filter = {};

      expect(filter.startDate).toBeUndefined();
      expect(filter.endDate).toBeUndefined();
    });
  });

  describe('Statistics.Data', () => {
    it('should define Data type correctly', () => {
      const data: Statistics.Data = {
        '2024-01-01': 100,
        '2024-01-02': 150,
        '2024-01-03': 200,
      };

      expect(data['2024-01-01']).toBe(100);
      expect(data['2024-01-02']).toBe(150);
      expect(Object.keys(data)).toHaveLength(3);
    });

    it('should allow empty data object', () => {
      const data: Statistics.Data = {};

      expect(Object.keys(data)).toHaveLength(0);
    });
  });

  describe('Statistics.Response', () => {
    it('should define Response interface correctly', () => {
      const response: Statistics.Response = {
        data: {
          errors: 10,
          success: 90,
        },
      };

      expect(response.data.errors).toBe(10);
      expect(response.data.success).toBe(90);
    });
  });
});
