import { describe, it, expect } from 'vitest';
import { eIdentityRouteNames } from '../../enums';

/**
 * Tests for eIdentityRouteNames enum
 * @since 2.7.0
 * @updated 3.0.0 - Moved to config/enums, removed Administration key
 */
describe('eIdentityRouteNames', () => {
  describe('enum values', () => {
    it('should have IdentityManagement key with correct value', () => {
      expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    });

    it('should have Roles key with correct value', () => {
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    });

    it('should have Users key with correct value', () => {
      expect(eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
    });

    it('should NOT have Administration key (removed in v3.0.0)', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((eIdentityRouteNames as any).Administration).toBeUndefined();
    });
  });

  describe('enum structure', () => {
    it('should be defined', () => {
      expect(eIdentityRouteNames).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof eIdentityRouteNames).toBe('object');
    });

    it('should have exactly 3 keys (v3.0.0)', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).toHaveLength(3);
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).toContain('IdentityManagement');
      expect(keys).toContain('Roles');
      expect(keys).toContain('Users');
    });
  });

  describe('localization key format', () => {
    it('should use ABP localization key format with double colon', () => {
      // ABP uses format: ResourceName::KeyName
      Object.values(eIdentityRouteNames).forEach((value) => {
        expect(value).toMatch(/::/);
      });
    });

    it('should have IdentityManagement, Roles, Users from AbpIdentity resource', () => {
      expect(eIdentityRouteNames.IdentityManagement).toMatch(/^AbpIdentity::/);
      expect(eIdentityRouteNames.Roles).toMatch(/^AbpIdentity::/);
      expect(eIdentityRouteNames.Users).toMatch(/^AbpIdentity::/);
    });
  });

  describe('usage patterns', () => {
    it('should be usable for menu item names', () => {
      const menuItem = {
        name: eIdentityRouteNames.Roles,
        path: '/identity/roles',
      };
      expect(menuItem.name).toBe('AbpIdentity::Roles');
    });

    it('should be usable for breadcrumb labels', () => {
      const breadcrumbs = [
        { label: eIdentityRouteNames.IdentityManagement },
        { label: eIdentityRouteNames.Users },
      ];
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0].label).toBe('AbpIdentity::Menu:IdentityManagement');
      expect(breadcrumbs[1].label).toBe('AbpIdentity::Users');
    });

    it('should have unique values for each key', () => {
      const values = Object.values(eIdentityRouteNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be usable in switch statements', () => {
      const routeName = 'AbpIdentity::Roles';
      let matched = '';

      switch (routeName) {
        case eIdentityRouteNames.IdentityManagement:
          matched = 'identity';
          break;
        case eIdentityRouteNames.Roles:
          matched = 'roles';
          break;
        case eIdentityRouteNames.Users:
          matched = 'users';
          break;
      }

      expect(matched).toBe('roles');
    });
  });
});
