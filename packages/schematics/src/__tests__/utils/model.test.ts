/**
 * Model / Interface Generation Utilities Tests
 *
 * Tests for createImportRefToInterfaceReducerCreator, createImportRefsToModelReducer,
 * and createRefToImportReducerCreator — covering v4.0.0 isRequired field and
 * cross-namespace import resolution.
 */

import { describe, expect, it } from 'vitest';
import type { Type } from '../../models/api-definition';
import {
  createImportRefToInterfaceReducerCreator,
  createImportRefsToModelReducer,
  createRefToImportReducerCreator,
  type ModelGeneratorParams,
} from '../../utils/model';

function makeType(overrides: Partial<Type> = {}): Type {
  return {
    baseType: null,
    isEnum: false,
    enumNames: null,
    enumValues: null,
    genericArguments: null,
    properties: null,
    ...overrides,
  };
}

describe('Model Generation Utilities', () => {
  describe('createImportRefToInterfaceReducerCreator', () => {
    it('should convert a simple type to an Interface with properties', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
              { name: 'UserName', type: 'System.String', typeSimple: 'string', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Users.UserDto');

      expect(interfaces).toHaveLength(1);
      expect(interfaces[0].identifier).toBe('UserDto');
      expect(interfaces[0].namespace).toBe('Users');
      expect(interfaces[0].properties).toHaveLength(2);
      expect(interfaces[0].properties[0].name).toBe('id');
      expect(interfaces[0].properties[1].name).toBe('userName');
    });

    it('should mark optional properties from typeSimple ending with ?', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Email', type: 'System.String', typeSimple: 'string?', isRequired: false },
              { name: 'Name', type: 'System.String', typeSimple: 'string', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Users.UserDto');

      expect(interfaces[0].properties[0].optional).toBe('?');
      expect(interfaces[0].properties[1].optional).toBe('');
    });

    it('should handle type with no properties (null)', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({ properties: null }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Users.UserDto');

      expect(interfaces).toHaveLength(1);
      expect(interfaces[0].properties).toHaveLength(0);
    });

    it('should return early for unknown type reference', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {},
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.NonExistent.Type');

      expect(interfaces).toHaveLength(0);
    });

    it('should resolve base type identifier', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.AdminDto': makeType({
            baseType: 'MyApp.Users.UserDto',
            properties: [
              { name: 'AdminLevel', type: 'System.Int32', typeSimple: 'number', isRequired: true },
            ],
          }),
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
            ],
          }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Users.AdminDto');

      // AdminDto should have base set
      const adminInterface = interfaces.find((i) => i.identifier === 'AdminDto');
      expect(adminInterface?.base).toBe('UserDto');

      // Should also recursively resolve the base type
      expect(interfaces).toHaveLength(2);
      const userInterface = interfaces.find((i) => i.identifier === 'UserDto');
      expect(userInterface).toBeDefined();
    });

    it('should recursively resolve property type references', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              {
                name: 'Address',
                type: 'MyApp.Users.AddressDto',
                typeSimple: 'MyApp.Users.AddressDto',
                isRequired: false,
              },
            ],
          }),
          'MyApp.Users.AddressDto': makeType({
            properties: [
              { name: 'Street', type: 'System.String', typeSimple: 'string', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Users.UserDto');

      expect(interfaces).toHaveLength(2);
      expect(interfaces.some((i) => i.identifier === 'AddressDto')).toBe(true);
    });

    it('should handle generic type arguments in identifier', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Shared.PagedResultDto': makeType({
            genericArguments: ['T0'],
            properties: [
              { name: 'Items', type: 'System.Collections.Generic.List<T0>', typeSimple: '[T0]', isRequired: true },
              { name: 'TotalCount', type: 'System.Int32', typeSimple: 'number', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Shared.PagedResultDto');

      expect(interfaces).toHaveLength(1);
      // T0 is replaced by generic argument value
      expect(interfaces[0].identifier).toBe('PagedResultDto');
    });

    it('should not recurse into enum type references', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              {
                name: 'Status',
                type: 'MyApp.Users.UserStatus',
                typeSimple: 'MyApp.Users.UserStatus',
                isRequired: true,
              },
            ],
          }),
          'MyApp.Users.UserStatus': makeType({
            isEnum: true,
            enumNames: ['Active', 'Inactive'],
            enumValues: [0, 1],
          }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Users.UserDto');

      // Should only have UserDto, not the enum
      expect(interfaces).toHaveLength(1);
      expect(interfaces[0].identifier).toBe('UserDto');
    });
  });

  describe('createImportRefsToModelReducer', () => {
    it('should group interfaces by namespace into models', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
            ],
          }),
          'MyApp.Users.RoleDto': makeType({
            properties: [
              { name: 'Name', type: 'System.String', typeSimple: 'string', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.UserDto', 'MyApp.Users.RoleDto']);

      // Both should be in the same model (same namespace)
      expect(models).toHaveLength(1);
      expect(models[0].namespace).toBe('Users');
      expect(models[0].interfaces).toHaveLength(2);
    });

    it('should create separate models for different namespaces', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
            ],
          }),
          'MyApp.Products.ProductDto': makeType({
            properties: [
              { name: 'Name', type: 'System.String', typeSimple: 'string', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.UserDto', 'MyApp.Products.ProductDto']);

      expect(models).toHaveLength(2);
      const namespaces = models.map((m) => m.namespace).sort();
      expect(namespaces).toEqual(['Products', 'Users']);
    });

    it('should skip enum types', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserStatus': makeType({
            isEnum: true,
            enumNames: ['Active', 'Inactive'],
            enumValues: [0, 1],
          }),
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.UserDto', 'MyApp.Users.UserStatus']);

      // Only the non-enum type should be in a model
      expect(models).toHaveLength(1);
      expect(models[0].interfaces).toHaveLength(1);
      expect(models[0].interfaces[0].identifier).toBe('UserDto');
    });

    it('should not duplicate interfaces in same model', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      // Pass same ref twice
      const models = reducer([], ['MyApp.Users.UserDto', 'MyApp.Users.UserDto']);

      expect(models).toHaveLength(1);
      expect(models[0].interfaces).toHaveLength(1);
    });

    it('should resolve cross-namespace base type imports', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.AdminDto': makeType({
            baseType: 'MyApp.Shared.BaseDto',
            properties: [
              { name: 'AdminLevel', type: 'System.Int32', typeSimple: 'number', isRequired: true },
            ],
          }),
          'MyApp.Shared.BaseDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.AdminDto']);

      // Should have two models: Users and Shared
      expect(models).toHaveLength(2);

      const usersModel = models.find((m) => m.namespace === 'Users');
      expect(usersModel).toBeDefined();
      // Users model should have imports for the cross-namespace base type
      expect(usersModel!.imports.length).toBeGreaterThan(0);
    });

    it('should resolve cross-namespace property type imports', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              {
                name: 'Address',
                type: 'MyApp.Addresses.AddressDto',
                typeSimple: 'MyApp.Addresses.AddressDto',
                isRequired: false,
              },
            ],
          }),
          'MyApp.Addresses.AddressDto': makeType({
            properties: [
              { name: 'Street', type: 'System.String', typeSimple: 'string', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.UserDto']);

      expect(models).toHaveLength(2);

      const usersModel = models.find((m) => m.namespace === 'Users');
      expect(usersModel).toBeDefined();
      expect(usersModel!.imports.length).toBeGreaterThan(0);
    });

    it('should resolve enum type imports', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              {
                name: 'Status',
                type: 'MyApp.Users.UserStatus',
                typeSimple: 'MyApp.Users.UserStatus',
                isRequired: true,
              },
            ],
          }),
          'MyApp.Users.UserStatus': makeType({
            isEnum: true,
            enumNames: ['Active', 'Inactive'],
            enumValues: [0, 1],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.UserDto']);

      expect(models).toHaveLength(1);
      const usersModel = models[0];

      // Should have import for the enum
      expect(usersModel.imports.length).toBeGreaterThan(0);
    });

    it('should skip property refs with unknown types', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              {
                name: 'Unknown',
                type: 'MyApp.NonExistent.Dto',
                typeSimple: 'MyApp.NonExistent.Dto',
                isRequired: false,
              },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.UserDto']);

      expect(models).toHaveLength(1);
      // Should not crash and should have no imports for unknown types
      expect(models[0].imports).toHaveLength(0);
    });

    it('should accumulate into existing models array', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: false },
            ],
          }),
          'MyApp.Products.ProductDto': makeType({
            properties: [
              { name: 'Name', type: 'System.String', typeSimple: 'string', isRequired: true },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);

      // First call
      const models1 = reducer([], ['MyApp.Users.UserDto']);
      expect(models1).toHaveLength(1);

      // Second call accumulates into existing
      const models2 = reducer(models1, ['MyApp.Products.ProductDto']);
      expect(models2).toHaveLength(2);
    });
  });

  describe('createRefToImportReducerCreator', () => {
    it('should return a function scoped to a namespace', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {},
      };

      const createReducer = createRefToImportReducerCreator(params);
      expect(typeof createReducer).toBe('function');

      const reducer = createReducer('Users');
      expect(typeof reducer).toBe('function');
    });
  });

  describe('v4.0.0 isRequired integration', () => {
    it('should preserve isRequired through type definition in interface generation', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.CreateUserInput': makeType({
            properties: [
              { name: 'UserName', type: 'System.String', typeSimple: 'string', isRequired: true },
              { name: 'Email', type: 'System.String', typeSimple: 'string', isRequired: true },
              { name: 'PhoneNumber', type: 'System.String', typeSimple: 'string?', isRequired: false },
            ],
          }),
        },
      };

      const reducer = createImportRefToInterfaceReducerCreator(params);
      const interfaces = reducer([], 'MyApp.Users.CreateUserInput');

      expect(interfaces).toHaveLength(1);
      const props = interfaces[0].properties;
      expect(props).toHaveLength(3);

      // Required fields should not be optional
      expect(props[0].name).toBe('userName');
      expect(props[0].optional).toBe('');

      expect(props[1].name).toBe('email');
      expect(props[1].optional).toBe('');

      // Optional field (typeSimple ends with ?)
      expect(props[2].name).toBe('phoneNumber');
      expect(props[2].optional).toBe('?');
    });

    it('should handle mix of required and optional properties in model generation', () => {
      const params: ModelGeneratorParams = {
        solution: 'MyApp',
        types: {
          'MyApp.Users.UserDto': makeType({
            properties: [
              { name: 'Id', type: 'System.Guid', typeSimple: 'string', isRequired: true },
              { name: 'UserName', type: 'System.String', typeSimple: 'string', isRequired: true },
              { name: 'Bio', type: 'System.String', typeSimple: 'string?', isRequired: false },
              { name: 'AvatarUrl', type: 'System.String', typeSimple: 'string?', isRequired: false },
            ],
          }),
        },
      };

      const reducer = createImportRefsToModelReducer(params);
      const models = reducer([], ['MyApp.Users.UserDto']);

      expect(models).toHaveLength(1);
      const props = models[0].interfaces[0].properties;
      expect(props).toHaveLength(4);

      // Verify required/optional mapping
      const required = props.filter((p) => p.optional === '');
      const optional = props.filter((p) => p.optional === '?');
      expect(required).toHaveLength(2);
      expect(optional).toHaveLength(2);
    });
  });
});
