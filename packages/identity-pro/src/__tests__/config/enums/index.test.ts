/**
 * Tests for Identity Config Enums barrel export
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  eIdentityPolicyNames,
  IdentityPolicyNameKey,
  eIdentityRouteNames,
  IdentityRouteNameKey,
  eIdentitySettingTabNames,
  IdentitySettingTabNameKey,
} from '../../../config/enums';

describe('config/enums barrel export', () => {
  describe('policy-names exports', () => {
    it('should export eIdentityPolicyNames', () => {
      expect(eIdentityPolicyNames).toBeDefined();
      expect(eIdentityPolicyNames.Roles).toBe('AbpIdentity.Roles');
    });

    it('should export IdentityPolicyNameKey type', () => {
      const key: IdentityPolicyNameKey = 'AbpIdentity.Roles';
      expect(key).toBe(eIdentityPolicyNames.Roles);
    });
  });

  describe('route-names exports', () => {
    it('should export eIdentityRouteNames', () => {
      expect(eIdentityRouteNames).toBeDefined();
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    });

    it('should export IdentityRouteNameKey type', () => {
      const key: IdentityRouteNameKey = 'AbpIdentity::Roles';
      expect(key).toBe(eIdentityRouteNames.Roles);
    });
  });

  describe('setting-tab-names exports', () => {
    it('should export eIdentitySettingTabNames', () => {
      expect(eIdentitySettingTabNames).toBeDefined();
      expect(eIdentitySettingTabNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    });

    it('should export IdentitySettingTabNameKey type', () => {
      const key: IdentitySettingTabNameKey = 'AbpIdentity::Menu:IdentityManagement';
      expect(key).toBe(eIdentitySettingTabNames.IdentityManagement);
    });
  });
});
