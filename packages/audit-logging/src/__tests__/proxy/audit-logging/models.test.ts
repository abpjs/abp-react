/**
 * Tests for Audit Logging Proxy Models/DTOs
 * @abpjs/audit-logging v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { EntityChangeType } from '../../../proxy/auditing/entity-change-type.enum';
import type {
  AuditLogActionDto,
  AuditLogDto,
  EntityChangeDto,
  EntityChangeFilter,
  EntityChangeWithUsernameDto,
  EntityPropertyChangeDto,
  GetAuditLogListDto,
  GetAverageExecutionDurationPerDayInput,
  GetAverageExecutionDurationPerDayOutput,
  GetEntityChangesDto,
  GetErrorRateFilter,
  GetErrorRateOutput,
} from '../../../proxy/audit-logging/models';

describe('Proxy Models (v3.2.0)', () => {
  describe('AuditLogActionDto', () => {
    it('should allow creating a valid action DTO', () => {
      const action: AuditLogActionDto = {
        id: 'action-1',
        auditLogId: 'log-1',
        serviceName: 'UserService',
        methodName: 'CreateUser',
        parameters: '{"name": "John"}',
        executionTime: '2024-01-15T10:30:00Z',
        executionDuration: 150,
      };

      expect(action.id).toBe('action-1');
      expect(action.auditLogId).toBe('log-1');
      expect(action.serviceName).toBe('UserService');
      expect(action.methodName).toBe('CreateUser');
      expect(action.parameters).toBe('{"name": "John"}');
      expect(action.executionTime).toBe('2024-01-15T10:30:00Z');
      expect(action.executionDuration).toBe(150);
    });

    it('should allow optional properties', () => {
      const action: AuditLogActionDto = {
        id: 'action-1',
        auditLogId: 'log-1',
        serviceName: 'UserService',
        methodName: 'CreateUser',
        parameters: '{}',
        executionTime: '2024-01-15T10:30:00Z',
        executionDuration: 50,
        tenantId: 'tenant-1',
        extraProperties: { customProp: 'value' },
      };

      expect(action.tenantId).toBe('tenant-1');
      expect(action.extraProperties).toEqual({ customProp: 'value' });
    });

    it('should allow undefined optional properties', () => {
      const action: AuditLogActionDto = {
        id: 'action-1',
        auditLogId: 'log-1',
        serviceName: 'UserService',
        methodName: 'CreateUser',
        parameters: '{}',
        executionTime: '2024-01-15T10:30:00Z',
        executionDuration: 50,
      };

      expect(action.tenantId).toBeUndefined();
      expect(action.extraProperties).toBeUndefined();
    });
  });

  describe('EntityPropertyChangeDto', () => {
    it('should allow creating a valid property change DTO', () => {
      const propertyChange: EntityPropertyChangeDto = {
        id: 'prop-1',
        entityChangeId: 'change-1',
        propertyName: 'Name',
        propertyTypeFullName: 'System.String',
        originalValue: '"OldName"',
        newValue: '"NewName"',
      };

      expect(propertyChange.id).toBe('prop-1');
      expect(propertyChange.entityChangeId).toBe('change-1');
      expect(propertyChange.propertyName).toBe('Name');
      expect(propertyChange.propertyTypeFullName).toBe('System.String');
      expect(propertyChange.originalValue).toBe('"OldName"');
      expect(propertyChange.newValue).toBe('"NewName"');
    });

    it('should allow optional tenantId', () => {
      const propertyChange: EntityPropertyChangeDto = {
        id: 'prop-1',
        entityChangeId: 'change-1',
        propertyName: 'Name',
        propertyTypeFullName: 'System.String',
        originalValue: '"Old"',
        newValue: '"New"',
        tenantId: 'tenant-1',
      };

      expect(propertyChange.tenantId).toBe('tenant-1');
    });
  });

  describe('EntityChangeDto', () => {
    it('should allow creating a valid entity change DTO', () => {
      const entityChange: EntityChangeDto = {
        id: 'change-1',
        auditLogId: 'log-1',
        changeTime: '2024-01-15T10:30:00Z',
        changeType: EntityChangeType.Created,
        entityId: 'entity-1',
        entityTypeFullName: 'MyApp.Domain.User',
        propertyChanges: [],
      };

      expect(entityChange.id).toBe('change-1');
      expect(entityChange.auditLogId).toBe('log-1');
      expect(entityChange.changeTime).toBe('2024-01-15T10:30:00Z');
      expect(entityChange.changeType).toBe(EntityChangeType.Created);
      expect(entityChange.entityId).toBe('entity-1');
      expect(entityChange.entityTypeFullName).toBe('MyApp.Domain.User');
      expect(entityChange.propertyChanges).toEqual([]);
    });

    it('should support all EntityChangeType values', () => {
      const createChange: EntityChangeDto = {
        id: 'c1',
        auditLogId: 'log-1',
        changeTime: '2024-01-15T10:30:00Z',
        changeType: EntityChangeType.Created,
        entityId: 'e1',
        entityTypeFullName: 'User',
        propertyChanges: [],
      };

      const updateChange: EntityChangeDto = {
        id: 'c2',
        auditLogId: 'log-1',
        changeTime: '2024-01-15T10:30:00Z',
        changeType: EntityChangeType.Updated,
        entityId: 'e1',
        entityTypeFullName: 'User',
        propertyChanges: [],
      };

      const deleteChange: EntityChangeDto = {
        id: 'c3',
        auditLogId: 'log-1',
        changeTime: '2024-01-15T10:30:00Z',
        changeType: EntityChangeType.Deleted,
        entityId: 'e1',
        entityTypeFullName: 'User',
        propertyChanges: [],
      };

      expect(createChange.changeType).toBe(0);
      expect(updateChange.changeType).toBe(1);
      expect(deleteChange.changeType).toBe(2);
    });

    it('should allow optional properties', () => {
      const entityChange: EntityChangeDto = {
        id: 'change-1',
        auditLogId: 'log-1',
        changeTime: '2024-01-15T10:30:00Z',
        changeType: EntityChangeType.Updated,
        entityId: 'entity-1',
        entityTypeFullName: 'MyApp.Domain.User',
        propertyChanges: [],
        tenantId: 'tenant-1',
        extraProperties: { source: 'api' },
      };

      expect(entityChange.tenantId).toBe('tenant-1');
      expect(entityChange.extraProperties).toEqual({ source: 'api' });
    });

    it('should support nested property changes', () => {
      const entityChange: EntityChangeDto = {
        id: 'change-1',
        auditLogId: 'log-1',
        changeTime: '2024-01-15T10:30:00Z',
        changeType: EntityChangeType.Updated,
        entityId: 'entity-1',
        entityTypeFullName: 'MyApp.Domain.User',
        propertyChanges: [
          {
            id: 'prop-1',
            entityChangeId: 'change-1',
            propertyName: 'Name',
            propertyTypeFullName: 'System.String',
            originalValue: '"Old"',
            newValue: '"New"',
          },
          {
            id: 'prop-2',
            entityChangeId: 'change-1',
            propertyName: 'Age',
            propertyTypeFullName: 'System.Int32',
            originalValue: '25',
            newValue: '26',
          },
        ],
      };

      expect(entityChange.propertyChanges).toHaveLength(2);
      expect(entityChange.propertyChanges[0].propertyName).toBe('Name');
      expect(entityChange.propertyChanges[1].propertyName).toBe('Age');
    });
  });

  describe('EntityChangeWithUsernameDto', () => {
    it('should allow creating a valid entity change with username DTO', () => {
      const dto: EntityChangeWithUsernameDto = {
        entityChange: {
          id: 'change-1',
          auditLogId: 'log-1',
          changeTime: '2024-01-15T10:30:00Z',
          changeType: EntityChangeType.Created,
          entityId: 'entity-1',
          entityTypeFullName: 'MyApp.Domain.User',
          propertyChanges: [],
        },
        userName: 'admin',
      };

      expect(dto.userName).toBe('admin');
      expect(dto.entityChange.id).toBe('change-1');
      expect(dto.entityChange.changeType).toBe(EntityChangeType.Created);
    });
  });

  describe('EntityChangeFilter', () => {
    it('should allow creating a valid entity change filter', () => {
      const filter: EntityChangeFilter = {
        entityId: 'entity-123',
        entityTypeFullName: 'MyApp.Domain.User',
      };

      expect(filter.entityId).toBe('entity-123');
      expect(filter.entityTypeFullName).toBe('MyApp.Domain.User');
    });
  });

  describe('AuditLogDto', () => {
    it('should allow creating a valid audit log DTO', () => {
      const auditLog: AuditLogDto = {
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

      expect(auditLog.id).toBe('log-1');
      expect(auditLog.userName).toBe('admin');
      expect(auditLog.executionTime).toBe('2024-01-15T10:30:00Z');
      expect(auditLog.executionDuration).toBe(250);
      expect(auditLog.clientIpAddress).toBe('192.168.1.1');
      expect(auditLog.httpMethod).toBe('POST');
      expect(auditLog.url).toBe('/api/users');
      expect(auditLog.applicationName).toBe('MyApp');
      expect(auditLog.correlationId).toBe('corr-123');
    });

    it('should allow optional properties', () => {
      const auditLog: AuditLogDto = {
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
        comments: 'Test comment',
        applicationName: 'MyApp',
        correlationId: 'corr-123',
        entityChanges: [],
        actions: [],
        userId: 'user-123',
        tenantId: 'tenant-1',
        impersonatorUserId: 'admin-1',
        impersonatorTenantId: 'admin-tenant',
        httpStatusCode: 200,
        extraProperties: { key: 'value' },
      };

      expect(auditLog.userId).toBe('user-123');
      expect(auditLog.tenantId).toBe('tenant-1');
      expect(auditLog.impersonatorUserId).toBe('admin-1');
      expect(auditLog.impersonatorTenantId).toBe('admin-tenant');
      expect(auditLog.httpStatusCode).toBe(200);
      expect(auditLog.extraProperties).toEqual({ key: 'value' });
    });

    it('should support nested entity changes and actions', () => {
      const auditLog: AuditLogDto = {
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
        entityChanges: [
          {
            id: 'change-1',
            auditLogId: 'log-1',
            changeTime: '2024-01-15T10:30:00Z',
            changeType: EntityChangeType.Created,
            entityId: 'user-1',
            entityTypeFullName: 'User',
            propertyChanges: [],
          },
        ],
        actions: [
          {
            id: 'action-1',
            auditLogId: 'log-1',
            serviceName: 'UserService',
            methodName: 'CreateAsync',
            parameters: '{}',
            executionTime: '2024-01-15T10:30:00Z',
            executionDuration: 100,
          },
        ],
      };

      expect(auditLog.entityChanges).toHaveLength(1);
      expect(auditLog.actions).toHaveLength(1);
      expect(auditLog.entityChanges[0].changeType).toBe(EntityChangeType.Created);
      expect(auditLog.actions[0].serviceName).toBe('UserService');
    });
  });

  describe('GetAuditLogListDto', () => {
    it('should allow creating an empty filter (all optional)', () => {
      const filter: GetAuditLogListDto = {};
      expect(filter).toEqual({});
    });

    it('should allow all filter properties', () => {
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
        maxResultCount: 10,
      };

      expect(filter.url).toBe('/api/users');
      expect(filter.userName).toBe('admin');
      expect(filter.applicationName).toBe('MyApp');
      expect(filter.correlationId).toBe('corr-123');
      expect(filter.httpMethod).toBe('POST');
      expect(filter.httpStatusCode).toBe(200);
      expect(filter.maxExecutionDuration).toBe(1000);
      expect(filter.minExecutionDuration).toBe(100);
      expect(filter.hasException).toBe(false);
      expect(filter.sorting).toBe('executionTime desc');
      expect(filter.skipCount).toBe(0);
      expect(filter.maxResultCount).toBe(10);
    });

    it('should allow partial filters', () => {
      const filter: GetAuditLogListDto = {
        userName: 'admin',
        hasException: true,
      };

      expect(filter.userName).toBe('admin');
      expect(filter.hasException).toBe(true);
      expect(filter.url).toBeUndefined();
    });
  });

  describe('GetEntityChangesDto', () => {
    it('should allow creating an empty filter (all optional)', () => {
      const filter: GetEntityChangesDto = {};
      expect(filter).toEqual({});
    });

    it('should allow all filter properties', () => {
      const filter: GetEntityChangesDto = {
        auditLogId: 'log-1',
        entityChangeType: EntityChangeType.Updated,
        entityId: 'entity-1',
        entityTypeFullName: 'User',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        sorting: 'changeTime desc',
        skipCount: 0,
        maxResultCount: 20,
      };

      expect(filter.auditLogId).toBe('log-1');
      expect(filter.entityChangeType).toBe(EntityChangeType.Updated);
      expect(filter.entityId).toBe('entity-1');
      expect(filter.entityTypeFullName).toBe('User');
      expect(filter.startDate).toBe('2024-01-01T00:00:00Z');
      expect(filter.endDate).toBe('2024-01-31T23:59:59Z');
      expect(filter.sorting).toBe('changeTime desc');
      expect(filter.skipCount).toBe(0);
      expect(filter.maxResultCount).toBe(20);
    });
  });

  describe('GetAverageExecutionDurationPerDayInput', () => {
    it('should require start and end dates', () => {
      const input: GetAverageExecutionDurationPerDayInput = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      expect(input.startDate).toBe('2024-01-01');
      expect(input.endDate).toBe('2024-01-31');
    });
  });

  describe('GetAverageExecutionDurationPerDayOutput', () => {
    it('should have data as Record<string, number>', () => {
      const output: GetAverageExecutionDurationPerDayOutput = {
        data: {
          '2024-01-01': 150,
          '2024-01-02': 200,
          '2024-01-03': 175,
        },
      };

      expect(output.data['2024-01-01']).toBe(150);
      expect(output.data['2024-01-02']).toBe(200);
      expect(output.data['2024-01-03']).toBe(175);
      expect(Object.keys(output.data)).toHaveLength(3);
    });

    it('should allow empty data', () => {
      const output: GetAverageExecutionDurationPerDayOutput = {
        data: {},
      };

      expect(output.data).toEqual({});
    });
  });

  describe('GetErrorRateFilter', () => {
    it('should require start and end dates', () => {
      const filter: GetErrorRateFilter = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      expect(filter.startDate).toBe('2024-01-01');
      expect(filter.endDate).toBe('2024-01-31');
    });
  });

  describe('GetErrorRateOutput', () => {
    it('should have data as Record<string, number>', () => {
      const output: GetErrorRateOutput = {
        data: {
          '2024-01-01': 5,
          '2024-01-02': 3,
          '2024-01-03': 0,
        },
      };

      expect(output.data['2024-01-01']).toBe(5);
      expect(output.data['2024-01-02']).toBe(3);
      expect(output.data['2024-01-03']).toBe(0);
    });

    it('should allow empty data', () => {
      const output: GetErrorRateOutput = {
        data: {},
      };

      expect(output.data).toEqual({});
    });
  });
});
