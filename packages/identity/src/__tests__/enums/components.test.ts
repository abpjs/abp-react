import { describe, it, expect } from 'vitest';
import { eIdentityComponents } from '../../enums/components';

/**
 * Tests for eIdentityComponents enum
 * @since 2.7.0
 */
describe('eIdentityComponents', () => {
  describe('enum values', () => {
    it('should have Roles key with correct value', () => {
      expect(eIdentityComponents.Roles).toBe('Identity.RolesComponent');
    });

    it('should have Users key with correct value', () => {
      expect(eIdentityComponents.Users).toBe('Identity.UsersComponent');
    });
  });

  describe('enum structure', () => {
    it('should be defined', () => {
      expect(eIdentityComponents).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof eIdentityComponents).toBe('object');
    });

    it('should have exactly 2 keys', () => {
      const keys = Object.keys(eIdentityComponents);
      expect(keys).toHaveLength(2);
    });

    it('should have Roles and Users as keys', () => {
      const keys = Object.keys(eIdentityComponents);
      expect(keys).toContain('Roles');
      expect(keys).toContain('Users');
    });
  });

  describe('type safety', () => {
    it('should have immutable values (as const)', () => {
      // TypeScript ensures this at compile time, but we can verify the values are string literals
      const rolesValue: string = eIdentityComponents.Roles;
      const usersValue: string = eIdentityComponents.Users;
      expect(rolesValue).toBe('Identity.RolesComponent');
      expect(usersValue).toBe('Identity.UsersComponent');
    });

    it('should match the Angular naming convention', () => {
      // Angular uses format: ModuleName.ComponentName
      expect(eIdentityComponents.Roles).toMatch(/^Identity\.\w+Component$/);
      expect(eIdentityComponents.Users).toMatch(/^Identity\.\w+Component$/);
    });
  });

  describe('usage patterns', () => {
    it('should be usable as component replacement key', () => {
      const rolesKey = eIdentityComponents.Roles;
      const usersKey = eIdentityComponents.Users;
      expect(rolesKey).toBeTruthy();
      expect(usersKey).toBeTruthy();
      expect(typeof rolesKey).toBe('string');
      expect(typeof usersKey).toBe('string');
    });

    it('should be usable in switch statements', () => {
      const key = 'Identity.RolesComponent';
      let matched = false;

      switch (key) {
        case eIdentityComponents.Roles:
          matched = true;
          break;
        case eIdentityComponents.Users:
          break;
      }

      expect(matched).toBe(true);
    });

    it('should be usable for equality checks', () => {
      const rolesKey = eIdentityComponents.Roles;
      const usersKey = eIdentityComponents.Users;
      expect(rolesKey === 'Identity.RolesComponent').toBe(true);
      expect(usersKey === 'Identity.UsersComponent').toBe(true);
    });

    it('should have unique values for each key', () => {
      const values = Object.values(eIdentityComponents);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });
});
