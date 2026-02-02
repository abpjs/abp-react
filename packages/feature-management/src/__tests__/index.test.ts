import { describe, it, expect } from 'vitest';

/**
 * Tests for @abpjs/feature-management package exports
 */
describe('@abpjs/feature-management package exports', () => {
  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export eFeatureManagementComponents from package root', async () => {
      const { eFeatureManagementComponents } = await import('../index');
      expect(eFeatureManagementComponents).toBeDefined();
      expect(eFeatureManagementComponents.FeatureManagement).toBe(
        'FeatureManagement.FeatureManagementComponent'
      );
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export model types (type-only, verified by compilation)', async () => {
      // FeatureManagement namespace contains interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      const module = await import('../index');
      expect(module).toBeDefined();
    });
  });

  // Service exports
  describe('Service exports', () => {
    it('should export FeatureManagementService', async () => {
      const { FeatureManagementService } = await import('../index');
      expect(FeatureManagementService).toBeDefined();
    });
  });

  // Hook exports
  describe('Hook exports', () => {
    it('should export useFeatureManagement', async () => {
      const { useFeatureManagement } = await import('../index');
      expect(useFeatureManagement).toBeDefined();
    });

  });

  // Component exports
  describe('Component exports', () => {
    it('should export FeatureManagementModal', async () => {
      const { FeatureManagementModal } = await import('../index');
      expect(FeatureManagementModal).toBeDefined();
    });
  });
});
