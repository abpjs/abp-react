/**
 * Model Classes Tests
 */

import { describe, expect, it } from 'vitest';
import { Interface, Model, Property } from './model';

describe('Property', () => {
  it('should create with minimal options', () => {
    const property = new Property({
      name: 'id',
      type: 'string',
    });

    expect(property.name).toBe('id');
    expect(property.type).toBe('string');
    expect(property.default).toBe('');
    expect(property.optional).toBe('');
    expect(property.refs).toEqual([]);
  });

  it('should create with all options', () => {
    const property = new Property({
      name: 'count',
      type: 'number',
      default: '0',
      optional: '?',
      refs: ['System.Int32'],
    });

    expect(property.name).toBe('count');
    expect(property.type).toBe('number');
    expect(property.default).toBe('0');
    expect(property.optional).toBe('?');
    expect(property.refs).toEqual(['System.Int32']);
  });

  it('should override default values', () => {
    const property = new Property({
      name: 'items',
      type: 'string[]',
      default: '[]',
      optional: '?',
      refs: ['System.String'],
    });

    expect(property.default).toBe('[]');
    expect(property.optional).toBe('?');
    expect(property.refs).toEqual(['System.String']);
  });
});

describe('Interface', () => {
  it('should create with minimal options', () => {
    const interfaceItem = new Interface({
      base: null,
      identifier: 'UserDto',
      namespace: 'MyApp.Users',
      ref: 'MyApp.Users.UserDto',
    });

    expect(interfaceItem.base).toBeNull();
    expect(interfaceItem.identifier).toBe('UserDto');
    expect(interfaceItem.namespace).toBe('MyApp.Users');
    expect(interfaceItem.ref).toBe('MyApp.Users.UserDto');
    expect(interfaceItem.properties).toEqual([]);
  });

  it('should create with properties', () => {
    const properties = [
      new Property({ name: 'id', type: 'string' }),
      new Property({ name: 'name', type: 'string' }),
    ];

    const interfaceItem = new Interface({
      base: 'BaseDto',
      identifier: 'UserDto',
      namespace: 'MyApp.Users',
      ref: 'MyApp.Users.UserDto',
      properties,
    });

    expect(interfaceItem.base).toBe('BaseDto');
    expect(interfaceItem.properties).toHaveLength(2);
    expect(interfaceItem.properties[0].name).toBe('id');
    expect(interfaceItem.properties[1].name).toBe('name');
  });

  it('should have base as string when extending', () => {
    const interfaceItem = new Interface({
      base: 'EntityDto<string>',
      identifier: 'UserDto',
      namespace: 'MyApp.Users',
      ref: 'MyApp.Users.UserDto',
    });

    expect(interfaceItem.base).toBe('EntityDto<string>');
  });
});

describe('Model', () => {
  it('should create with minimal options', () => {
    const model = new Model({
      namespace: 'MyApp.Users',
      path: 'src/proxy/users',
    });

    expect(model.namespace).toBe('MyApp.Users');
    expect(model.path).toBe('src/proxy/users');
    expect(model.imports).toEqual([]);
    expect(model.interfaces).toEqual([]);
  });

  it('should create with interfaces', () => {
    const interfaces = [
      new Interface({
        base: null,
        identifier: 'UserDto',
        namespace: 'MyApp.Users',
        ref: 'MyApp.Users.UserDto',
      }),
    ];

    const model = new Model({
      namespace: 'MyApp.Users',
      path: 'src/proxy/users',
      interfaces,
    });

    expect(model.interfaces).toHaveLength(1);
    expect(model.interfaces[0].identifier).toBe('UserDto');
  });

  it('should allow adding interfaces after creation', () => {
    const model = new Model({
      namespace: 'MyApp',
      path: 'src/proxy',
    });

    model.interfaces.push(
      new Interface({
        base: null,
        identifier: 'TestDto',
        namespace: 'MyApp',
        ref: 'MyApp.TestDto',
      })
    );

    expect(model.interfaces).toHaveLength(1);
  });
});
