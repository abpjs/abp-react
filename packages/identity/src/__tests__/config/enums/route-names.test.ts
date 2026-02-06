import { describe, it, expect } from 'vitest';
import { eIdentityRouteNames } from '../../../config/enums/route-names';

/**
 * Tests for eIdentityRouteNames enum (config location)
 * @since 3.0.0 - Moved from lib/enums, removed Administration key
 */
describe('eIdentityRouteNames (config)', () => {
  describe('enum values', () => {
    it('should have IdentityManagement with correct value', () => {
      expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    });

    it('should have Roles with correct value', () => {
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    });

    it('should have Users with correct value', () => {
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

    it('should have exactly 3 keys (no Administration)', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).toHaveLength(3);
    });

    it('should not contain Administration key', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).not.toContain('Administration');
    });
  });

  describe('localization key format', () => {
    it('should use ABP localization key format with double colon', () => {
      Object.values(eIdentityRouteNames).forEach((value) => {
        expect(value).toMatch(/::/);
      });
    });

    it('should use AbpIdentity resource for all keys', () => {
      Object.values(eIdentityRouteNames).forEach((value) => {
        expect(value).toMatch(/^AbpIdentity::/);
      });
    });
  });

  describe('v3.0.0 breaking changes', () => {
    it('should verify Administration was removed', () => {
      const keys = Object.keys(eIdentityRouteNames);
      expect(keys).toEqual(['IdentityManagement', 'Roles', 'Users']);
    });

    it('should maintain backward compatibility for remaining keys', () => {
      // These values should remain unchanged from v2.x
      expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
      expect(eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
    });
  });
});
