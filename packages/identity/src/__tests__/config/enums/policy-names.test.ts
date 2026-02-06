import { describe, it, expect } from 'vitest';
import { eIdentityPolicyNames } from '../../../config/enums/policy-names';

/**
 * Tests for eIdentityPolicyNames enum
 * @since 3.0.0
 */
describe('eIdentityPolicyNames', () => {
  describe('enum values', () => {
    it('should have IdentityManagement with combined policy value', () => {
      expect(eIdentityPolicyNames.IdentityManagement).toBe('AbpIdentity.Roles || AbpIdentity.Users');
    });

    it('should have Roles with correct policy value', () => {
      expect(eIdentityPolicyNames.Roles).toBe('AbpIdentity.Roles');
    });

    it('should have Users with correct policy value', () => {
      expect(eIdentityPolicyNames.Users).toBe('AbpIdentity.Users');
    });
  });

  describe('enum structure', () => {
    it('should be defined', () => {
      expect(eIdentityPolicyNames).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof eIdentityPolicyNames).toBe('object');
    });

    it('should have exactly 3 keys', () => {
      const keys = Object.keys(eIdentityPolicyNames);
      expect(keys).toHaveLength(3);
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(eIdentityPolicyNames);
      expect(keys).toContain('IdentityManagement');
      expect(keys).toContain('Roles');
      expect(keys).toContain('Users');
    });
  });

  describe('policy format', () => {
    it('should use ABP policy format for individual policies', () => {
      expect(eIdentityPolicyNames.Roles).toMatch(/^AbpIdentity\./);
      expect(eIdentityPolicyNames.Users).toMatch(/^AbpIdentity\./);
    });

    it('should use OR operator for combined IdentityManagement policy', () => {
      expect(eIdentityPolicyNames.IdentityManagement).toContain('||');
      expect(eIdentityPolicyNames.IdentityManagement).toContain(eIdentityPolicyNames.Roles);
      expect(eIdentityPolicyNames.IdentityManagement).toContain(eIdentityPolicyNames.Users);
    });
  });

  describe('usage patterns', () => {
    it('should be usable for route requiredPolicy', () => {
      const route = {
        path: '/identity/roles',
        requiredPolicy: eIdentityPolicyNames.Roles,
      };
      expect(route.requiredPolicy).toBe('AbpIdentity.Roles');
    });

    it('should be usable for permission checks', () => {
      const checkPermission = (policy: string) => policy === 'AbpIdentity.Roles';
      expect(checkPermission(eIdentityPolicyNames.Roles)).toBe(true);
      expect(checkPermission(eIdentityPolicyNames.Users)).toBe(false);
    });

    it('should have unique values for each key', () => {
      const values = Object.values(eIdentityPolicyNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be usable in authorization context', () => {
      const userPolicies = ['AbpIdentity.Roles', 'AbpIdentity.Users'];

      const hasRolesAccess = userPolicies.includes(eIdentityPolicyNames.Roles);
      const hasUsersAccess = userPolicies.includes(eIdentityPolicyNames.Users);

      expect(hasRolesAccess).toBe(true);
      expect(hasUsersAccess).toBe(true);
    });
  });
});
