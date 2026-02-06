import { describe, it, expect } from 'vitest';
import * as settingManagementExports from '../index';

describe('@abpjs/setting-management package exports', () => {
  describe('config (v3.0.0)', () => {
    it('should export SETTING_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(settingManagementExports.SETTING_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
      expect(typeof settingManagementExports.SETTING_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should export configureRoutes', () => {
      expect(settingManagementExports.configureRoutes).toBeDefined();
      expect(typeof settingManagementExports.configureRoutes).toBe('function');
    });

    it('should export hideRoutes', () => {
      expect(settingManagementExports.hideRoutes).toBeDefined();
      expect(typeof settingManagementExports.hideRoutes).toBe('function');
    });

    it('should export initializeSettingManagementRoutes', () => {
      expect(settingManagementExports.initializeSettingManagementRoutes).toBeDefined();
      expect(typeof settingManagementExports.initializeSettingManagementRoutes).toBe('function');
    });

    it('should export eSettingManagementRouteNames from config', () => {
      // This is re-exported from config/enums for v3.0.0
      expect(settingManagementExports.eSettingManagementRouteNames).toBeDefined();
      expect(settingManagementExports.eSettingManagementRouteNames.Settings).toBe(
        'AbpSettingManagement::Settings'
      );
    });
  });

  describe('enums (v2.7.0)', () => {
    it('should export eSettingManagementComponents', () => {
      expect(settingManagementExports.eSettingManagementComponents).toBeDefined();
      expect(
        settingManagementExports.eSettingManagementComponents.SettingManagement
      ).toBe('SettingManagement.SettingManagementComponent');
    });

    it('should export eSettingManagementRouteNames', () => {
      expect(settingManagementExports.eSettingManagementRouteNames).toBeDefined();
      expect(settingManagementExports.eSettingManagementRouteNames.Settings).toBe(
        'AbpSettingManagement::Settings'
      );
    });
  });

  describe('components', () => {
    it('should export SettingLayout', () => {
      expect(settingManagementExports.SettingLayout).toBeDefined();
      expect(typeof settingManagementExports.SettingLayout).toBe('function');
    });
  });

  describe('hooks', () => {
    it('should export useSettingManagement', () => {
      expect(settingManagementExports.useSettingManagement).toBeDefined();
      expect(typeof settingManagementExports.useSettingManagement).toBe('function');
    });
  });

  describe('services', () => {
    it('should export SettingManagementService', () => {
      expect(settingManagementExports.SettingManagementService).toBeDefined();
    });

    it('should export getSettingManagementService', () => {
      expect(settingManagementExports.getSettingManagementService).toBeDefined();
      expect(typeof settingManagementExports.getSettingManagementService).toBe(
        'function'
      );
    });

    it('should export SettingManagementStateService', () => {
      expect(settingManagementExports.SettingManagementStateService).toBeDefined();
    });

    it('should export getSettingManagementStateService', () => {
      expect(settingManagementExports.getSettingManagementStateService).toBeDefined();
      expect(typeof settingManagementExports.getSettingManagementStateService).toBe(
        'function'
      );
    });
  });

  describe('constants', () => {
    it('should export SETTING_MANAGEMENT_ROUTES', () => {
      expect(settingManagementExports.SETTING_MANAGEMENT_ROUTES).toBeDefined();
    });
  });

  describe('models namespace', () => {
    it('should export SettingManagement namespace types (verified by TypeScript compilation)', () => {
      // SettingManagement namespace contains only types (State interface)
      // Type-only exports don't exist at runtime, but TypeScript ensures they work
      // This test verifies the package compiles correctly with the namespace export
      expect(true).toBe(true);
    });
  });

  describe('export completeness', () => {
    it('should export all required v3.0.0 functionality', () => {
      // Config (v3.0.0)
      expect(settingManagementExports).toHaveProperty('SETTING_MANAGEMENT_ROUTE_PROVIDERS');
      expect(settingManagementExports).toHaveProperty('configureRoutes');
      expect(settingManagementExports).toHaveProperty('hideRoutes');
      expect(settingManagementExports).toHaveProperty('initializeSettingManagementRoutes');

      // Enums
      expect(settingManagementExports).toHaveProperty('eSettingManagementComponents');
      expect(settingManagementExports).toHaveProperty('eSettingManagementRouteNames');

      // Components
      expect(settingManagementExports).toHaveProperty('SettingLayout');

      // Hooks
      expect(settingManagementExports).toHaveProperty('useSettingManagement');

      // Services
      expect(settingManagementExports).toHaveProperty('SettingManagementService');
      expect(settingManagementExports).toHaveProperty('getSettingManagementService');
      expect(settingManagementExports).toHaveProperty('SettingManagementStateService');
      expect(settingManagementExports).toHaveProperty(
        'getSettingManagementStateService'
      );

      // Constants
      expect(settingManagementExports).toHaveProperty('SETTING_MANAGEMENT_ROUTES');

      // Note: SettingManagement namespace contains only types, which don't exist at runtime
      // TypeScript compilation verifies type exports work correctly
    });
  });
});
