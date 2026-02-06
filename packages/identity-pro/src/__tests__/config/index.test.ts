/**
 * Tests for Identity Config barrel export
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect, vi } from 'vitest';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(() => ({ add: vi.fn() })),
  getSettingTabsService: vi.fn(() => ({ add: vi.fn() })),
  eLayoutType: {
    application: 'application',
    account: 'account',
    empty: 'empty',
  },
}));

import {
  // Enums
  eIdentityPolicyNames,
  eIdentityRouteNames,
  eIdentitySettingTabNames,
  // Providers
  configureRoutes,
  configureSettingTabs,
  IDENTITY_ROUTE_PROVIDERS,
  IDENTITY_SETTING_TAB_PROVIDERS,
  IDENTITY_SETTING_TAB_CONFIG,
} from '../../config';

describe('config barrel export', () => {
  describe('enums exports', () => {
    it('should export eIdentityPolicyNames', () => {
      expect(eIdentityPolicyNames).toBeDefined();
      expect(eIdentityPolicyNames.Roles).toBe('AbpIdentity.Roles');
    });

    it('should export eIdentityRouteNames', () => {
      expect(eIdentityRouteNames).toBeDefined();
      expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    });

    it('should export eIdentitySettingTabNames', () => {
      expect(eIdentitySettingTabNames).toBeDefined();
      expect(eIdentitySettingTabNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    });
  });

  describe('providers exports', () => {
    it('should export configureRoutes', () => {
      expect(configureRoutes).toBeDefined();
      expect(typeof configureRoutes).toBe('function');
    });

    it('should export configureSettingTabs', () => {
      expect(configureSettingTabs).toBeDefined();
      expect(typeof configureSettingTabs).toBe('function');
    });

    it('should export IDENTITY_ROUTE_PROVIDERS', () => {
      expect(IDENTITY_ROUTE_PROVIDERS).toBeDefined();
      expect(IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
    });

    it('should export IDENTITY_SETTING_TAB_PROVIDERS', () => {
      expect(IDENTITY_SETTING_TAB_PROVIDERS).toBeDefined();
      expect(IDENTITY_SETTING_TAB_PROVIDERS.configureSettingTabs).toBeDefined();
    });

    it('should export IDENTITY_SETTING_TAB_CONFIG', () => {
      expect(IDENTITY_SETTING_TAB_CONFIG).toBeDefined();
      expect(IDENTITY_SETTING_TAB_CONFIG.name).toBeDefined();
    });
  });
});
