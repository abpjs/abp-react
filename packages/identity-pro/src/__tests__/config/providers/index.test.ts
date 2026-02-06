/**
 * Tests for Identity Config Providers barrel export
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
  configureRoutes,
  initializeIdentityRoutes,
  IDENTITY_ROUTE_PROVIDERS,
  configureSettingTabs,
  initializeIdentitySettingTabs,
  IDENTITY_SETTING_TAB_PROVIDERS,
  IDENTITY_SETTING_TAB_CONFIG,
} from '../../../config/providers';

describe('config/providers barrel export', () => {
  describe('route.provider exports', () => {
    it('should export configureRoutes', () => {
      expect(configureRoutes).toBeDefined();
      expect(typeof configureRoutes).toBe('function');
    });

    it('should export initializeIdentityRoutes', () => {
      expect(initializeIdentityRoutes).toBeDefined();
      expect(typeof initializeIdentityRoutes).toBe('function');
    });

    it('should export IDENTITY_ROUTE_PROVIDERS', () => {
      expect(IDENTITY_ROUTE_PROVIDERS).toBeDefined();
      expect(IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });
  });

  describe('setting-tab.provider exports', () => {
    it('should export configureSettingTabs', () => {
      expect(configureSettingTabs).toBeDefined();
      expect(typeof configureSettingTabs).toBe('function');
    });

    it('should export initializeIdentitySettingTabs', () => {
      expect(initializeIdentitySettingTabs).toBeDefined();
      expect(typeof initializeIdentitySettingTabs).toBe('function');
    });

    it('should export IDENTITY_SETTING_TAB_PROVIDERS', () => {
      expect(IDENTITY_SETTING_TAB_PROVIDERS).toBeDefined();
      expect(IDENTITY_SETTING_TAB_PROVIDERS.configureSettingTabs).toBe(configureSettingTabs);
    });

    it('should export IDENTITY_SETTING_TAB_CONFIG', () => {
      expect(IDENTITY_SETTING_TAB_CONFIG).toBeDefined();
      expect(IDENTITY_SETTING_TAB_CONFIG.name).toBeDefined();
      expect(IDENTITY_SETTING_TAB_CONFIG.requiredPolicy).toBeDefined();
      expect(IDENTITY_SETTING_TAB_CONFIG.order).toBeDefined();
    });
  });
});
