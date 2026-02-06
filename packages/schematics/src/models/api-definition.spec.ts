/**
 * API Definition Types Tests
 */

import { describe, expect, it } from 'vitest';
import type {
  Action,
  ApiDefinition,
  Controller,
  Module,
  ParameterInBody,
  ParameterInSignature,
  PropertyDef,
  Type,
  TypeDef,
  TypeWithEnum,
} from './api-definition';

describe('API Definition Types', () => {
  describe('Type', () => {
    it('should be correctly typed', () => {
      const type: Type = {
        baseType: 'System.Object',
        isEnum: false,
        enumNames: null,
        enumValues: null,
        genericArguments: ['System.String'],
        properties: [
          {
            name: 'Id',
            jsonName: 'id',
            type: 'System.String',
            typeSimple: 'string',
            isRequired: true,
          },
        ],
      };

      expect(type.baseType).toBe('System.Object');
      expect(type.isEnum).toBe(false);
      expect(type.properties).toHaveLength(1);
    });
  });

  describe('PropertyDef', () => {
    it('should be correctly typed', () => {
      const property: PropertyDef = {
        name: 'Name',
        jsonName: 'name',
        type: 'System.String',
        typeSimple: 'string',
        isRequired: false,
      };

      expect(property.name).toBe('Name');
      expect(property.jsonName).toBe('name');
      expect(property.isRequired).toBe(false);
    });
  });

  describe('Module', () => {
    it('should be correctly typed', () => {
      const module: Module = {
        rootPath: 'app',
        remoteServiceName: 'Default',
        controllers: {},
      };

      expect(module.rootPath).toBe('app');
      expect(module.remoteServiceName).toBe('Default');
      expect(module.controllers).toEqual({});
    });
  });

  describe('Controller', () => {
    it('should be correctly typed', () => {
      const controller: Controller = {
        controllerName: 'UserController',
        type: 'MyApp.Controllers.UserController',
        interfaces: [
          {
            type: 'MyApp.IUserAppService',
          },
        ],
        actions: {},
      };

      expect(controller.controllerName).toBe('UserController');
      expect(controller.interfaces).toHaveLength(1);
    });
  });

  describe('Action', () => {
    it('should be correctly typed', () => {
      const action: Action = {
        uniqueName: 'GetUser',
        name: 'GetAsync',
        httpMethod: 'GET',
        url: 'api/users/{id}',
        supportedVersions: [],
        parametersOnMethod: [
          {
            name: 'id',
            typeAsString: 'System.Guid',
            type: 'System.Guid',
            typeSimple: 'string',
            isOptional: false,
            defaultValue: null,
          },
        ],
        parameters: [
          {
            nameOnMethod: 'id',
            name: 'id',
            jsonName: 'id',
            type: 'System.Guid',
            typeSimple: 'string',
            isOptional: false,
            bindingSourceId: 'Path',
            descriptorName: null,
          },
        ],
        returnValue: {
          type: 'MyApp.UserDto',
          typeSimple: 'MyApp.UserDto',
        },
      };

      expect(action.uniqueName).toBe('GetUser');
      expect(action.httpMethod).toBe('GET');
      expect(action.parametersOnMethod).toHaveLength(1);
      expect(action.parameters).toHaveLength(1);
    });
  });

  describe('ParameterInSignature', () => {
    it('should be correctly typed', () => {
      const param: ParameterInSignature = {
        name: 'id',
        typeAsString: 'System.Guid',
        type: 'System.Guid',
        typeSimple: 'string',
        isOptional: false,
        defaultValue: null,
      };

      expect(param.name).toBe('id');
      expect(param.isOptional).toBe(false);
    });
  });

  describe('ParameterInBody', () => {
    it('should be correctly typed', () => {
      const param: ParameterInBody = {
        nameOnMethod: 'input',
        name: 'Input',
        jsonName: 'input',
        type: 'MyApp.CreateUserDto',
        typeSimple: 'MyApp.CreateUserDto',
        isOptional: false,
        bindingSourceId: 'Body',
        descriptorName: null,
      };

      expect(param.nameOnMethod).toBe('input');
      expect(param.bindingSourceId).toBe('Body');
    });
  });

  describe('TypeDef', () => {
    it('should be correctly typed', () => {
      const typeDef: TypeDef = {
        type: 'MyApp.UserDto',
        typeSimple: 'MyApp.UserDto',
      };

      expect(typeDef.type).toBe('MyApp.UserDto');
    });
  });

  describe('TypeWithEnum', () => {
    it('should be correctly typed', () => {
      const typeWithEnum: TypeWithEnum = {
        baseType: null,
        isEnum: true,
        enumNames: ['Active', 'Inactive'],
        enumValues: [1, 0],
        genericArguments: null,
        properties: null,
      };

      expect(typeWithEnum.isEnum).toBe(true);
      expect(typeWithEnum.enumNames).toEqual(['Active', 'Inactive']);
      expect(typeWithEnum.enumValues).toEqual([1, 0]);
    });
  });

  describe('ApiDefinition', () => {
    it('should be correctly typed', () => {
      const apiDefinition: ApiDefinition = {
        modules: {
          app: {
            rootPath: 'app',
            remoteServiceName: 'Default',
            controllers: {},
          },
        },
        types: {
          'System.String': {
            baseType: null,
            isEnum: false,
            enumNames: null,
            enumValues: null,
            genericArguments: null,
            properties: null,
          },
        },
      };

      expect(apiDefinition.modules).toBeDefined();
      expect(apiDefinition.types).toBeDefined();
      expect(apiDefinition.modules['app']).toBeDefined();
    });
  });
});
