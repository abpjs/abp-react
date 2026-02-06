/**
 * Tests for config/services/entity-change-modal.service
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EntityChangeModalService } from '../../../config/services/entity-change-modal.service';
import type { EntityChange } from '../../../models/entity-change';

describe('EntityChangeModalService (v3.0.0)', () => {
  let mockEntityChangeService: any;
  let service: EntityChangeModalService;

  const mockItemWithUserName: EntityChange.ItemWithUserName = {
    entityChange: {
      auditLogId: 'audit-log-1',
      tenantId: 'tenant-1',
      changeTime: '2024-01-01T00:00:00Z',
      changeType: 1,
      entityId: 'entity-1',
      entityTypeFullName: 'MyApp.Entity',
      propertyChanges: [],
      id: 'change-1',
      extraProperties: {},
    },
    userName: 'testuser',
  };

  const mockItemsWithUserName: EntityChange.ItemWithUserName[] = [
    mockItemWithUserName,
    {
      entityChange: {
        ...mockItemWithUserName.entityChange,
        id: 'change-2',
        changeType: 2,
      },
      userName: 'anotheruser',
    },
  ];

  beforeEach(() => {
    mockEntityChangeService = {
      getEntityChangeWithUserNameById: vi.fn().mockResolvedValue(mockItemWithUserName),
      getEntityChangesWithUserName: vi.fn().mockResolvedValue(mockItemsWithUserName),
      getEntityChangeById: vi.fn(),
      getEntityChanges: vi.fn(),
    };
    service = new EntityChangeModalService(mockEntityChangeService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with provided EntityChangeService', () => {
      expect(service).toBeInstanceOf(EntityChangeModalService);
    });
  });

  describe('onShowDetails', () => {
    it('should register a callback', () => {
      const callback = vi.fn();
      service.onShowDetails(callback);
      // Callback is registered, should not throw
      expect(() => service.onShowDetails(callback)).not.toThrow();
    });

    it('should allow replacing the callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      service.onShowDetails(callback1);
      service.onShowDetails(callback2);
      // No error should be thrown
      expect(true).toBe(true);
    });
  });

  describe('onShowHistory', () => {
    it('should register a callback', () => {
      const callback = vi.fn();
      service.onShowHistory(callback);
      expect(() => service.onShowHistory(callback)).not.toThrow();
    });
  });

  describe('showDetails', () => {
    it('should call getEntityChangeWithUserNameById with correct ID', async () => {
      const entityChangeId = 'test-change-id';
      await service.showDetails(entityChangeId);

      expect(mockEntityChangeService.getEntityChangeWithUserNameById).toHaveBeenCalledWith(
        entityChangeId
      );
    });

    it('should trigger registered callback with fetched data', async () => {
      const callback = vi.fn();
      service.onShowDetails(callback);

      await service.showDetails('change-1');

      expect(callback).toHaveBeenCalledWith(mockItemWithUserName);
    });

    it('should not throw if no callback is registered', async () => {
      await expect(service.showDetails('change-1')).resolves.not.toThrow();
    });

    it('should throw error if fetch fails', async () => {
      const error = new Error('Fetch failed');
      mockEntityChangeService.getEntityChangeWithUserNameById.mockRejectedValue(error);

      await expect(service.showDetails('change-1')).rejects.toThrow('Fetch failed');
    });

    it('should log error to console if fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Fetch failed');
      mockEntityChangeService.getEntityChangeWithUserNameById.mockRejectedValue(error);

      try {
        await service.showDetails('change-1');
      } catch {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('showHistory', () => {
    it('should call getEntityChangesWithUserName with correct parameters', async () => {
      const entityId = 'entity-1';
      const entityTypeFullName = 'MyApp.Domain.User';

      await service.showHistory(entityId, entityTypeFullName);

      expect(mockEntityChangeService.getEntityChangesWithUserName).toHaveBeenCalledWith(
        entityId,
        entityTypeFullName
      );
    });

    it('should trigger registered callback with fetched data', async () => {
      const callback = vi.fn();
      service.onShowHistory(callback);

      await service.showHistory('entity-1', 'MyApp.Entity');

      expect(callback).toHaveBeenCalledWith(mockItemsWithUserName);
    });

    it('should not throw if no callback is registered', async () => {
      await expect(service.showHistory('entity-1', 'MyApp.Entity')).resolves.not.toThrow();
    });

    it('should throw error if fetch fails', async () => {
      const error = new Error('History fetch failed');
      mockEntityChangeService.getEntityChangesWithUserName.mockRejectedValue(error);

      await expect(service.showHistory('entity-1', 'MyApp.Entity')).rejects.toThrow(
        'History fetch failed'
      );
    });

    it('should log error to console if fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('History fetch failed');
      mockEntityChangeService.getEntityChangesWithUserName.mockRejectedValue(error);

      try {
        await service.showHistory('entity-1', 'MyApp.Entity');
      } catch {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('detectChanges', () => {
    it('should not throw (no-op in React)', () => {
      expect(() => service.detectChanges()).not.toThrow();
    });

    it('should be callable multiple times', () => {
      service.detectChanges();
      service.detectChanges();
      service.detectChanges();
      expect(true).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should handle showing details followed by history', async () => {
      const detailsCallback = vi.fn();
      const historyCallback = vi.fn();
      service.onShowDetails(detailsCallback);
      service.onShowHistory(historyCallback);

      await service.showDetails('change-1');
      await service.showHistory('entity-1', 'MyApp.Entity');

      expect(detailsCallback).toHaveBeenCalledWith(mockItemWithUserName);
      expect(historyCallback).toHaveBeenCalledWith(mockItemsWithUserName);
    });
  });
});
