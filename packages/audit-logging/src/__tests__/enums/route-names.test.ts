/**
 * Tests for eAuditLoggingRouteNames
 * @abpjs/audit-logging v2.7.0
 */
import { describe, it, expect } from 'vitest';
import {
  eAuditLoggingRouteNames,
  type AuditLoggingRouteNameKey,
} from '../../enums/route-names';

describe('eAuditLoggingRouteNames (v2.7.0)', () => {
  describe('enum values', () => {
    it('should have Administration key with correct value', () => {
      expect(eAuditLoggingRouteNames.Administration).toBe(
        'AbpUiNavigation::Menu:Administration'
      );
    });

    it('should have AuditLogging key with correct value', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toBe(
        'AbpAuditLogging::Menu:AuditLogging'
      );
    });
  });

  describe('enum structure', () => {
    it('should have exactly 2 keys', () => {
      const keys = Object.keys(eAuditLoggingRouteNames);
      expect(keys).toHaveLength(2);
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(eAuditLoggingRouteNames);
      expect(keys).toContain('Administration');
      expect(keys).toContain('AuditLogging');
    });

    it('should be immutable (const assertion)', () => {
      expect(typeof eAuditLoggingRouteNames).toBe('object');
      expect(eAuditLoggingRouteNames).not.toBeNull();
    });
  });

  describe('type safety', () => {
    it('should work with AuditLoggingRouteNameKey type', () => {
      const adminKey: AuditLoggingRouteNameKey =
        eAuditLoggingRouteNames.Administration;
      const auditKey: AuditLoggingRouteNameKey =
        eAuditLoggingRouteNames.AuditLogging;

      expect(adminKey).toBe('AbpUiNavigation::Menu:Administration');
      expect(auditKey).toBe('AbpAuditLogging::Menu:AuditLogging');
    });

    it('should preserve literal types', () => {
      const value = eAuditLoggingRouteNames.AuditLogging;
      expect(value).toBe('AbpAuditLogging::Menu:AuditLogging');

      const exactValue: 'AbpAuditLogging::Menu:AuditLogging' =
        eAuditLoggingRouteNames.AuditLogging;
      expect(exactValue).toBe('AbpAuditLogging::Menu:AuditLogging');
    });
  });

  describe('localization key format', () => {
    it('should use AbpUiNavigation namespace for Administration', () => {
      expect(eAuditLoggingRouteNames.Administration).toContain(
        'AbpUiNavigation::'
      );
    });

    it('should use AbpAuditLogging namespace for AuditLogging', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toContain(
        'AbpAuditLogging::'
      );
    });

    it('should use Menu prefix for menu-related routes', () => {
      expect(eAuditLoggingRouteNames.Administration).toContain('Menu:');
      expect(eAuditLoggingRouteNames.AuditLogging).toContain('Menu:');
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all route name keys', () => {
      const allKeys = Object.values(eAuditLoggingRouteNames);
      expect(allKeys).toHaveLength(2);
    });

    it('should allow lookup by key name', () => {
      const keyName = 'AuditLogging' as keyof typeof eAuditLoggingRouteNames;
      const value = eAuditLoggingRouteNames[keyName];
      expect(value).toBe('AbpAuditLogging::Menu:AuditLogging');
    });

    it('should work in switch statements', () => {
      const getRouteLabel = (): AuditLoggingRouteNameKey =>
        eAuditLoggingRouteNames.AuditLogging;
      const routeName = getRouteLabel();
      let label: string;

      switch (routeName) {
        case eAuditLoggingRouteNames.Administration:
          label = 'Administration Menu';
          break;
        case eAuditLoggingRouteNames.AuditLogging:
          label = 'Audit Logging Menu';
          break;
        default:
          label = 'Unknown';
      }

      expect(label).toBe('Audit Logging Menu');
    });

    it('should work as object keys for route configuration', () => {
      const routeConfig: Record<AuditLoggingRouteNameKey, { path: string }> = {
        [eAuditLoggingRouteNames.Administration]: { path: '/administration' },
        [eAuditLoggingRouteNames.AuditLogging]: {
          path: '/administration/audit-logs',
        },
      };

      expect(
        routeConfig[
          eAuditLoggingRouteNames.AuditLogging as AuditLoggingRouteNameKey
        ].path
      ).toBe('/administration/audit-logs');
    });

    it('should allow mapping to localized strings', () => {
      const localizations: Record<AuditLoggingRouteNameKey, string> = {
        [eAuditLoggingRouteNames.Administration]: 'Administration',
        [eAuditLoggingRouteNames.AuditLogging]: 'Audit Logging',
      };

      expect(
        localizations[
          eAuditLoggingRouteNames.AuditLogging as AuditLoggingRouteNameKey
        ]
      ).toBe('Audit Logging');
    });
  });
});
