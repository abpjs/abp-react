import { describe, it, expect } from 'vitest';
import { ePermissionManagementComponents } from '../../enums/components';

/**
 * Tests for ePermissionManagementComponents enum
 * @since 2.7.0
 */
describe('ePermissionManagementComponents', () => {
  describe('enum values', () => {
    it('should have PermissionManagement key with correct value', () => {
      expect(ePermissionManagementComponents.PermissionManagement).toBe(
        'PermissionManagement.PermissionManagementComponent'
      );
    });
  });

  describe('enum structure', () => {
    it('should be defined', () => {
      expect(ePermissionManagementComponents).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof ePermissionManagementComponents).toBe('object');
    });

    it('should have exactly 1 key', () => {
      const keys = Object.keys(ePermissionManagementComponents);
      expect(keys).toHaveLength(1);
    });

    it('should have PermissionManagement as the only key', () => {
      const keys = Object.keys(ePermissionManagementComponents);
      expect(keys).toContain('PermissionManagement');
    });
  });

  describe('type safety', () => {
    it('should have immutable values (as const)', () => {
      // TypeScript ensures this at compile time, but we can verify the value is a string literal
      const value: string = ePermissionManagementComponents.PermissionManagement;
      expect(value).toBe('PermissionManagement.PermissionManagementComponent');
    });

    it('should match the Angular naming convention', () => {
      // Angular uses format: ModuleName.ComponentName
      expect(ePermissionManagementComponents.PermissionManagement).toMatch(
        /^PermissionManagement\.\w+Component$/
      );
    });
  });

  describe('usage patterns', () => {
    it('should be usable as component replacement key', () => {
      const componentKey = ePermissionManagementComponents.PermissionManagement;
      expect(componentKey).toBeTruthy();
      expect(typeof componentKey).toBe('string');
    });

    it('should be usable in switch statements', () => {
      const key = 'PermissionManagement.PermissionManagementComponent';
      let matched = false;

      switch (key) {
        case ePermissionManagementComponents.PermissionManagement:
          matched = true;
          break;
      }

      expect(matched).toBe(true);
    });

    it('should be usable for equality checks', () => {
      const key = ePermissionManagementComponents.PermissionManagement;
      expect(key === 'PermissionManagement.PermissionManagementComponent').toBe(true);
    });

    it('should be usable in component replacement registry', () => {
      // Simulate a component replacement registry
      const registry: Record<string, unknown> = {};
      const CustomComponent = () => null;

      registry[ePermissionManagementComponents.PermissionManagement] = CustomComponent;

      expect(registry['PermissionManagement.PermissionManagementComponent']).toBe(CustomComponent);
    });
  });
});
