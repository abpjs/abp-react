import { describe, it, expect } from 'vitest';
import * as configExports from '../../config';

describe('config barrel exports (v4.0.0)', () => {
  describe('enums exports', () => {
    // v4.0.0: eAccountRouteNames removed from config/enums barrel
    it('should NOT export eAccountRouteNames from config (removed in v4.0.0)', () => {
      expect((configExports as Record<string, unknown>).eAccountRouteNames).toBeUndefined();
    });

    it('should export eAccountSettingTabNames', () => {
      expect(configExports.eAccountSettingTabNames).toBeDefined();
      expect(typeof configExports.eAccountSettingTabNames).toBe('object');
    });
  });

  describe('providers exports', () => {
    // v4.0.0: route.provider removed from config/providers barrel
    it('should NOT export configureRoutes (removed in v4.0.0)', () => {
      expect((configExports as Record<string, unknown>).configureRoutes).toBeUndefined();
    });

    it('should NOT export ACCOUNT_ROUTE_PROVIDERS (removed in v4.0.0)', () => {
      expect((configExports as Record<string, unknown>).ACCOUNT_ROUTE_PROVIDERS).toBeUndefined();
    });

    it('should NOT export initializeAccountRoutes (removed in v4.0.0)', () => {
      expect((configExports as Record<string, unknown>).initializeAccountRoutes).toBeUndefined();
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
    it('should export expected items from enums and providers (v4.0.0)', () => {
      const exportKeys = Object.keys(configExports);

      // Enums still exported
      expect(exportKeys).toContain('eAccountSettingTabNames');
      expect(exportKeys).toContain('ProfilePictureType');
      expect(exportKeys).toContain('eTwoFactorBehaviour');

      // Providers still exported
      expect(exportKeys).toContain('configureSettingTabs');
      expect(exportKeys).toContain('ACCOUNT_SETTING_TAB_PROVIDERS');
      expect(exportKeys).toContain('getSettingTabsService');

      // Removed in v4.0.0
      expect(exportKeys).not.toContain('eAccountRouteNames');
      expect(exportKeys).not.toContain('configureRoutes');
      expect(exportKeys).not.toContain('ACCOUNT_ROUTE_PROVIDERS');
    });

    it('should have at least 6 exports (v4.0.0)', () => {
      const exportKeys = Object.keys(configExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('enum values are correct', () => {
    it('should have correct eAccountSettingTabNames values', () => {
      expect(configExports.eAccountSettingTabNames.Account).toBe('AbpAccount::Menu:Account');
    });
  });
});
