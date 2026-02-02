import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../enums';

describe('enums barrel export', () => {
  describe('exported values', () => {
    it('should export eSettingManagementComponents', () => {
      expect(enumsExports.eSettingManagementComponents).toBeDefined();
      expect(typeof enumsExports.eSettingManagementComponents).toBe('object');
    });

    it('should export eSettingManagementRouteNames', () => {
      expect(enumsExports.eSettingManagementRouteNames).toBeDefined();
      expect(typeof enumsExports.eSettingManagementRouteNames).toBe('object');
    });
  });

  describe('export structure', () => {
    it('should have exactly 2 enum exports', () => {
      const exportKeys = Object.keys(enumsExports);
      // Filter out type-only exports (types don't exist at runtime)
      const valueExports = exportKeys.filter(
        (key) => typeof enumsExports[key as keyof typeof enumsExports] !== 'undefined'
      );
      expect(valueExports).toHaveLength(2);
    });

    it('should export enums with correct values', () => {
      expect(enumsExports.eSettingManagementComponents.SettingManagement).toBe(
        'SettingManagement.SettingManagementComponent'
      );
      expect(enumsExports.eSettingManagementRouteNames.Settings).toBe(
        'AbpSettingManagement::Settings'
      );
    });
  });

  describe('re-exports from individual files', () => {
    it('should re-export components enum correctly', () => {
      const { eSettingManagementComponents } = enumsExports;
      expect(Object.keys(eSettingManagementComponents)).toEqual(['SettingManagement']);
    });

    it('should re-export route-names enum correctly', () => {
      const { eSettingManagementRouteNames } = enumsExports;
      expect(Object.keys(eSettingManagementRouteNames)).toEqual(['Settings']);
    });
  });
});
