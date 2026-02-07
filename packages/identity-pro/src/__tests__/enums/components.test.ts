/**
 * Tests for Identity Pro Component Identifiers
 * @abpjs/identity-pro v3.1.0
 */
import { describe, it, expect } from 'vitest';
import { eIdentityComponents, IdentityComponentKey } from '../../enums';

describe('eIdentityComponents', () => {
  describe('component values', () => {
    it('should have Claims component identifier', () => {
      expect(eIdentityComponents.Claims).toBe('Identity.ClaimsComponent');
    });

    it('should have Roles component identifier', () => {
      expect(eIdentityComponents.Roles).toBe('Identity.RolesComponent');
    });

    it('should have Users component identifier', () => {
      expect(eIdentityComponents.Users).toBe('Identity.UsersComponent');
    });

    it('should have OrganizationUnits component identifier (v2.9.0)', () => {
      expect(eIdentityComponents.OrganizationUnits).toBe('Identity.OrganizationUnitsComponent');
    });

    it('should have OrganizationMembers component identifier (v2.9.0)', () => {
      expect(eIdentityComponents.OrganizationMembers).toBe('Identity.OrganizationMembersComponent');
    });

    it('should have OrganizationRoles component identifier (v2.9.0)', () => {
      expect(eIdentityComponents.OrganizationRoles).toBe('Identity.OrganizationRolesComponent');
    });

    it('should have SecurityLogs component identifier (v3.1.0)', () => {
      expect(eIdentityComponents.SecurityLogs).toBe('Identity.SecurityLogs');
    });
  });

  describe('string usage', () => {
    it('should be usable as string values', () => {
      const claimsKey: string = eIdentityComponents.Claims;
      const rolesKey: string = eIdentityComponents.Roles;
      const usersKey: string = eIdentityComponents.Users;

      expect(claimsKey).toBe('Identity.ClaimsComponent');
      expect(rolesKey).toBe('Identity.RolesComponent');
      expect(usersKey).toBe('Identity.UsersComponent');
    });

    it('should be usable for component registration', () => {
      const componentRegistry: Record<string, string> = {};
      componentRegistry[eIdentityComponents.Claims] = 'ClaimsComponent';
      componentRegistry[eIdentityComponents.Roles] = 'RolesComponent';
      componentRegistry[eIdentityComponents.Users] = 'UsersComponent';

      expect(componentRegistry['Identity.ClaimsComponent']).toBe('ClaimsComponent');
      expect(componentRegistry['Identity.RolesComponent']).toBe('RolesComponent');
      expect(componentRegistry['Identity.UsersComponent']).toBe('UsersComponent');
    });
  });

  describe('object structure', () => {
    it('should have correct keys (v3.1.0 with SecurityLogs)', () => {
      const keys = Object.keys(eIdentityComponents);
      expect(keys).toContain('Claims');
      expect(keys).toContain('Roles');
      expect(keys).toContain('Users');
      expect(keys).toContain('OrganizationUnits');
      expect(keys).toContain('OrganizationMembers');
      expect(keys).toContain('OrganizationRoles');
      expect(keys).toContain('SecurityLogs');
      expect(keys).toHaveLength(7);
    });

    it('should have correct values (v3.1.0 with SecurityLogs)', () => {
      const values = Object.values(eIdentityComponents);
      expect(values).toContain('Identity.ClaimsComponent');
      expect(values).toContain('Identity.RolesComponent');
      expect(values).toContain('Identity.UsersComponent');
      expect(values).toContain('Identity.OrganizationUnitsComponent');
      expect(values).toContain('Identity.OrganizationMembersComponent');
      expect(values).toContain('Identity.OrganizationRolesComponent');
      expect(values).toContain('Identity.SecurityLogs');
      expect(values).toHaveLength(7);
    });

    it('should have unique values for each component', () => {
      const values = Object.values(eIdentityComponents);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object (immutable at runtime)', () => {
      expect(typeof eIdentityComponents).toBe('object');
      expect(eIdentityComponents).not.toBeNull();
    });
  });

  describe('v3.1.0 const object pattern', () => {
    it('should follow Module.ComponentName or Module.Name pattern', () => {
      Object.values(eIdentityComponents).forEach((value) => {
        // Most components follow Module.XyzComponent pattern
        // SecurityLogs is an exception: Identity.SecurityLogs (matches Angular source)
        expect(value).toMatch(/^Identity\.\w+$/);
      });
    });

    it('should be usable in type-safe component lookup', () => {
      const getComponent = (key: IdentityComponentKey): string => {
        const components: Record<IdentityComponentKey, string> = {
          [eIdentityComponents.Claims]: 'ClaimsComponent',
          [eIdentityComponents.Roles]: 'RolesComponent',
          [eIdentityComponents.Users]: 'UsersComponent',
          [eIdentityComponents.OrganizationUnits]: 'OrganizationUnitsComponent',
          [eIdentityComponents.OrganizationMembers]: 'OrganizationMembersComponent',
          [eIdentityComponents.OrganizationRoles]: 'OrganizationRolesComponent',
          [eIdentityComponents.SecurityLogs]: 'SecurityLogsComponent',
        };
        return components[key];
      };

      expect(getComponent(eIdentityComponents.Claims)).toBe('ClaimsComponent');
      expect(getComponent(eIdentityComponents.Roles)).toBe('RolesComponent');
      expect(getComponent(eIdentityComponents.Users)).toBe('UsersComponent');
      expect(getComponent(eIdentityComponents.OrganizationUnits)).toBe('OrganizationUnitsComponent');
      expect(getComponent(eIdentityComponents.OrganizationMembers)).toBe('OrganizationMembersComponent');
      expect(getComponent(eIdentityComponents.OrganizationRoles)).toBe('OrganizationRolesComponent');
      expect(getComponent(eIdentityComponents.SecurityLogs)).toBe('SecurityLogsComponent');
    });
  });
});

