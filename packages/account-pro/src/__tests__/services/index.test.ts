import { describe, it, expect } from 'vitest';
import * as servicesExports from '../../services';

describe('services barrel exports (v3.2.0)', () => {
  describe('AccountProService exports', () => {
    it('should export AccountProService', () => {
      expect(servicesExports.AccountProService).toBeDefined();
      expect(typeof servicesExports.AccountProService).toBe('function');
    });

    it('should be a class constructor', () => {
      expect(servicesExports.AccountProService.prototype).toBeDefined();
    });
  });

  describe('ProfileService exports (v3.2.0)', () => {
    it('should export ProfileService', () => {
      expect(servicesExports.ProfileService).toBeDefined();
      expect(typeof servicesExports.ProfileService).toBe('function');
    });

    it('should be a class constructor', () => {
      expect(servicesExports.ProfileService.prototype).toBeDefined();
    });
  });

  describe('ManageProfileTabsService exports (v3.2.0)', () => {
    it('should export ManageProfileTabsService', () => {
      expect(servicesExports.ManageProfileTabsService).toBeDefined();
      expect(typeof servicesExports.ManageProfileTabsService).toBe('function');
    });

    it('should be a class constructor', () => {
      expect(servicesExports.ManageProfileTabsService.prototype).toBeDefined();
    });

    it('should export getManageProfileTabsService function', () => {
      expect(servicesExports.getManageProfileTabsService).toBeDefined();
      expect(typeof servicesExports.getManageProfileTabsService).toBe(
        'function'
      );
    });

    it('should export ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS', () => {
      expect(servicesExports.ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS).toBeDefined();
      expect(
        typeof servicesExports.ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS
      ).toBe('object');
    });

    it('should export ACCOUNT_MANAGE_PROFILE_TAB_ORDERS', () => {
      expect(servicesExports.ACCOUNT_MANAGE_PROFILE_TAB_ORDERS).toBeDefined();
      expect(typeof servicesExports.ACCOUNT_MANAGE_PROFILE_TAB_ORDERS).toBe(
        'object'
      );
    });

    it('should export ACCOUNT_MANAGE_PROFILE_TAB_NAMES', () => {
      expect(servicesExports.ACCOUNT_MANAGE_PROFILE_TAB_NAMES).toBeDefined();
      expect(typeof servicesExports.ACCOUNT_MANAGE_PROFILE_TAB_NAMES).toBe(
        'object'
      );
    });
  });

  describe('exports completeness', () => {
    it('should export all expected services', () => {
      const exportKeys = Object.keys(servicesExports);
      expect(exportKeys).toContain('AccountProService');
      expect(exportKeys).toContain('ProfileService');
      expect(exportKeys).toContain('ManageProfileTabsService');
      expect(exportKeys).toContain('getManageProfileTabsService');
    });

    it('should export all expected constants', () => {
      const exportKeys = Object.keys(servicesExports);
      expect(exportKeys).toContain('ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS');
      expect(exportKeys).toContain('ACCOUNT_MANAGE_PROFILE_TAB_ORDERS');
      expect(exportKeys).toContain('ACCOUNT_MANAGE_PROFILE_TAB_NAMES');
    });

    it('should have at least 7 exports', () => {
      const exportKeys = Object.keys(servicesExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(7);
    });
  });
});
