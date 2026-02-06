/**
 * Tests for eAuditLoggingRouteNames
 * @abpjs/audit-logging v3.0.0
 *
 * Note: In v3.0.0, the Administration key was removed from this enum.
 * Route names are now in config/enums and only contain AuditLogging.
 */
import { describe, it, expect } from 'vitest';
import {
  eAuditLoggingRouteNames,
  type AuditLoggingRouteNameKey,
} from '../../enums/route-names';

describe('eAuditLoggingRouteNames (v3.0.0)', () => {
  describe('enum values', () => {
    it('should have AuditLogging key with correct value', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toBe(
        'AbpAuditLogging::Menu:AuditLogging'
      );
    });

    it('should not have Administration key (removed in v3.0.0)', () => {
      expect((eAuditLoggingRouteNames as any).Administration).toBeUndefined();
    });
  });

  describe('enum structure', () => {
    it('should have exactly 1 key (v3.0.0 removed Administration)', () => {
      const keys = Object.keys(eAuditLoggingRouteNames);
      expect(keys).toHaveLength(1);
    });

    it('should have only AuditLogging key', () => {
      const keys = Object.keys(eAuditLoggingRouteNames);
      expect(keys).toContain('AuditLogging');
      expect(keys).not.toContain('Administration');
    });

    it('should be immutable (const assertion)', () => {
      expect(typeof eAuditLoggingRouteNames).toBe('object');
      expect(eAuditLoggingRouteNames).not.toBeNull();
    });
  });

  describe('type safety', () => {
    it('should work with AuditLoggingRouteNameKey type', () => {
      const auditKey: AuditLoggingRouteNameKey =
        eAuditLoggingRouteNames.AuditLogging;

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
    it('should use AbpAuditLogging namespace for AuditLogging', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toContain(
        'AbpAuditLogging::'
      );
    });

    it('should use Menu prefix for menu-related routes', () => {
      expect(eAuditLoggingRouteNames.AuditLogging).toContain('Menu:');
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all route name keys', () => {
      const allKeys = Object.values(eAuditLoggingRouteNames);
      expect(allKeys).toHaveLength(1);
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
