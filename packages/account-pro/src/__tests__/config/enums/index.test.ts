import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../../config/enums';

describe('config/enums barrel exports (v3.0.0)', () => {
  describe('route-names exports', () => {
    it('should export eAccountRouteNames', () => {
      expect(enumsExports.eAccountRouteNames).toBeDefined();
      expect(typeof enumsExports.eAccountRouteNames).toBe('object');
    });

    it('should export eAccountRouteNames with all keys', () => {
      expect(enumsExports.eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
      expect(enumsExports.eAccountRouteNames.Login).toBe('AbpAccount::Login');
      expect(enumsExports.eAccountRouteNames.Register).toBe('AbpAccount::Register');
      expect(enumsExports.eAccountRouteNames.ForgotPassword).toBe('AbpAccount::ForgotPassword');
      expect(enumsExports.eAccountRouteNames.ResetPassword).toBe('AbpAccount::ResetPassword');
      expect(enumsExports.eAccountRouteNames.ManageProfile).toBe('AbpAccount::ManageYourProfile');
    });
  });

  describe('setting-tab-names exports', () => {
    it('should export eAccountSettingTabNames', () => {
      expect(enumsExports.eAccountSettingTabNames).toBeDefined();
      expect(typeof enumsExports.eAccountSettingTabNames).toBe('object');
    });

    it('should export eAccountSettingTabNames with all keys', () => {
      expect(enumsExports.eAccountSettingTabNames.Account).toBe('AbpAccount::Menu:Account');
    });
  });

  describe('exports completeness', () => {
    it('should export all expected enums', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys).toContain('eAccountRouteNames');
      expect(exportKeys).toContain('eAccountSettingTabNames');
    });

    it('should have at least 2 exports', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(2);
    });
  });
});
