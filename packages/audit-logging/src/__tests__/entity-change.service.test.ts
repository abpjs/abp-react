/**
 * Tests for EntityChangeService
 * @abpjs/audit-logging v2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EntityChangeService } from '../services';
import type { EntityChange } from '../models';
import { eEntityChangeType } from '../enums';

describe('EntityChangeService (v2.7.0)', () => {
  let mockRequest: ReturnType<typeof vi.fn>;
  let service: EntityChangeService;

  beforeEach(() => {
    mockRequest = vi.fn();
    const mockRestService = { request: mockRequest };
    service = new EntityChangeService(mockRestService as any);
  });

  describe('apiName property', () => {
    it('should have apiName property set to default', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      service.apiName = 'custom-api';
      expect(service.apiName).toBe('custom-api');
    });
  });

  describe('auditLogsUrl property', () => {
    it('should have correct base URL', () => {
      expect(service.auditLogsUrl).toBe('/api/audit-logging/audit-logs');
    });

    it('should allow auditLogsUrl to be modified', () => {
      service.auditLogsUrl = '/custom/audit-logs';
      expect(service.auditLogsUrl).toBe('/custom/audit-logs');
    });
  });

  describe('getEntityChanges', () => {
    it('should call request with correct URL and method', async () => {
      const mockResponse: EntityChange.Response = {
        items: [],
        totalCount: 0,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      await service.getEntityChanges();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes',
        params: {},
      });
    });

    it('should pass query params to request', async () => {
      const mockResponse: EntityChange.Response = {
        items: [],
        totalCount: 0,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: EntityChange.EntityChangesQueryParams = {
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        entityChangeType: eEntityChangeType.Updated,
        maxResultCount: 10,
      };

      await service.getEntityChanges(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes',
        params,
      });
    });

    it('should pass date range params to request', async () => {
      const mockResponse: EntityChange.Response = {
        items: [],
        totalCount: 0,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params: EntityChange.EntityChangesQueryParams = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      await service.getEntityChanges(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes',
        params,
      });
    });

    it('should return the response', async () => {
      const mockResponse: EntityChange.Response = {
        items: [
          {
            id: 'change-1',
            auditLogId: 'audit-1',
            tenantId: null,
            changeTime: '2024-01-01T00:00:00Z',
            changeType: eEntityChangeType.Created,
            entityId: 'entity-1',
            entityTypeFullName: 'MyApp.Domain.Entities.User',
            propertyChanges: [],
            extraProperties: {},
          },
        ],
        totalCount: 1,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.getEntityChanges();

      expect(result).toEqual(mockResponse);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].changeType).toBe(eEntityChangeType.Created);
    });
  });

  describe('getEntityChangeById', () => {
    it('should call request with correct URL', async () => {
      const mockItem: EntityChange.Item = {
        id: 'change-123',
        auditLogId: 'audit-456',
        tenantId: null,
        changeTime: '2024-01-01T00:00:00Z',
        changeType: eEntityChangeType.Updated,
        entityId: 'entity-789',
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        propertyChanges: [],
        extraProperties: {},
      };
      mockRequest.mockResolvedValueOnce(mockItem);

      await service.getEntityChangeById('change-123');

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes/change-123',
      });
    });

    it('should return the entity change', async () => {
      const mockItem: EntityChange.Item = {
        id: 'change-123',
        auditLogId: 'audit-456',
        tenantId: 'tenant-111',
        changeTime: '2024-01-01T00:00:00Z',
        changeType: eEntityChangeType.Deleted,
        entityId: 'entity-789',
        entityTypeFullName: 'MyApp.Domain.Entities.Product',
        propertyChanges: [
          {
            id: 'prop-1',
            tenantId: 'tenant-111',
            entityChangeId: 'change-123',
            propertyName: 'Price',
            propertyTypeFullName: 'System.Decimal',
            originalValue: '100.00',
            newValue: '150.00',
          },
        ],
        extraProperties: {},
      };
      mockRequest.mockResolvedValueOnce(mockItem);

      const result = await service.getEntityChangeById('change-123');

      expect(result).toEqual(mockItem);
      expect(result.propertyChanges).toHaveLength(1);
      expect(result.propertyChanges[0].propertyName).toBe('Price');
    });
  });

  describe('getEntityChangesWithUserName', () => {
    it('should call request with correct URL and params', async () => {
      const mockResponse: EntityChange.ItemWithUserName[] = [];
      mockRequest.mockResolvedValueOnce(mockResponse);

      await service.getEntityChangesWithUserName(
        'entity-123',
        'MyApp.Domain.Entities.User'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-changes-with-username',
        params: {
          entityId: 'entity-123',
          entityTypeFullName: 'MyApp.Domain.Entities.User',
        },
      });
    });

    it('should return entity changes with user names', async () => {
      const mockResponse: EntityChange.ItemWithUserName[] = [
        {
          entityChange: {
            id: 'change-1',
            auditLogId: 'audit-1',
            tenantId: null,
            changeTime: '2024-01-01T00:00:00Z',
            changeType: eEntityChangeType.Created,
            entityId: 'entity-123',
            entityTypeFullName: 'MyApp.Domain.Entities.User',
            propertyChanges: [],
            extraProperties: {},
          },
          userName: 'admin',
        },
        {
          entityChange: {
            id: 'change-2',
            auditLogId: 'audit-2',
            tenantId: null,
            changeTime: '2024-01-02T00:00:00Z',
            changeType: eEntityChangeType.Updated,
            entityId: 'entity-123',
            entityTypeFullName: 'MyApp.Domain.Entities.User',
            propertyChanges: [],
            extraProperties: {},
          },
          userName: 'moderator',
        },
      ];
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.getEntityChangesWithUserName(
        'entity-123',
        'MyApp.Domain.Entities.User'
      );

      expect(result).toHaveLength(2);
      expect(result[0].userName).toBe('admin');
      expect(result[1].userName).toBe('moderator');
    });

    it('should return empty array when no changes exist', async () => {
      const mockResponse: EntityChange.ItemWithUserName[] = [];
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.getEntityChangesWithUserName(
        'nonexistent-entity',
        'MyApp.Domain.Entities.User'
      );

      expect(result).toHaveLength(0);
    });
  });

  describe('getEntityChangeWithUserNameById', () => {
    it('should call request with correct URL', async () => {
      const mockResponse: EntityChange.ItemWithUserName = {
        entityChange: {
          id: 'change-123',
          auditLogId: 'audit-456',
          tenantId: null,
          changeTime: '2024-01-01T00:00:00Z',
          changeType: eEntityChangeType.Created,
          entityId: 'entity-789',
          entityTypeFullName: 'MyApp.Domain.Entities.User',
          propertyChanges: [],
          extraProperties: {},
        },
        userName: 'admin',
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      await service.getEntityChangeWithUserNameById('change-123');

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/audit-logging/audit-logs/entity-change-with-username/change-123',
      });
    });

    it('should return entity change with user name', async () => {
      const mockResponse: EntityChange.ItemWithUserName = {
        entityChange: {
          id: 'change-123',
          auditLogId: 'audit-456',
          tenantId: null,
          changeTime: '2024-01-01T00:00:00Z',
          changeType: eEntityChangeType.Updated,
          entityId: 'entity-789',
          entityTypeFullName: 'MyApp.Domain.Entities.Order',
          propertyChanges: [
            {
              id: 'prop-1',
              tenantId: null,
              entityChangeId: 'change-123',
              propertyName: 'Status',
              propertyTypeFullName: 'System.String',
              originalValue: 'Pending',
              newValue: 'Completed',
            },
          ],
          extraProperties: {},
        },
        userName: 'system-user',
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.getEntityChangeWithUserNameById('change-123');

      expect(result.userName).toBe('system-user');
      expect(result.entityChange.changeType).toBe(eEntityChangeType.Updated);
      expect(result.entityChange.propertyChanges[0].newValue).toBe('Completed');
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getEntityChanges', async () => {
      const error = new Error('Network error');
      mockRequest.mockRejectedValueOnce(error);

      await expect(service.getEntityChanges()).rejects.toThrow('Network error');
    });

    it('should propagate errors from getEntityChangeById', async () => {
      const error = new Error('Not found');
      mockRequest.mockRejectedValueOnce(error);

      await expect(service.getEntityChangeById('invalid-id')).rejects.toThrow(
        'Not found'
      );
    });

    it('should propagate errors from getEntityChangesWithUserName', async () => {
      const error = new Error('Unauthorized');
      mockRequest.mockRejectedValueOnce(error);

      await expect(
        service.getEntityChangesWithUserName('entity-123', 'Type')
      ).rejects.toThrow('Unauthorized');
    });

    it('should propagate errors from getEntityChangeWithUserNameById', async () => {
      const error = new Error('Server error');
      mockRequest.mockRejectedValueOnce(error);

      await expect(
        service.getEntityChangeWithUserNameById('change-123')
      ).rejects.toThrow('Server error');
    });
  });
});
