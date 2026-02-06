import { describe, it, expect } from 'vitest';
import * as featureManagementModule from '../index';

/**
 * Tests for @abpjs/feature-management package exports
 * Uses static import to avoid slow dynamic imports during test execution.
 *
 * @updated 3.0.0 - No new exports; Angular visible getter/setter change doesn't affect React
 */
describe('@abpjs/feature-management package exports', () => {
  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export eFeatureManagementComponents from package root', () => {
      const { eFeatureManagementComponents } = featureManagementModule;
      expect(eFeatureManagementComponents).toBeDefined();
      expect(eFeatureManagementComponents.FeatureManagement).toBe(
        'FeatureManagement.FeatureManagementComponent'
      );
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export model types (type-only, verified by compilation)', () => {
      // FeatureManagement namespace contains interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      expect(featureManagementModule).toBeDefined();
    });
  });

  // Service exports
  describe('Service exports', () => {
    it('should export FeatureManagementService', () => {
      const { FeatureManagementService } = featureManagementModule;
      expect(FeatureManagementService).toBeDefined();
    });
  });

  // Hook exports
  describe('Hook exports', () => {
    it('should export useFeatureManagement', () => {
      const { useFeatureManagement } = featureManagementModule;
      expect(useFeatureManagement).toBeDefined();
    });
  });

  // Component exports
  describe('Component exports', () => {
    it('should export FeatureManagementModal', () => {
      const { FeatureManagementModal } = featureManagementModule;
      expect(FeatureManagementModal).toBeDefined();
    });
  });
});
