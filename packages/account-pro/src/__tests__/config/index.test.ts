import { describe, it, expect } from 'vitest';
import * as configExports from '../../config';

describe('config barrel exports (v3.0.0)', () => {
  describe('enums exports', () => {
    it('should export eAccountRouteNames', () => {
      expect(configExports.eAccountRouteNames).toBeDefined();
      expect(typeof configExports.eAccountRouteNames).toBe('object');
    });

    it('should export eAccountSettingTabNames', () => {
      expect(configExports.eAccountSettingTabNames).toBeDefined();
      expect(typeof configExports.eAccountSettingTabNames).toBe('object');
    });
  });

  describe('providers exports', () => {
    it('should export configureRoutes', () => {
      expect(configExports.configureRoutes).toBeDefined();
      expect(typeof configExports.configureRoutes).toBe('function');
    });

    it('should export ACCOUNT_ROUTE_PROVIDERS', () => {
      expect(configExports.ACCOUNT_ROUTE_PROVIDERS).toBeDefined();
      expect(typeof configExports.ACCOUNT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should export initializeAccountRoutes', () => {
      expect(configExports.initializeAccountRoutes).toBeDefined();
      expect(typeof configExports.initializeAccountRoutes).toBe('function');
    });

    it('should export configureSettingTabs', () => {
      expect(configExports.configureSettingTabs).toBeDefined();
      expect(typeof configExports.configureSettingTabs).toBe('function');
    });

    it('should export ACCOUNT_SETTING_TAB_PROVIDERS', () => {
      expect(configExports.ACCOUNT_SETTING_TAB_PROVIDERS).toBeDefined();
      expect(typeof configExports.ACCOUNT_SETTING_TAB_PROVIDERS).toBe('object');
    });

    it('should export getSettingTabsService', () => {
      expect(configExports.getSettingTabsService).toBeDefined();
      expect(typeof configExports.getSettingTabsService).toBe('function');
    });
  });

  describe('exports completeness', () => {
    it('should export all expected items from enums and providers', () => {
      const exportKeys = Object.keys(configExports);

      // Enums
      expect(exportKeys).toContain('eAccountRouteNames');
      expect(exportKeys).toContain('eAccountSettingTabNames');

      // Providers
      expect(exportKeys).toContain('configureRoutes');
      expect(exportKeys).toContain('ACCOUNT_ROUTE_PROVIDERS');
      expect(exportKeys).toContain('initializeAccountRoutes');
      expect(exportKeys).toContain('configureSettingTabs');
      expect(exportKeys).toContain('ACCOUNT_SETTING_TAB_PROVIDERS');
    });

    it('should have at least 8 exports', () => {
      const exportKeys = Object.keys(configExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('enum values are correct', () => {
    it('should have correct eAccountRouteNames values', () => {
      expect(configExports.eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
      expect(configExports.eAccountRouteNames.Login).toBe('AbpAccount::Login');
    });

    it('should have correct eAccountSettingTabNames values', () => {
      expect(configExports.eAccountSettingTabNames.Account).toBe('AbpAccount::Menu:Account');
    });
  });
});
