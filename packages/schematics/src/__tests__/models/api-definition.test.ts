/**
 * API Definition Types Tests
 */

import { describe, expect, it } from 'vitest';
import { eBindingSourceId } from '../../enums';
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
} from '../../models/api-definition';

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
            type: 'System.String',
            typeSimple: 'string',
            isRequired: false,
          },
        ],
      };

      expect(type.baseType).toBe('System.Object');
      expect(type.isEnum).toBe(false);
      expect(type.properties).toHaveLength(1);
    });

    it('should support properties with isRequired field (v4.0.0)', () => {
      const type: Type = {
        baseType: null,
        isEnum: false,
        enumNames: null,
        enumValues: null,
        genericArguments: null,
        properties: [
          {
            name: 'UserName',
            type: 'System.String',
            typeSimple: 'string',
            isRequired: true,
          },
          {
            name: 'Email',
            type: 'System.String',
            typeSimple: 'string?',
            isRequired: false,
          },
        ],
      };

      expect(type.properties).toHaveLength(2);
      expect(type.properties![0].isRequired).toBe(true);
      expect(type.properties![1].isRequired).toBe(false);
    });
  });

  describe('PropertyDef', () => {
    it('should be correctly typed', () => {
      const property: PropertyDef = {
        name: 'Name',
        type: 'System.String',
        typeSimple: 'string',
        isRequired: true,
      };

      expect(property.name).toBe('Name');
      expect(property.type).toBe('System.String');
      expect(property.typeSimple).toBe('string');
      expect(property.isRequired).toBe(true);
    });

    it('should support isRequired=false for optional properties (v4.0.0)', () => {
      const property: PropertyDef = {
        name: 'Email',
        type: 'System.String',
        typeSimple: 'string?',
        isRequired: false,
      };

      expect(property.isRequired).toBe(false);
      expect(property.typeSimple).toBe('string?');
    });

    it('should support isRequired=true for required properties (v4.0.0)', () => {
      const property: PropertyDef = {
        name: 'UserName',
        type: 'System.String',
        typeSimple: 'string',
        isRequired: true,
      };

      expect(property.isRequired).toBe(true);
      expect(property.typeSimple).toBe('string');
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
            type: 'System.Guid',
            typeSimple: 'string',
            isOptional: false,
            defaultValue: null,
            constraintTypes: null,
            bindingSourceId: eBindingSourceId.Path,
            descriptorName: '',
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
        type: 'MyApp.CreateUserDto',
        typeSimple: 'MyApp.CreateUserDto',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        bindingSourceId: eBindingSourceId.Body,
        descriptorName: '',
      };

      expect(param.nameOnMethod).toBe('input');
      expect(param.bindingSourceId).toBe(eBindingSourceId.Body);
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
        isEnum: true,
        type: 'MyApp.UserStatus',
      };

      expect(typeWithEnum.isEnum).toBe(true);
      expect(typeWithEnum.type).toBe('MyApp.UserStatus');
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
