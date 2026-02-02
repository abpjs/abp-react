/**
 * Tests for EntityChange models
 * @abpjs/audit-logging v2.7.0
 */
import { describe, it, expect } from 'vitest';
import type { EntityChange } from '../../models/entity-change';
import { eEntityChangeType } from '../../enums/entity-change';

describe('EntityChange models (v2.7.0)', () => {
  describe('EntityChange.Item', () => {
    it('should allow creating a valid entity change item', () => {
      const item: EntityChange.Item = {
        id: 'change-123',
        auditLogId: 'audit-456',
        tenantId: 'tenant-789',
        changeTime: '2024-01-01T00:00:00Z',
        changeType: eEntityChangeType.Created,
        entityId: 'entity-111',
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        propertyChanges: [],
        extraProperties: {},
      };

      expect(item.id).toBe('change-123');
      expect(item.changeType).toBe(eEntityChangeType.Created);
      expect(item.entityTypeFullName).toBe('MyApp.Domain.Entities.User');
    });

    it('should allow null tenantId', () => {
      const item: EntityChange.Item = {
        id: 'change-123',
        auditLogId: 'audit-456',
        tenantId: null,
        changeTime: '2024-01-01T00:00:00Z',
        changeType: eEntityChangeType.Updated,
        entityId: 'entity-111',
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        propertyChanges: [],
        extraProperties: {},
      };

      expect(item.tenantId).toBeNull();
    });

    it('should allow property changes', () => {
      const item: EntityChange.Item = {
        id: 'change-123',
        auditLogId: 'audit-456',
        tenantId: null,
        changeTime: '2024-01-01T00:00:00Z',
        changeType: eEntityChangeType.Updated,
        entityId: 'entity-111',
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        propertyChanges: [
          {
            id: 'prop-1',
            tenantId: null,
            entityChangeId: 'change-123',
            propertyName: 'Name',
            propertyTypeFullName: 'System.String',
            originalValue: 'Old Name',
            newValue: 'New Name',
          },
        ],
        extraProperties: {},
      };

      expect(item.propertyChanges).toHaveLength(1);
      expect(item.propertyChanges[0].propertyName).toBe('Name');
    });

    it('should allow extra properties', () => {
      const item: EntityChange.Item = {
        id: 'change-123',
        auditLogId: 'audit-456',
        tenantId: null,
        changeTime: '2024-01-01T00:00:00Z',
        changeType: eEntityChangeType.Deleted,
        entityId: 'entity-111',
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        propertyChanges: [],
        extraProperties: {
          customField: 'custom value',
          numericField: 42,
        },
      };

      expect(item.extraProperties.customField).toBe('custom value');
      expect(item.extraProperties.numericField).toBe(42);
    });
  });

  describe('EntityChange.PropertyChange', () => {
    it('should allow creating a valid property change', () => {
      const change: EntityChange.PropertyChange = {
        id: 'prop-123',
        tenantId: 'tenant-456',
        entityChangeId: 'change-789',
        propertyName: 'Email',
        propertyTypeFullName: 'System.String',
        originalValue: 'old@example.com',
        newValue: 'new@example.com',
      };

      expect(change.propertyName).toBe('Email');
      expect(change.originalValue).toBe('old@example.com');
      expect(change.newValue).toBe('new@example.com');
    });

    it('should allow null tenantId', () => {
      const change: EntityChange.PropertyChange = {
        id: 'prop-123',
        tenantId: null,
        entityChangeId: 'change-789',
        propertyName: 'IsActive',
        propertyTypeFullName: 'System.Boolean',
        originalValue: 'false',
        newValue: 'true',
      };

      expect(change.tenantId).toBeNull();
    });
  });

  describe('EntityChange.ItemWithUserName', () => {
    it('should allow creating item with username', () => {
      const itemWithUserName: EntityChange.ItemWithUserName = {
        entityChange: {
          id: 'change-123',
          auditLogId: 'audit-456',
          tenantId: null,
          changeTime: '2024-01-01T00:00:00Z',
          changeType: eEntityChangeType.Created,
          entityId: 'entity-111',
          entityTypeFullName: 'MyApp.Domain.Entities.User',
          propertyChanges: [],
          extraProperties: {},
        },
        userName: 'admin',
      };

      expect(itemWithUserName.userName).toBe('admin');
      expect(itemWithUserName.entityChange.id).toBe('change-123');
    });
  });

  describe('EntityChange.EntityChangesQueryParams', () => {
    it('should allow empty params', () => {
      const params: EntityChange.EntityChangesQueryParams = {};
      expect(params).toBeDefined();
    });

    it('should allow all optional params', () => {
      const params: EntityChange.EntityChangesQueryParams = {
        auditLogId: 'audit-123',
        entityChangeType: eEntityChangeType.Updated,
        entityId: 'entity-456',
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        maxResultCount: 10,
        skipCount: 0,
        sorting: 'changeTime desc',
      };

      expect(params.auditLogId).toBe('audit-123');
      expect(params.entityChangeType).toBe(eEntityChangeType.Updated);
      expect(params.maxResultCount).toBe(10);
    });

    it('should allow partial params for filtering by entity type', () => {
      const params: EntityChange.EntityChangesQueryParams = {
        entityTypeFullName: 'MyApp.Domain.Entities.User',
        maxResultCount: 50,
      };

      expect(params.entityTypeFullName).toBe('MyApp.Domain.Entities.User');
      expect(params.maxResultCount).toBe(50);
    });

    it('should allow filtering by change type', () => {
      const params: EntityChange.EntityChangesQueryParams = {
        entityChangeType: eEntityChangeType.Deleted,
      };

      expect(params.entityChangeType).toBe(eEntityChangeType.Deleted);
    });

    it('should allow date range filtering', () => {
      const params: EntityChange.EntityChangesQueryParams = {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
      };

      expect(params.startDate).toBe('2024-01-01T00:00:00Z');
      expect(params.endDate).toBe('2024-01-31T23:59:59Z');
    });
  });

  describe('EntityChange.Response', () => {
    it('should be a valid paged response structure', () => {
      const response: EntityChange.Response = {
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

      expect(response.items).toHaveLength(1);
      expect(response.totalCount).toBe(1);
    });

    it('should allow empty response', () => {
      const response: EntityChange.Response = {
        items: [],
        totalCount: 0,
      };

      expect(response.items).toHaveLength(0);
      expect(response.totalCount).toBe(0);
    });
  });

  describe('EntityChange.ExtraProperties', () => {
    it('should allow any key-value pairs', () => {
      const extra: EntityChange.ExtraProperties = {
        stringValue: 'test',
        numberValue: 123,
        booleanValue: true,
        nullValue: null,
        objectValue: { nested: 'value' },
        arrayValue: [1, 2, 3],
      };

      expect(extra.stringValue).toBe('test');
      expect(extra.numberValue).toBe(123);
      expect(extra.booleanValue).toBe(true);
    });
  });
});
