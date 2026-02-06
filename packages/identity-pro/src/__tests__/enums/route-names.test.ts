/**
 * Tests for Identity Pro Route Names
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import { eIdentityRouteNames, IdentityRouteNameKey } from '../../enums';

describe('eIdentityRouteNames', () => {
  describe('route name values', () => {
    it('should have IdentityManagement route name', () => {
      expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    });

    it('should have Roles route name', () => {
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    });

    it('should have Users route name', () => {
      expect(eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
    });

    it('should have ClaimTypes route name', () => {
      expect(eIdentityRouteNames.ClaimTypes).toBe('AbpIdentity::ClaimTypes');
    });

    it('should have OrganizationUnits route name', () => {
      expect(eIdentityRouteNames.OrganizationUnits).toBe('AbpIdentity::OrganizationUnits');
    });

    it('should NOT have Administration route name in v3.0.0', () => {
      // Administration was removed in v3.0.0
      expect((eIdentityRouteNames as Record<string, string>).Administration).toBeUndefined();
    });
  });

  describe('string usage', () => {
    it('should be usable as string values', () => {
      const identity: string = eIdentityRouteNames.IdentityManagement;
      const roles: string = eIdentityRouteNames.Roles;
      const users: string = eIdentityRouteNames.Users;
      const claims: string = eIdentityRouteNames.ClaimTypes;

      expect(identity).toBe('AbpIdentity::Menu:IdentityManagement');
      expect(roles).toBe('AbpIdentity::Roles');
      expect(users).toBe('AbpIdentity::Users');
      expect(claims).toBe('AbpIdentity::ClaimTypes');
    });

    it('should be usable for route configuration', () => {
      const routes: Record<string, { path: string }> = {};
      routes[eIdentityRouteNames.Roles] = { path: '/identity/roles' };
      routes[eIdentityRouteNames.Users] = { path: '/identity/users' };
      routes[eIdentityRouteNames.ClaimTypes] = { path: '/identity/claim-types' };

      expect(routes['AbpIdentity::Roles'].path).toBe('/identity/roles');
      expect(routes['AbpIdentity::Users'].path).toBe('/identity/users');
      expect(routes['AbpIdentity::ClaimTypes'].path).toBe('/identity/claim-types');
    });
  });

  describe('object structure', () => {
    it('should have correct keys (v3.0.0 - no Administration)', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).toContain('IdentityManagement');
      expect(keys).toContain('Roles');
      expect(keys).toContain('Users');
      expect(keys).toContain('ClaimTypes');
      expect(keys).toContain('OrganizationUnits');
      expect(keys).not.toContain('Administration');
      expect(keys).toHaveLength(5);
    });

    it('should have correct values (v3.0.0)', () => {
      const values = Object.values(eIdentityRouteNames);
      expect(values).toContain('AbpIdentity::Menu:IdentityManagement');
      expect(values).toContain('AbpIdentity::Roles');
      expect(values).toContain('AbpIdentity::Users');
      expect(values).toContain('AbpIdentity::ClaimTypes');
      expect(values).toContain('AbpIdentity::OrganizationUnits');
      expect(values).not.toContain('AbpUiNavigation::Menu:Administration');
      expect(values).toHaveLength(5);
    });

    it('should have unique values for each route', () => {
      const values = Object.values(eIdentityRouteNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object (immutable at runtime)', () => {
      expect(typeof eIdentityRouteNames).toBe('object');
      expect(eIdentityRouteNames).not.toBeNull();
    });
  });

  describe('localization key pattern', () => {
    it('should follow AbpModule::KeyName pattern', () => {
      Object.values(eIdentityRouteNames).forEach((value) => {
        expect(value).toMatch(/^Abp\w+::/);
      });
    });

    it('should have valid localization key format', () => {
      Object.values(eIdentityRouteNames).forEach((value) => {
        expect(value).toContain('::');
        const [module, key] = value.split('::');
        expect(module.length).toBeGreaterThan(0);
        expect(key.length).toBeGreaterThan(0);
      });
    });
  });

  describe('navigation hierarchy', () => {
    it('should have IdentityManagement as top-level menu in v3.0.0', () => {
      expect(eIdentityRouteNames.IdentityManagement).toContain('Menu:IdentityManagement');
    });

    it('should have leaf routes without Menu prefix', () => {
      expect(eIdentityRouteNames.Roles).not.toContain('Menu:');
      expect(eIdentityRouteNames.Users).not.toContain('Menu:');
      expect(eIdentityRouteNames.ClaimTypes).not.toContain('Menu:');
      expect(eIdentityRouteNames.OrganizationUnits).not.toContain('Menu:');
    });
  });
});

describe('IdentityRouteNameKey type', () => {
  it('should accept valid route name keys', () => {
    const identityKey: IdentityRouteNameKey = 'AbpIdentity::Menu:IdentityManagement';
    const rolesKey: IdentityRouteNameKey = 'AbpIdentity::Roles';
    const usersKey: IdentityRouteNameKey = 'AbpIdentity::Users';
    const claimsKey: IdentityRouteNameKey = 'AbpIdentity::ClaimTypes';
    const orgUnitsKey: IdentityRouteNameKey = 'AbpIdentity::OrganizationUnits';

    expect(identityKey).toBe(eIdentityRouteNames.IdentityManagement);
    expect(rolesKey).toBe(eIdentityRouteNames.Roles);
    expect(usersKey).toBe(eIdentityRouteNames.Users);
    expect(claimsKey).toBe(eIdentityRouteNames.ClaimTypes);
    expect(orgUnitsKey).toBe(eIdentityRouteNames.OrganizationUnits);
  });

  it('should work with eIdentityRouteNames values', () => {
    const key: IdentityRouteNameKey = eIdentityRouteNames.Roles;
    expect(key).toBe('AbpIdentity::Roles');
  });

  it('should be usable in function parameters', () => {
    const isValidRouteKey = (key: IdentityRouteNameKey): boolean => {
      return Object.values(eIdentityRouteNames).includes(key);
    };

    expect(isValidRouteKey(eIdentityRouteNames.IdentityManagement)).toBe(true);
    expect(isValidRouteKey(eIdentityRouteNames.Roles)).toBe(true);
    expect(isValidRouteKey(eIdentityRouteNames.Users)).toBe(true);
    expect(isValidRouteKey(eIdentityRouteNames.ClaimTypes)).toBe(true);
    expect(isValidRouteKey(eIdentityRouteNames.OrganizationUnits)).toBe(true);
  });

  it('should work with Record type for route configuration', () => {
    const routePaths: Record<IdentityRouteNameKey, string> = {
      'AbpIdentity::Menu:IdentityManagement': '/identity',
      'AbpIdentity::Roles': '/identity/roles',
      'AbpIdentity::Users': '/identity/users',
      'AbpIdentity::ClaimTypes': '/identity/claim-types',
      'AbpIdentity::OrganizationUnits': '/identity/organization-units',
    };

    expect(routePaths[eIdentityRouteNames.IdentityManagement]).toBe('/identity');
    expect(routePaths[eIdentityRouteNames.Roles]).toBe('/identity/roles');
    expect(routePaths[eIdentityRouteNames.Users]).toBe('/identity/users');
    expect(routePaths[eIdentityRouteNames.ClaimTypes]).toBe('/identity/claim-types');
    expect(routePaths[eIdentityRouteNames.OrganizationUnits]).toBe('/identity/organization-units');
  });

  it('should be usable for localization lookups', () => {
    const mockLocalize = (key: IdentityRouteNameKey): string => {
      const translations: Record<IdentityRouteNameKey, string> = {
        'AbpIdentity::Menu:IdentityManagement': 'Identity Management',
        'AbpIdentity::Roles': 'Roles',
        'AbpIdentity::Users': 'Users',
        'AbpIdentity::ClaimTypes': 'Claim Types',
        'AbpIdentity::OrganizationUnits': 'Organization Units',
      };
      return translations[key];
    };

    expect(mockLocalize(eIdentityRouteNames.IdentityManagement)).toBe('Identity Management');
    expect(mockLocalize(eIdentityRouteNames.Roles)).toBe('Roles');
    expect(mockLocalize(eIdentityRouteNames.Users)).toBe('Users');
    expect(mockLocalize(eIdentityRouteNames.ClaimTypes)).toBe('Claim Types');
    expect(mockLocalize(eIdentityRouteNames.OrganizationUnits)).toBe('Organization Units');
  });
});
