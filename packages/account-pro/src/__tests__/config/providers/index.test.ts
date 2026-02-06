import { describe, it, expect } from 'vitest';
import * as providersExports from '../../../config/providers';

describe('config/providers barrel exports (v3.0.0)', () => {
  describe('route.provider exports', () => {
    it('should export configureRoutes', () => {
      expect(providersExports.configureRoutes).toBeDefined();
      expect(typeof providersExports.configureRoutes).toBe('function');
    });

    it('should export ACCOUNT_ROUTE_PROVIDERS', () => {
      expect(providersExports.ACCOUNT_ROUTE_PROVIDERS).toBeDefined();
      expect(typeof providersExports.ACCOUNT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should export initializeAccountRoutes', () => {
      expect(providersExports.initializeAccountRoutes).toBeDefined();
      expect(typeof providersExports.initializeAccountRoutes).toBe('function');
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
    it('should export all expected provider functions and objects', () => {
      const exportKeys = Object.keys(providersExports);
      expect(exportKeys).toContain('configureRoutes');
      expect(exportKeys).toContain('ACCOUNT_ROUTE_PROVIDERS');
      expect(exportKeys).toContain('initializeAccountRoutes');
      expect(exportKeys).toContain('configureSettingTabs');
      expect(exportKeys).toContain('ACCOUNT_SETTING_TAB_PROVIDERS');
      expect(exportKeys).toContain('getSettingTabsService');
    });

    it('should have at least 6 exports', () => {
      const exportKeys = Object.keys(providersExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(6);
    });
  });
});
