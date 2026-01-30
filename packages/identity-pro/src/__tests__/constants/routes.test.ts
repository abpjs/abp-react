import { describe, it, expect } from 'vitest';
import { IDENTITY_ROUTES, IDENTITY_ROUTE_PATHS, IDENTITY_POLICIES } from '../../constants/routes';

describe('Identity Routes', () => {
  describe('IDENTITY_ROUTES', () => {
    it('should have routes property', () => {
      expect(IDENTITY_ROUTES).toHaveProperty('routes');
      expect(Array.isArray(IDENTITY_ROUTES.routes)).toBe(true);
    });

    it('should have Administration wrapper route', () => {
      const adminRoute = IDENTITY_ROUTES.routes.find(
        (r) => r.name === 'AbpUiNavigation::Menu:Administration'
      );
      expect(adminRoute).toBeDefined();
      expect(adminRoute?.wrapper).toBe(true);
      expect(adminRoute?.path).toBe('');
    });

    it('should have Identity Management parent route', () => {
      const identityRoute = IDENTITY_ROUTES.routes.find(
        (r) => r.name === 'AbpIdentity::Menu:IdentityManagement'
      );
      expect(identityRoute).toBeDefined();
      expect(identityRoute?.path).toBe('identity');
      expect(identityRoute?.parentName).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should have roles child route', () => {
      const identityRoute = IDENTITY_ROUTES.routes.find(
        (r) => r.name === 'AbpIdentity::Menu:IdentityManagement'
      );
      const rolesRoute = identityRoute?.children?.find((r) => r.path === 'roles');

      expect(rolesRoute).toBeDefined();
      expect(rolesRoute?.name).toBe('AbpIdentity::Roles');
      expect(rolesRoute?.requiredPolicy).toBe('AbpIdentity.Roles');
    });

    it('should have users child route', () => {
      const identityRoute = IDENTITY_ROUTES.routes.find(
        (r) => r.name === 'AbpIdentity::Menu:IdentityManagement'
      );
      const usersRoute = identityRoute?.children?.find((r) => r.path === 'users');

      expect(usersRoute).toBeDefined();
      expect(usersRoute?.name).toBe('AbpIdentity::Users');
      expect(usersRoute?.requiredPolicy).toBe('AbpIdentity.Users');
    });

    it('should have users before roles in order', () => {
      const identityRoute = IDENTITY_ROUTES.routes.find(
        (r) => r.name === 'AbpIdentity::Menu:IdentityManagement'
      );
      const rolesRoute = identityRoute?.children?.find((r) => r.path === 'roles');
      const usersRoute = identityRoute?.children?.find((r) => r.path === 'users');

      expect(usersRoute?.order).toBeLessThan(rolesRoute?.order || 0);
    });
  });

  describe('IDENTITY_ROUTE_PATHS', () => {
    it('should have BASE path', () => {
      expect(IDENTITY_ROUTE_PATHS.BASE).toBe('/identity');
    });

    it('should have ROLES path', () => {
      expect(IDENTITY_ROUTE_PATHS.ROLES).toBe('/identity/roles');
    });

    it('should have USERS path', () => {
      expect(IDENTITY_ROUTE_PATHS.USERS).toBe('/identity/users');
    });

    it('should be readonly', () => {
      expect(Object.keys(IDENTITY_ROUTE_PATHS)).toEqual(['BASE', 'ROLES', 'USERS']);
    });
  });

  describe('IDENTITY_POLICIES', () => {
    it('should have ROLES policy', () => {
      expect(IDENTITY_POLICIES.ROLES).toBe('AbpIdentity.Roles');
    });

    it('should have USERS policy', () => {
      expect(IDENTITY_POLICIES.USERS).toBe('AbpIdentity.Users');
    });

    it('should have USERS_CREATE policy', () => {
      expect(IDENTITY_POLICIES.USERS_CREATE).toBe('AbpIdentity.Users.Create');
    });

    it('should have USERS_UPDATE policy', () => {
      expect(IDENTITY_POLICIES.USERS_UPDATE).toBe('AbpIdentity.Users.Update');
    });

    it('should have USERS_DELETE policy', () => {
      expect(IDENTITY_POLICIES.USERS_DELETE).toBe('AbpIdentity.Users.Delete');
    });

    it('should have ROLES_CREATE policy', () => {
      expect(IDENTITY_POLICIES.ROLES_CREATE).toBe('AbpIdentity.Roles.Create');
    });

    it('should have ROLES_UPDATE policy', () => {
      expect(IDENTITY_POLICIES.ROLES_UPDATE).toBe('AbpIdentity.Roles.Update');
    });

    it('should have ROLES_DELETE policy', () => {
      expect(IDENTITY_POLICIES.ROLES_DELETE).toBe('AbpIdentity.Roles.Delete');
    });
  });
});
