/**
 * Tests for Identity Policy Names
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import { eIdentityPolicyNames, IdentityPolicyNameKey } from '../../../config/enums/policy-names';

describe('eIdentityPolicyNames', () => {
  describe('policy name values', () => {
    it('should have IdentityManagement policy name', () => {
      expect(eIdentityPolicyNames.IdentityManagement).toBe(
        'AbpIdentity.Roles || AbpIdentity.Users || AbpIdentity.ClaimTypes || AbpIdentity.OrganizationUnits'
      );
    });

    it('should have Roles policy name', () => {
      expect(eIdentityPolicyNames.Roles).toBe('AbpIdentity.Roles');
    });

    it('should have Users policy name', () => {
      expect(eIdentityPolicyNames.Users).toBe('AbpIdentity.Users');
    });

    it('should have ClaimTypes policy name', () => {
      expect(eIdentityPolicyNames.ClaimTypes).toBe('AbpIdentity.ClaimTypes');
    });

    it('should have OrganizationUnits policy name', () => {
      expect(eIdentityPolicyNames.OrganizationUnits).toBe('AbpIdentity.OrganizationUnits');
    });
  });

  describe('object structure', () => {
    it('should have exactly 5 policy names', () => {
      const keys = Object.keys(eIdentityPolicyNames);
      expect(keys).toHaveLength(5);
    });

    it('should have correct keys', () => {
      const keys = Object.keys(eIdentityPolicyNames);
      expect(keys).toContain('IdentityManagement');
      expect(keys).toContain('Roles');
      expect(keys).toContain('Users');
      expect(keys).toContain('ClaimTypes');
      expect(keys).toContain('OrganizationUnits');
    });

    it('should be a const object', () => {
      expect(typeof eIdentityPolicyNames).toBe('object');
      expect(eIdentityPolicyNames).not.toBeNull();
    });
  });

  describe('permission patterns', () => {
    it('should follow AbpIdentity.* pattern for single policies', () => {
      expect(eIdentityPolicyNames.Roles).toMatch(/^AbpIdentity\./);
      expect(eIdentityPolicyNames.Users).toMatch(/^AbpIdentity\./);
      expect(eIdentityPolicyNames.ClaimTypes).toMatch(/^AbpIdentity\./);
      expect(eIdentityPolicyNames.OrganizationUnits).toMatch(/^AbpIdentity\./);
    });

    it('should have compound policy for IdentityManagement', () => {
      expect(eIdentityPolicyNames.IdentityManagement).toContain('||');
      expect(eIdentityPolicyNames.IdentityManagement).toContain('AbpIdentity.Roles');
      expect(eIdentityPolicyNames.IdentityManagement).toContain('AbpIdentity.Users');
      expect(eIdentityPolicyNames.IdentityManagement).toContain('AbpIdentity.ClaimTypes');
      expect(eIdentityPolicyNames.IdentityManagement).toContain('AbpIdentity.OrganizationUnits');
    });
  });
});

describe('IdentityPolicyNameKey type', () => {
  it('should accept valid policy name values', () => {
    const rolesPolicy: IdentityPolicyNameKey = 'AbpIdentity.Roles';
    const usersPolicy: IdentityPolicyNameKey = 'AbpIdentity.Users';
    const claimsPolicy: IdentityPolicyNameKey = 'AbpIdentity.ClaimTypes';
    const orgUnitsPolicy: IdentityPolicyNameKey = 'AbpIdentity.OrganizationUnits';

    expect(rolesPolicy).toBe(eIdentityPolicyNames.Roles);
    expect(usersPolicy).toBe(eIdentityPolicyNames.Users);
    expect(claimsPolicy).toBe(eIdentityPolicyNames.ClaimTypes);
    expect(orgUnitsPolicy).toBe(eIdentityPolicyNames.OrganizationUnits);
  });

  it('should work with eIdentityPolicyNames values', () => {
    const key: IdentityPolicyNameKey = eIdentityPolicyNames.Roles;
    expect(key).toBe('AbpIdentity.Roles');
  });

  it('should be usable in permission check functions', () => {
    const hasPermission = (policy: IdentityPolicyNameKey): boolean => {
      return Object.values(eIdentityPolicyNames).includes(policy);
    };

    expect(hasPermission(eIdentityPolicyNames.Roles)).toBe(true);
    expect(hasPermission(eIdentityPolicyNames.Users)).toBe(true);
    expect(hasPermission(eIdentityPolicyNames.ClaimTypes)).toBe(true);
    expect(hasPermission(eIdentityPolicyNames.OrganizationUnits)).toBe(true);
  });
});
