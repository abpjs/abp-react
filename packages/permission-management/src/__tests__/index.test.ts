import { describe, it, expect } from 'vitest';
import * as permissionManagementModule from '../index';

/**
 * Tests for @abpjs/permission-management package exports
 * Uses static import to avoid slow dynamic imports during test execution.
 */
describe('@abpjs/permission-management package exports', () => {
  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export ePermissionManagementComponents from package root', () => {
      const { ePermissionManagementComponents } = permissionManagementModule;
      expect(ePermissionManagementComponents).toBeDefined();
      expect(ePermissionManagementComponents.PermissionManagement).toBe(
        'PermissionManagement.PermissionManagementComponent'
      );
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export PermissionManagement namespace (type-only, verified by compilation)', () => {
      // PermissionManagement namespace contains interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      expect(permissionManagementModule).toBeDefined();
    });
  });

  // Service exports
  describe('Service exports', () => {
    it('should export PermissionManagementService', () => {
      const { PermissionManagementService } = permissionManagementModule;
      expect(PermissionManagementService).toBeDefined();
    });

    it('should export PermissionManagementStateService', () => {
      const { PermissionManagementStateService } = permissionManagementModule;
      expect(PermissionManagementStateService).toBeDefined();
    });
  });

  // Hook exports
  describe('Hook exports', () => {
    it('should export usePermissionManagement', () => {
      const { usePermissionManagement } = permissionManagementModule;
      expect(usePermissionManagement).toBeDefined();
    });
  });

  // Component exports
  describe('Component exports', () => {
    it('should export PermissionManagementModal', () => {
      const { PermissionManagementModal } = permissionManagementModule;
      expect(PermissionManagementModal).toBeDefined();
    });
  });

  // Verify all major exports are present
  describe('All exports verification', () => {
    it('should export all v2.7.0 functionality', () => {
      const module = permissionManagementModule;

      // Enums (v2.7.0)
      expect(module.ePermissionManagementComponents).toBeDefined();

      // Services
      expect(module.PermissionManagementService).toBeDefined();
      expect(module.PermissionManagementStateService).toBeDefined();

      // Hooks
      expect(module.usePermissionManagement).toBeDefined();

      // Components
      expect(module.PermissionManagementModal).toBeDefined();
    });

    it('should have ePermissionManagementComponents with correct structure', () => {
      const { ePermissionManagementComponents } = permissionManagementModule;

      // Verify enum structure
      expect(typeof ePermissionManagementComponents).toBe('object');
      expect(Object.keys(ePermissionManagementComponents)).toHaveLength(1);
      expect(ePermissionManagementComponents.PermissionManagement).toMatch(
        /^PermissionManagement\.\w+Component$/
      );
    });
  });
});
