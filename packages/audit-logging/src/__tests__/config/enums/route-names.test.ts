/**
 * Tests for config/enums/route-names (v3.0.0)
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  eAuditLoggingRouteNames,
  type AuditLoggingRouteNameKey,
} from '../../../config/enums/route-names';

describe('config/enums/eAuditLoggingRouteNames (v3.0.0)', () => {
  describe('enum values', () => {
    it('should have AuditLogging key with correct value', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toBe(
        'AbpAuditLogging::Menu:AuditLogging'
      );
    });

    it('should not have Administration key (moved to @abpjs/core in v3.0.0)', () => {
      expect((eAuditLoggingRouteNames as any).Administration).toBeUndefined();
    });
  });

  describe('enum structure', () => {
    it('should have exactly 1 key', () => {
      const keys = Object.keys(eAuditLoggingRouteNames);
      expect(keys).toHaveLength(1);
    });

    it('should only contain AuditLogging key', () => {
      const keys = Object.keys(eAuditLoggingRouteNames);
      expect(keys).toEqual(['AuditLogging']);
    });

    it('should be an object', () => {
      expect(typeof eAuditLoggingRouteNames).toBe('object');
      expect(eAuditLoggingRouteNames).not.toBeNull();
    });
  });

  describe('type safety', () => {
    it('should work with AuditLoggingRouteNameKey type', () => {
      const routeKey: AuditLoggingRouteNameKey =
        eAuditLoggingRouteNames.AuditLogging;
      expect(routeKey).toBe('AbpAuditLogging::Menu:AuditLogging');
    });

    it('should preserve literal types', () => {
      const exactValue: 'AbpAuditLogging::Menu:AuditLogging' =
        eAuditLoggingRouteNames.AuditLogging;
      expect(exactValue).toBe('AbpAuditLogging::Menu:AuditLogging');
    });
  });

  describe('localization key format', () => {
    it('should use AbpAuditLogging namespace', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toMatch(/^AbpAuditLogging::/);
    });

    it('should use Menu prefix', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toContain('Menu:');
    });

    it('should follow ABP localization key format (Namespace::Key)', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toMatch(/^[A-Za-z]+::[A-Za-z]+:[A-Za-z]+$/);
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all route name values', () => {
      const allValues = Object.values(eAuditLoggingRouteNames);
      expect(allValues).toHaveLength(1);
      expect(allValues).toContain('AbpAuditLogging::Menu:AuditLogging');
    });

    it('should work as route configuration key', () => {
      const routeConfig = {
        [eAuditLoggingRouteNames.AuditLogging]: '/audit-logging',
      };
      expect(routeConfig[eAuditLoggingRouteNames.AuditLogging]).toBe('/audit-logging');
    });
  });
});
