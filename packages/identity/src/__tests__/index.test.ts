import { describe, it, expect } from 'vitest';
import * as identityModule from '../index';

/**
 * Tests for @abpjs/identity package exports
 * Uses static import to avoid slow dynamic imports during test execution.
 *
 * @updated 3.0.0 - Added config exports, removed Administration from eIdentityRouteNames
 */
describe('@abpjs/identity package exports', () => {
  // v3.0.0: Config exports
  describe('v3.0.0 - Config exports', () => {
    it('should export eIdentityPolicyNames from package root', () => {
      const { eIdentityPolicyNames } = identityModule;
      expect(eIdentityPolicyNames).toBeDefined();
      expect(eIdentityPolicyNames.IdentityManagement).toBe('AbpIdentity.Roles || AbpIdentity.Users');
      expect(eIdentityPolicyNames.Roles).toBe('AbpIdentity.Roles');
      expect(eIdentityPolicyNames.Users).toBe('AbpIdentity.Users');
    });

    it('should export IDENTITY_ROUTE_PROVIDERS from package root', () => {
      const { IDENTITY_ROUTE_PROVIDERS } = identityModule;
      expect(IDENTITY_ROUTE_PROVIDERS).toBeDefined();
      expect(IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
      expect(typeof IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBe('function');
    });

    it('should export configureRoutes from package root', () => {
      const { configureRoutes } = identityModule;
      expect(configureRoutes).toBeDefined();
      expect(typeof configureRoutes).toBe('function');
    });

    it('should export initializeIdentityRoutes from package root', () => {
      const { initializeIdentityRoutes } = identityModule;
      expect(initializeIdentityRoutes).toBeDefined();
      expect(typeof initializeIdentityRoutes).toBe('function');
    });
  });

  // v2.7.0: Enum exports (updated in v3.0.0)
  describe('v2.7.0 - Enum exports (updated in v3.0.0)', () => {
    it('should export eIdentityComponents from package root', () => {
      const { eIdentityComponents } = identityModule;
      expect(eIdentityComponents).toBeDefined();
      expect(eIdentityComponents.Roles).toBe('Identity.RolesComponent');
      expect(eIdentityComponents.Users).toBe('Identity.UsersComponent');
    });

    it('should export eIdentityRouteNames from package root (without Administration)', () => {
      const { eIdentityRouteNames } = identityModule;
      expect(eIdentityRouteNames).toBeDefined();
      // v3.0.0: Administration key removed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((eIdentityRouteNames as any).Administration).toBeUndefined();
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
    it('should export all v3.0.0 functionality', () => {
      const module = identityModule;

      // Config (v3.0.0)
      expect(module.eIdentityPolicyNames).toBeDefined();
      expect(module.IDENTITY_ROUTE_PROVIDERS).toBeDefined();
      expect(module.configureRoutes).toBeDefined();
      expect(module.initializeIdentityRoutes).toBeDefined();

      // Enums (v2.7.0, updated in v3.0.0)
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
