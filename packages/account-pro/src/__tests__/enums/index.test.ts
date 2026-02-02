import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../enums';
import {
  eAccountComponents,
  type AccountComponentKey,
} from '../../enums/components';
import {
  eAccountRouteNames,
  type AccountRouteNameKey,
} from '../../enums/route-names';

describe('enums barrel export (v2.7.0)', () => {
  describe('re-exports', () => {
    it('should export eAccountComponents', () => {
      expect(enumsExports.eAccountComponents).toBeDefined();
      expect(enumsExports.eAccountComponents).toBe(eAccountComponents);
    });

    it('should export eAccountRouteNames', () => {
      expect(enumsExports.eAccountRouteNames).toBeDefined();
      expect(enumsExports.eAccountRouteNames).toBe(eAccountRouteNames);
    });
  });

  describe('type exports', () => {
    it('should allow using AccountComponentKey type from barrel export', () => {
      const key: AccountComponentKey = enumsExports.eAccountComponents.Login;
      expect(key).toBe('Account.LoginComponent');
    });

    it('should allow using AccountRouteNameKey type from barrel export', () => {
      const key: AccountRouteNameKey = enumsExports.eAccountRouteNames.Login;
      expect(key).toBe('AbpAccount::Login');
    });
  });

  describe('export completeness', () => {
    it('should export exactly the expected named exports', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys).toContain('eAccountComponents');
      expect(exportKeys).toContain('eAccountRouteNames');
      // Should only have the two enum exports (types are not runtime exports)
      expect(exportKeys).toHaveLength(2);
    });
  });
});
