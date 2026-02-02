import { describe, it, expect } from 'vitest';

/**
 * Tests for @abpjs/identity package exports
 */
describe('@abpjs/identity package exports', () => {
  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export eIdentityComponents from package root', async () => {
      const { eIdentityComponents } = await import('../index');
      expect(eIdentityComponents).toBeDefined();
      expect(eIdentityComponents.Roles).toBe('Identity.RolesComponent');
      expect(eIdentityComponents.Users).toBe('Identity.UsersComponent');
    });

    it('should export eIdentityRouteNames from package root', async () => {
      const { eIdentityRouteNames } = await import('../index');
      expect(eIdentityRouteNames).toBeDefined();
      expect(eIdentityRouteNames.Administration).toBe('AbpUiNavigation::Menu:Administration');
      expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
      expect(eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export Identity namespace (type-only, verified by compilation)', async () => {
      // Identity namespace contains interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      const module = await import('../index');
      expect(module).toBeDefined();
    });
  });

  // Service exports
  describe('Service exports', () => {
    it('should export IdentityService', async () => {
      const { IdentityService } = await import('../index');
      expect(IdentityService).toBeDefined();
    });

    it('should export IdentityStateService', async () => {
      const { IdentityStateService } = await import('../index');
      expect(IdentityStateService).toBeDefined();
    });
  });

  // Hook exports
  describe('Hook exports', () => {
    it('should export useIdentity', async () => {
      const { useIdentity } = await import('../index');
      expect(useIdentity).toBeDefined();
    });

    it('should export useRoles', async () => {
      const { useRoles } = await import('../index');
      expect(useRoles).toBeDefined();
    });

    it('should export useUsers', async () => {
      const { useUsers } = await import('../index');
      expect(useUsers).toBeDefined();
    });
  });

  // Component exports
  describe('Component exports', () => {
    it('should export RolesComponent', async () => {
      const { RolesComponent } = await import('../index');
      expect(RolesComponent).toBeDefined();
    });

    it('should export UsersComponent', async () => {
      const { UsersComponent } = await import('../index');
      expect(UsersComponent).toBeDefined();
    });

    it('should export RolesComponent with componentKey (v2.7.0)', async () => {
      const { RolesComponent } = await import('../index');
      expect(RolesComponent.componentKey).toBe('Identity.RolesComponent');
    });

    it('should export UsersComponent with componentKey (v2.7.0)', async () => {
      const { UsersComponent } = await import('../index');
      expect(UsersComponent.componentKey).toBe('Identity.UsersComponent');
    });
  });

  // Constants exports
  describe('Constants exports', () => {
    it('should export IDENTITY_ROUTE_PATHS', async () => {
      const { IDENTITY_ROUTE_PATHS } = await import('../index');
      expect(IDENTITY_ROUTE_PATHS).toBeDefined();
    });
  });

  // Verify all major exports are present
  describe('All exports verification', () => {
    it('should export all v2.7.0 functionality', async () => {
      const module = await import('../index');

      // Enums (v2.7.0)
      expect(module.eIdentityComponents).toBeDefined();
      expect(module.eIdentityRouteNames).toBeDefined();

      // Services
      expect(module.IdentityService).toBeDefined();
      expect(module.IdentityStateService).toBeDefined();

      // Hooks
      expect(module.useIdentity).toBeDefined();
      expect(module.useRoles).toBeDefined();
      expect(module.useUsers).toBeDefined();

      // Components
      expect(module.RolesComponent).toBeDefined();
      expect(module.UsersComponent).toBeDefined();

      // Constants
      expect(module.IDENTITY_ROUTE_PATHS).toBeDefined();
    });
  });
});
