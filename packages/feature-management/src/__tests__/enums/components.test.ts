import { describe, it, expect } from 'vitest';
import { eFeatureManagementComponents } from '../../enums/components';

/**
 * Tests for eFeatureManagementComponents enum
 * @since 2.7.0
 */
describe('eFeatureManagementComponents', () => {
  describe('enum values', () => {
    it('should have FeatureManagement key with correct value', () => {
      expect(eFeatureManagementComponents.FeatureManagement).toBe(
        'FeatureManagement.FeatureManagementComponent'
      );
    });
  });

  describe('enum structure', () => {
    it('should be defined', () => {
      expect(eFeatureManagementComponents).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof eFeatureManagementComponents).toBe('object');
    });

    it('should have exactly 1 key', () => {
      const keys = Object.keys(eFeatureManagementComponents);
      expect(keys).toHaveLength(1);
    });

    it('should have FeatureManagement as the only key', () => {
      const keys = Object.keys(eFeatureManagementComponents);
      expect(keys).toContain('FeatureManagement');
    });
  });

  describe('type safety', () => {
    it('should have immutable values (as const)', () => {
      // TypeScript ensures this at compile time, but we can verify the value is a string literal
      const value: string = eFeatureManagementComponents.FeatureManagement;
      expect(value).toBe('FeatureManagement.FeatureManagementComponent');
    });

    it('should match the Angular naming convention', () => {
      // Angular uses format: ModuleName.ComponentName
      expect(eFeatureManagementComponents.FeatureManagement).toMatch(
        /^FeatureManagement\.\w+Component$/
      );
    });
  });

  describe('usage patterns', () => {
    it('should be usable as component replacement key', () => {
      const componentKey = eFeatureManagementComponents.FeatureManagement;
      expect(componentKey).toBeTruthy();
      expect(typeof componentKey).toBe('string');
    });

    it('should be usable in switch statements', () => {
      const key = 'FeatureManagement.FeatureManagementComponent';
      let matched = false;

      switch (key) {
        case eFeatureManagementComponents.FeatureManagement:
          matched = true;
          break;
      }

      expect(matched).toBe(true);
    });

    it('should be usable for equality checks', () => {
      const key = eFeatureManagementComponents.FeatureManagement;
      expect(key === 'FeatureManagement.FeatureManagementComponent').toBe(true);
    });
  });
});
