/**
 * Tests for config/providers/entity-details.provider
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  bindShowDetails,
  ENTITY_DETAILS_PROVIDERS,
  EntityChangeModalService,
} from '../../../config/providers/entity-details.provider';
import { SHOW_ENTITY_DETAILS } from '../../../tokens/entity-details.token';

describe('entity-details.provider (v3.0.0)', () => {
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

  describe('bindShowDetails', () => {
    it('should return a function', () => {
      const result = bindShowDetails(mockService);
      expect(typeof result).toBe('function');
    });

    it('should call service.showDetails when invoked', () => {
      const showDetailsFn = bindShowDetails(mockService);
      const entityChangeId = 'test-entity-change-id';

      showDetailsFn(entityChangeId);

      expect(mockService.showDetails).toHaveBeenCalledWith(entityChangeId);
    });

    it('should call service.showDetails with the correct entity change ID', () => {
      const showDetailsFn = bindShowDetails(mockService);
      const entityChangeId = 'abc123';

      showDetailsFn(entityChangeId);

      expect(mockService.showDetails).toHaveBeenCalledWith('abc123');
    });

    it('should handle multiple calls', () => {
      const showDetailsFn = bindShowDetails(mockService);

      showDetailsFn('id1');
      showDetailsFn('id2');
      showDetailsFn('id3');

      expect(mockService.showDetails).toHaveBeenCalledTimes(3);
      expect(mockService.showDetails).toHaveBeenNthCalledWith(1, 'id1');
      expect(mockService.showDetails).toHaveBeenNthCalledWith(2, 'id2');
      expect(mockService.showDetails).toHaveBeenNthCalledWith(3, 'id3');
    });
  });

  describe('ENTITY_DETAILS_PROVIDERS', () => {
    it('should have provide property set to SHOW_ENTITY_DETAILS', () => {
      expect(ENTITY_DETAILS_PROVIDERS.provide).toBe(SHOW_ENTITY_DETAILS);
    });

    it('should have useFactory property set to bindShowDetails', () => {
      expect(ENTITY_DETAILS_PROVIDERS.useFactory).toBe(bindShowDetails);
    });

    it('should have deps property with EntityChangeModalService', () => {
      expect(ENTITY_DETAILS_PROVIDERS.deps).toContain(EntityChangeModalService);
    });

    it('should have all required properties for provider configuration', () => {
      expect(ENTITY_DETAILS_PROVIDERS).toHaveProperty('provide');
      expect(ENTITY_DETAILS_PROVIDERS).toHaveProperty('useFactory');
      expect(ENTITY_DETAILS_PROVIDERS).toHaveProperty('deps');
    });
  });

  describe('EntityChangeModalService export', () => {
    it('should export EntityChangeModalService', () => {
      expect(EntityChangeModalService).toBeDefined();
    });

    it('should be a class/constructor', () => {
      expect(typeof EntityChangeModalService).toBe('function');
    });
  });
});
