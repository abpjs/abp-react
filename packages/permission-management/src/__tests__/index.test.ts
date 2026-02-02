import { describe, it, expect } from 'vitest';

/**
 * Tests for @abpjs/permission-management package exports
 */
describe('@abpjs/permission-management package exports', () => {
  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export ePermissionManagementComponents from package root', async () => {
      const { ePermissionManagementComponents } = await import('../index');
      expect(ePermissionManagementComponents).toBeDefined();
      expect(ePermissionManagementComponents.PermissionManagement).toBe(
        'PermissionManagement.PermissionManagementComponent'
      );
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export PermissionManagement namespace (type-only, verified by compilation)', async () => {
      // PermissionManagement namespace contains interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      const module = await import('../index');
      expect(module).toBeDefined();
    });
  });

  // Service exports
  describe('Service exports', () => {
    it('should export PermissionManagementService', async () => {
      const { PermissionManagementService } = await import('../index');
      expect(PermissionManagementService).toBeDefined();
    });

    it('should export PermissionManagementStateService', async () => {
      const { PermissionManagementStateService } = await import('../index');
      expect(PermissionManagementStateService).toBeDefined();
    });
  });

  // Hook exports
  describe('Hook exports', () => {
    it('should export usePermissionManagement', async () => {
      const { usePermissionManagement } = await import('../index');
      expect(usePermissionManagement).toBeDefined();
    });
  });

  // Component exports
  describe('Component exports', () => {
    it('should export PermissionManagementModal', async () => {
      const { PermissionManagementModal } = await import('../index');
      expect(PermissionManagementModal).toBeDefined();
    });
  });

  // Verify all major exports are present
  describe('All exports verification', () => {
    it('should export all v2.7.0 functionality', async () => {
      const module = await import('../index');

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

    it('should have ePermissionManagementComponents with correct structure', async () => {
      const { ePermissionManagementComponents } = await import('../index');

      // Verify enum structure
      expect(typeof ePermissionManagementComponents).toBe('object');
      expect(Object.keys(ePermissionManagementComponents)).toHaveLength(1);
      expect(ePermissionManagementComponents.PermissionManagement).toMatch(
        /^PermissionManagement\.\w+Component$/
      );
    });
  });
});
