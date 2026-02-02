import { describe, it, expect } from 'vitest';
import { eIdentityRouteNames } from '../../enums/route-names';

/**
 * Tests for eIdentityRouteNames enum
 * @since 2.7.0
 */
describe('eIdentityRouteNames', () => {
  describe('enum values', () => {
    it('should have Administration key with correct value', () => {
      expect(eIdentityRouteNames.Administration).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should have IdentityManagement key with correct value', () => {
      expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    });

    it('should have Roles key with correct value', () => {
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    });

    it('should have Users key with correct value', () => {
      expect(eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
    });
  });

  describe('enum structure', () => {
    it('should be defined', () => {
      expect(eIdentityRouteNames).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof eIdentityRouteNames).toBe('object');
    });

    it('should have exactly 4 keys', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).toHaveLength(4);
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).toContain('Administration');
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

    it('should have Administration from AbpUiNavigation resource', () => {
      expect(eIdentityRouteNames.Administration).toMatch(/^AbpUiNavigation::/);
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
        { label: eIdentityRouteNames.Administration },
        { label: eIdentityRouteNames.IdentityManagement },
        { label: eIdentityRouteNames.Users },
      ];
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].label).toBe('AbpUiNavigation::Menu:Administration');
      expect(breadcrumbs[1].label).toBe('AbpIdentity::Menu:IdentityManagement');
      expect(breadcrumbs[2].label).toBe('AbpIdentity::Users');
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
        case eIdentityRouteNames.Administration:
          matched = 'admin';
          break;
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
