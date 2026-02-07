/**
 * Enum Generation Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import {
  isEnumImport,
  getEnumNamesFromImports,
  createImportRefToEnumMapper,
} from '../../utils/enum';
import type { EnumDescriptor } from '../../utils/enum';

describe('Enum Utils', () => {
  describe('isEnumImport', () => {
    it('should return true for .enum paths', () => {
      expect(isEnumImport('./user-status.enum')).toBe(true);
    });

    it('should return true for relative .enum paths', () => {
      expect(isEnumImport('../shared/status.enum')).toBe(true);
    });

    it('should return false for non-enum paths', () => {
      expect(isEnumImport('./models')).toBe(false);
    });

    it('should return false for .enum in the middle of path', () => {
      expect(isEnumImport('./enum-utils')).toBe(false);
    });
  });

  describe('getEnumNamesFromImports', () => {
    it('should collect refs from enum imports', () => {
      const serviceImports = {
        './user-status.enum': ['MyApp.UserStatus'],
        './models': ['MyApp.UserDto'],
        '../shared/role-type.enum': ['MyApp.RoleType'],
      };

      const result = getEnumNamesFromImports(serviceImports);
      expect(result).toEqual(['MyApp.UserStatus', 'MyApp.RoleType']);
    });

    it('should return empty array when no enum imports', () => {
      const serviceImports = {
        './models': ['MyApp.UserDto'],
      };

      const result = getEnumNamesFromImports(serviceImports);
      expect(result).toEqual([]);
    });

    it('should handle empty imports', () => {
      const result = getEnumNamesFromImports({});
      expect(result).toEqual([]);
    });

    it('should collect multiple refs from same enum path', () => {
      const serviceImports = {
        './status.enum': ['MyApp.Status', 'MyApp.SubStatus'],
      };

      const result = getEnumNamesFromImports(serviceImports);
      expect(result).toEqual(['MyApp.Status', 'MyApp.SubStatus']);
    });
  });

  describe('createImportRefToEnumMapper', () => {
    const types = {
      'MyCompany.MyProduct.Users.UserStatus': {
        baseType: null,
        genericArguments: null,
        isEnum: true,
        enumNames: ['Active', 'Inactive', 'Suspended'],
        enumValues: [0, 1, 2],
        properties: null,
      },
      'MyCompany.MyProduct.Roles.RoleType': {
        baseType: null,
        genericArguments: null,
        isEnum: true,
        enumNames: ['Admin', 'User'],
        enumValues: [1, 2],
        properties: null,
      },
    };

    it('should map type ref to enum descriptor', () => {
      const mapToEnum = createImportRefToEnumMapper({
        solution: 'MyCompany.MyProduct',
        types: types as any,
      });

      const result: EnumDescriptor = mapToEnum('MyCompany.MyProduct.Users.UserStatus');
      expect(result.name).toBe('UserStatus');
      expect(result.namespace).toBe('Users');
      expect(result.members).toHaveLength(3);
      expect(result.members[0]).toEqual({ key: 'Active', value: 0 });
      expect(result.members[1]).toEqual({ key: 'Inactive', value: 1 });
      expect(result.members[2]).toEqual({ key: 'Suspended', value: 2 });
    });

    it('should handle different enum values', () => {
      const mapToEnum = createImportRefToEnumMapper({
        solution: 'MyCompany.MyProduct',
        types: types as any,
      });

      const result = mapToEnum('MyCompany.MyProduct.Roles.RoleType');
      expect(result.name).toBe('RoleType');
      expect(result.members).toHaveLength(2);
      expect(result.members[0]).toEqual({ key: 'Admin', value: 1 });
    });

    it('should throw for missing enum data', () => {
      const badTypes = {
        'MyApp.BadEnum': {
          baseType: null,
          genericArguments: null,
          isEnum: true,
          enumNames: null,
          enumValues: null,
          properties: null,
        },
      };

      const mapToEnum = createImportRefToEnumMapper({
        solution: 'MyApp',
        types: badTypes as any,
      });

      expect(() => mapToEnum('MyApp.BadEnum')).toThrow();
    });
  });
});
