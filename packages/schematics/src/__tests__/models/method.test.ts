/**
 * Method Classes Tests
 */

import { describe, expect, it } from 'vitest';
import { eBindingSourceId, eMethodModifier } from '../../enums';
import { Body, Method, Signature } from '../../models/method';
import { Property } from '../../models/model';

describe('Signature', () => {
  it('should create with minimal options', () => {
    const signature = new Signature({
      name: 'getUser',
    });

    expect(signature.name).toBe('getUser');
    expect(signature.generics).toBe('');
    expect(signature.modifier).toBe(eMethodModifier.Public);
    expect(signature.parameters).toEqual([]);
    expect(signature.returnType).toBe('');
  });

  it('should create with all options', () => {
    const parameters = [new Property({ name: 'id', type: 'string' })];

    const signature = new Signature({
      name: 'getUser',
      generics: '<T>',
      modifier: eMethodModifier.Private,
      parameters,
      returnType: 'Observable<UserDto>',
    });

    expect(signature.name).toBe('getUser');
    expect(signature.generics).toBe('<T>');
    expect(signature.modifier).toBe(eMethodModifier.Private);
    expect(signature.parameters).toHaveLength(1);
    expect(signature.returnType).toBe('Observable<UserDto>');
  });

  it('should override default modifier', () => {
    const signature = new Signature({
      name: 'privateMethod',
      modifier: eMethodModifier.Private,
    });

    expect(signature.modifier).toBe(eMethodModifier.Private);
  });
});

describe('Body', () => {
  it('should create with minimal options', () => {
    const body = new Body({
      method: 'GET',
      responseType: 'UserDto',
      url: '/api/users/{id}',
    });

    expect(body.method).toBe('GET');
    expect(body.responseType).toBe('UserDto');
    expect(body.url).toBe('/api/users/{id}');
    expect(body.params).toEqual([]);
    expect(body.requestType).toBe('any');
    expect(body.body).toBeUndefined();
  });

  it('should create with all options', () => {
    const body = new Body({
      method: 'POST',
      responseType: 'UserDto',
      url: '/api/users',
      params: ['id: input.id'],
      requestType: 'CreateUserDto',
      body: 'input',
    });

    expect(body.method).toBe('POST');
    expect(body.params).toEqual(['id: input.id']);
    expect(body.requestType).toBe('CreateUserDto');
    expect(body.body).toBe('input');
  });

  describe('registerActionParameter', () => {
    it('should handle Query binding source', () => {
      const body = new Body({
        method: 'GET',
        responseType: 'void',
        url: '/api/test',
      });

      body.registerActionParameter({
        bindingSourceId: eBindingSourceId.Query,
        name: 'SearchText',
        nameOnMethod: 'searchText',
        type: 'System.String',
        typeSimple: 'string',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        descriptorName: '',
      });

      expect(body.params).toContain('searchText: searchText');
    });

    it('should handle Model binding source', () => {
      const body = new Body({
        method: 'GET',
        responseType: 'void',
        url: '/api/test',
      });

      body.registerActionParameter({
        bindingSourceId: eBindingSourceId.Model,
        name: 'Filter',
        nameOnMethod: 'filter',
        type: 'System.String',
        typeSimple: 'string',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        descriptorName: 'input',
      });

      expect(body.params).toContain('filter: input.filter');
    });

    it('should handle Body binding source', () => {
      const body = new Body({
        method: 'POST',
        responseType: 'void',
        url: '/api/test',
      });

      body.registerActionParameter({
        bindingSourceId: eBindingSourceId.Body,
        name: 'Input',
        nameOnMethod: 'input',
        type: 'MyApp.CreateInput',
        typeSimple: 'CreateInput',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        descriptorName: '',
      });

      expect(body.body).toBe('input');
    });

    it('should handle Path binding source', () => {
      const body = new Body({
        method: 'GET',
        responseType: 'void',
        url: '/api/users/{id}/roles/{roleId}',
      });

      body.registerActionParameter({
        bindingSourceId: eBindingSourceId.Path,
        name: 'Id',
        nameOnMethod: 'id',
        type: 'System.Guid',
        typeSimple: 'string',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        descriptorName: '',
      });

      expect(body.url).toBe('/api/users/${id}/roles/{roleId}');

      body.registerActionParameter({
        bindingSourceId: eBindingSourceId.Path,
        name: 'RoleId',
        nameOnMethod: 'roleId',
        type: 'System.Guid',
        typeSimple: 'string',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        descriptorName: '',
      });

      expect(body.url).toBe('/api/users/${id}/roles/${roleId}');
    });

    it('should use descriptorName for Path binding when provided', () => {
      const body = new Body({
        method: 'GET',
        responseType: 'void',
        url: '/api/items/{id}',
      });

      body.registerActionParameter({
        bindingSourceId: eBindingSourceId.Path,
        name: 'Id',
        nameOnMethod: 'id',
        type: 'System.Guid',
        typeSimple: 'string',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        descriptorName: 'params',
      });

      expect(body.url).toBe('/api/items/${params.id}');
    });

    it('should ignore unknown binding source', () => {
      const body = new Body({
        method: 'GET',
        responseType: 'void',
        url: '/api/test',
      });

      const originalUrl = body.url;
      const originalParams = [...body.params];
      const originalBody = body.body;

      // Pass an unknown binding source (cast to bypass type checking)
      body.registerActionParameter({
        bindingSourceId: 'Unknown' as eBindingSourceId,
        name: 'SomeParam',
        nameOnMethod: 'someParam',
        type: 'System.String',
        typeSimple: 'string',
        isOptional: false,
        defaultValue: null,
        constraintTypes: null,
        descriptorName: '',
      });

      // Nothing should change
      expect(body.url).toBe(originalUrl);
      expect(body.params).toEqual(originalParams);
      expect(body.body).toBe(originalBody);
    });
  });
});

describe('Method', () => {
  it('should create with body and signature', () => {
    const signature = new Signature({ name: 'getUser' });
    const body = new Body({
      method: 'GET',
      responseType: 'UserDto',
      url: '/api/users/{id}',
    });

    const method = new Method({ body, signature });

    expect(method.signature.name).toBe('getUser');
    expect(method.body.method).toBe('GET');
    expect(method.body.url).toBe('/api/users/{id}');
  });
});