describe('IdentityComponentKey type', () => {
  it('should accept valid component keys', () => {
    const claimsKey: IdentityComponentKey = 'Identity.ClaimsComponent';
    const rolesKey: IdentityComponentKey = 'Identity.RolesComponent';
    const usersKey: IdentityComponentKey = 'Identity.UsersComponent';
    const orgUnitsKey: IdentityComponentKey = 'Identity.OrganizationUnitsComponent';
    const orgMembersKey: IdentityComponentKey = 'Identity.OrganizationMembersComponent';
    const orgRolesKey: IdentityComponentKey = 'Identity.OrganizationRolesComponent';
    const securityLogsKey: IdentityComponentKey = 'Identity.SecurityLogs';

    expect(claimsKey).toBe(eIdentityComponents.Claims);
    expect(rolesKey).toBe(eIdentityComponents.Roles);
    expect(usersKey).toBe(eIdentityComponents.Users);
    expect(orgUnitsKey).toBe(eIdentityComponents.OrganizationUnits);
    expect(orgMembersKey).toBe(eIdentityComponents.OrganizationMembers);
    expect(orgRolesKey).toBe(eIdentityComponents.OrganizationRoles);
    expect(securityLogsKey).toBe(eIdentityComponents.SecurityLogs);
  });

  it('should work with eIdentityComponents values', () => {
    const key: IdentityComponentKey = eIdentityComponents.Claims;
    expect(key).toBe('Identity.ClaimsComponent');
  });

  it('should be usable in function parameters', () => {
    const isValidKey = (key: IdentityComponentKey): boolean => {
      return Object.values(eIdentityComponents).includes(key);
    };

    expect(isValidKey(eIdentityComponents.Claims)).toBe(true);
    expect(isValidKey(eIdentityComponents.Roles)).toBe(true);
    expect(isValidKey(eIdentityComponents.Users)).toBe(true);
    expect(isValidKey(eIdentityComponents.OrganizationUnits)).toBe(true);
    expect(isValidKey(eIdentityComponents.OrganizationMembers)).toBe(true);
    expect(isValidKey(eIdentityComponents.OrganizationRoles)).toBe(true);
    expect(isValidKey(eIdentityComponents.SecurityLogs)).toBe(true);
  });

  it('should work with Record type', () => {
    const componentNames: Record<IdentityComponentKey, string> = {
      'Identity.ClaimsComponent': 'Claims',
      'Identity.RolesComponent': 'Roles',
      'Identity.UsersComponent': 'Users',
      'Identity.OrganizationUnitsComponent': 'OrganizationUnits',
      'Identity.OrganizationMembersComponent': 'OrganizationMembers',
      'Identity.OrganizationRolesComponent': 'OrganizationRoles',
      'Identity.SecurityLogs': 'SecurityLogs',
    };

    expect(componentNames[eIdentityComponents.Claims]).toBe('Claims');
    expect(componentNames[eIdentityComponents.Roles]).toBe('Roles');
    expect(componentNames[eIdentityComponents.Users]).toBe('Users');
    expect(componentNames[eIdentityComponents.OrganizationUnits]).toBe('OrganizationUnits');
    expect(componentNames[eIdentityComponents.OrganizationMembers]).toBe('OrganizationMembers');
    expect(componentNames[eIdentityComponents.OrganizationRoles]).toBe('OrganizationRoles');
    expect(componentNames[eIdentityComponents.SecurityLogs]).toBe('SecurityLogs');
  });
});
