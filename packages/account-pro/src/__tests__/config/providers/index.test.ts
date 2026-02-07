import { describe, it, expect } from 'vitest';
import * as providersExports from '../../../config/providers';

describe('config/providers barrel exports (v4.0.0)', () => {
  // v4.0.0: route.provider removed from config/providers exports
  describe('route.provider exports (removed in v4.0.0)', () => {
    it('should NOT export configureRoutes (removed in v4.0.0)', () => {
      expect((providersExports as Record<string, unknown>).configureRoutes).toBeUndefined();
    });

    it('should NOT export ACCOUNT_ROUTE_PROVIDERS (removed in v4.0.0)', () => {
      expect((providersExports as Record<string, unknown>).ACCOUNT_ROUTE_PROVIDERS).toBeUndefined();
    });

    it('should NOT export initializeAccountRoutes (removed in v4.0.0)', () => {
      expect((providersExports as Record<string, unknown>).initializeAccountRoutes).toBeUndefined();
    });
  });

  describe('setting-tab.provider exports', () => {
    it('should export configureSettingTabs', () => {
      expect(providersExports.configureSettingTabs).toBeDefined();
      expect(typeof providersExports.configureSettingTabs).toBe('function');
    });

    it('should export ACCOUNT_SETTING_TAB_PROVIDERS', () => {
      expect(providersExports.ACCOUNT_SETTING_TAB_PROVIDERS).toBeDefined();
      expect(typeof providersExports.ACCOUNT_SETTING_TAB_PROVIDERS).toBe('object');
    });

    it('should export getSettingTabsService', () => {
      expect(providersExports.getSettingTabsService).toBeDefined();
      expect(typeof providersExports.getSettingTabsService).toBe('function');
    });
  });

  describe('exports completeness', () => {
    it('should export only setting-tab provider functions and objects', () => {
      const exportKeys = Object.keys(providersExports);
      expect(exportKeys).toContain('configureSettingTabs');
      expect(exportKeys).toContain('ACCOUNT_SETTING_TAB_PROVIDERS');
      expect(exportKeys).toContain('getSettingTabsService');
      // route.provider removed in v4.0.0
      expect(exportKeys).not.toContain('configureRoutes');
      expect(exportKeys).not.toContain('ACCOUNT_ROUTE_PROVIDERS');
      expect(exportKeys).not.toContain('initializeAccountRoutes');
    });

    it('should have exactly 3 exports (v4.0.0)', () => {
      const exportKeys = Object.keys(providersExports);
      expect(exportKeys.length).toBe(3);
    });
  });
});
