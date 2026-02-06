/**
 * Tests for config/providers/entity-history.provider
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  bindShowHistory,
  ENTITY_HISTORY_PROVIDERS,
  EntityChangeModalService,
} from '../../../config/providers/entity-history.provider';
import { SHOW_ENTITY_HISTORY } from '../../../tokens/entity-details.token';

describe('entity-history.provider (v3.0.0)', () => {
  let mockService: any;

  beforeEach(() => {
    mockService = {
      showDetails: vi.fn(),
      showHistory: vi.fn(),
      onShowDetails: vi.fn(),
      onShowHistory: vi.fn(),
      detectChanges: vi.fn(),
    };
  });

  describe('bindShowHistory', () => {
    it('should return a function', () => {
      const result = bindShowHistory(mockService);
      expect(typeof result).toBe('function');
    });

    it('should call service.showHistory when invoked', () => {
      const showHistoryFn = bindShowHistory(mockService);
      const entityId = 'test-entity-id';
      const entityTypeFullName = 'MyApp.Entities.User';

      showHistoryFn(entityId, entityTypeFullName);

      expect(mockService.showHistory).toHaveBeenCalledWith(entityId, entityTypeFullName);
    });

    it('should call service.showHistory with correct parameters', () => {
      const showHistoryFn = bindShowHistory(mockService);

      showHistoryFn('entity-123', 'MyApp.Domain.Product');

      expect(mockService.showHistory).toHaveBeenCalledWith(
        'entity-123',
        'MyApp.Domain.Product'
      );
    });

    it('should handle multiple calls', () => {
      const showHistoryFn = bindShowHistory(mockService);

      showHistoryFn('id1', 'Type1');
      showHistoryFn('id2', 'Type2');

      expect(mockService.showHistory).toHaveBeenCalledTimes(2);
      expect(mockService.showHistory).toHaveBeenNthCalledWith(1, 'id1', 'Type1');
      expect(mockService.showHistory).toHaveBeenNthCalledWith(2, 'id2', 'Type2');
    });

    it('should handle empty entity type full name', () => {
      const showHistoryFn = bindShowHistory(mockService);

      showHistoryFn('entity-id', '');

      expect(mockService.showHistory).toHaveBeenCalledWith('entity-id', '');
    });
  });

  describe('ENTITY_HISTORY_PROVIDERS', () => {
    it('should have provide property set to SHOW_ENTITY_HISTORY', () => {
      expect(ENTITY_HISTORY_PROVIDERS.provide).toBe(SHOW_ENTITY_HISTORY);
    });

    it('should have useFactory property set to bindShowHistory', () => {
      expect(ENTITY_HISTORY_PROVIDERS.useFactory).toBe(bindShowHistory);
    });

    it('should have deps property with EntityChangeModalService', () => {
      expect(ENTITY_HISTORY_PROVIDERS.deps).toContain(EntityChangeModalService);
    });

    it('should have all required properties for provider configuration', () => {
      expect(ENTITY_HISTORY_PROVIDERS).toHaveProperty('provide');
      expect(ENTITY_HISTORY_PROVIDERS).toHaveProperty('useFactory');
      expect(ENTITY_HISTORY_PROVIDERS).toHaveProperty('deps');
    });
  });

  describe('EntityChangeModalService export', () => {
    it('should export EntityChangeModalService', () => {
      expect(EntityChangeModalService).toBeDefined();
    });
  });
});
