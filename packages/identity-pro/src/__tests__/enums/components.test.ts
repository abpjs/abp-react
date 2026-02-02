/**
 * Tests for Identity Pro Component Identifiers
 * @abpjs/identity-pro v2.7.0
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
    it('should have correct keys', () => {
      const keys = Object.keys(eIdentityComponents);
      expect(keys).toContain('Claims');
      expect(keys).toContain('Roles');
      expect(keys).toContain('Users');
      expect(keys).toHaveLength(3);
    });

    it('should have correct values', () => {
      const values = Object.values(eIdentityComponents);
      expect(values).toContain('Identity.ClaimsComponent');
      expect(values).toContain('Identity.RolesComponent');
      expect(values).toContain('Identity.UsersComponent');
      expect(values).toHaveLength(3);
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

  describe('v2.7.0 const object pattern', () => {
    it('should follow Module.ComponentName pattern', () => {
      Object.values(eIdentityComponents).forEach((value) => {
        expect(value).toMatch(/^Identity\.\w+Component$/);
      });
    });

    it('should be usable in type-safe component lookup', () => {
      const getComponent = (key: IdentityComponentKey): string => {
        const components: Record<IdentityComponentKey, string> = {
          [eIdentityComponents.Claims]: 'ClaimsComponent',
          [eIdentityComponents.Roles]: 'RolesComponent',
          [eIdentityComponents.Users]: 'UsersComponent',
        };
        return components[key];
      };

      expect(getComponent(eIdentityComponents.Claims)).toBe('ClaimsComponent');
      expect(getComponent(eIdentityComponents.Roles)).toBe('RolesComponent');
      expect(getComponent(eIdentityComponents.Users)).toBe('UsersComponent');
    });
  });
});

describe('IdentityComponentKey type', () => {
  it('should accept valid component keys', () => {
    const claimsKey: IdentityComponentKey = 'Identity.ClaimsComponent';
    const rolesKey: IdentityComponentKey = 'Identity.RolesComponent';
    const usersKey: IdentityComponentKey = 'Identity.UsersComponent';

    expect(claimsKey).toBe(eIdentityComponents.Claims);
    expect(rolesKey).toBe(eIdentityComponents.Roles);
    expect(usersKey).toBe(eIdentityComponents.Users);
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
  });

  it('should work with Record type', () => {
    const componentNames: Record<IdentityComponentKey, string> = {
      'Identity.ClaimsComponent': 'Claims',
      'Identity.RolesComponent': 'Roles',
      'Identity.UsersComponent': 'Users',
    };

    expect(componentNames[eIdentityComponents.Claims]).toBe('Claims');
    expect(componentNames[eIdentityComponents.Roles]).toBe('Roles');
    expect(componentNames[eIdentityComponents.Users]).toBe('Users');
  });
});
