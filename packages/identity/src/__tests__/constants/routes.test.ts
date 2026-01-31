import { describe, it, expect } from 'vitest';
import { IDENTITY_ROUTE_PATHS, IDENTITY_POLICIES } from '../../constants/routes';

describe('Identity Routes', () => {
  // Note: IDENTITY_ROUTES was removed in v2.0.0
  // Use IDENTITY_ROUTE_PATHS for programmatic navigation instead

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
