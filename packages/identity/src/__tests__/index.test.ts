import { describe, it, expect } from 'vitest';
import * as identityModule from '../index';

/**
 * Tests for @abpjs/identity package exports
 * Uses static import to avoid slow dynamic imports during test execution.
 */
describe('@abpjs/identity package exports', () => {
  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export eIdentityComponents from package root', () => {
      const { eIdentityComponents } = identityModule;
      expect(eIdentityComponents).toBeDefined();
      expect(eIdentityComponents.Roles).toBe('Identity.RolesComponent');
      expect(eIdentityComponents.Users).toBe('Identity.UsersComponent');
    });

    it('should export eIdentityRouteNames from package root', () => {
      const { eIdentityRouteNames } = identityModule;
      expect(eIdentityRouteNames).toBeDefined();
      expect(eIdentityRouteNames.Administration).toBe('AbpUiNavigation::Menu:Administration');
      expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
      expect(eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export Identity namespace (type-only, verified by compilation)', () => {
      // Identity namespace contains interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      expect(identityModule).toBeDefined();
    });
  });

  // Service exports
  describe('Service exports', () => {
    it('should export IdentityService', () => {
      const { IdentityService } = identityModule;
      expect(IdentityService).toBeDefined();
    });

    it('should export IdentityStateService', () => {
      const { IdentityStateService } = identityModule;
      expect(IdentityStateService).toBeDefined();
    });
  });

  // Hook exports
  describe('Hook exports', () => {
    it('should export useIdentity', () => {
      const { useIdentity } = identityModule;
      expect(useIdentity).toBeDefined();
    });

    it('should export useRoles', () => {
      const { useRoles } = identityModule;
      expect(useRoles).toBeDefined();
    });

    it('should export useUsers', () => {
      const { useUsers } = identityModule;
      expect(useUsers).toBeDefined();
    });
  });

  // Component exports
  describe('Component exports', () => {
    it('should export RolesComponent', () => {
      const { RolesComponent } = identityModule;
      expect(RolesComponent).toBeDefined();
    });

    it('should export UsersComponent', () => {
      const { UsersComponent } = identityModule;
      expect(UsersComponent).toBeDefined();
    });

    it('should export RolesComponent with componentKey (v2.7.0)', () => {
      const { RolesComponent } = identityModule;
      expect(RolesComponent.componentKey).toBe('Identity.RolesComponent');
    });

    it('should export UsersComponent with componentKey (v2.7.0)', () => {
      const { UsersComponent } = identityModule;
      expect(UsersComponent.componentKey).toBe('Identity.UsersComponent');
    });
  });

  // Constants exports
  describe('Constants exports', () => {
    it('should export IDENTITY_ROUTE_PATHS', () => {
      const { IDENTITY_ROUTE_PATHS } = identityModule;
      expect(IDENTITY_ROUTE_PATHS).toBeDefined();
    });
  });

  // Verify all major exports are present
  describe('All exports verification', () => {
    it('should export all v2.7.0 functionality', () => {
      const module = identityModule;

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
