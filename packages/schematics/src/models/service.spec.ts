/**
 * Service Model Tests
 */

import { describe, expect, it } from 'vitest';
import { eImportKeyword } from '../enums';
import { Import } from './import';
import { Body, Method, Signature } from './method';
import { Service } from './service';

describe('Service', () => {
  it('should create with minimal options', () => {
    const service = new Service({
      apiName: 'default',
      name: 'UserService',
      namespace: 'MyApp.Users',
    });

    expect(service.apiName).toBe('default');
    expect(service.name).toBe('UserService');
    expect(service.namespace).toBe('MyApp.Users');
    expect(service.imports).toEqual([]);
    expect(service.methods).toEqual([]);
  });

  it('should create with imports', () => {
    const imports = [
      new Import({
        path: '@abpjs/core',
        keyword: eImportKeyword.Default,
        specifiers: ['RestService'],
      }),
    ];

    const service = new Service({
      apiName: 'default',
      name: 'UserService',
      namespace: 'MyApp.Users',
      imports,
    });

    expect(service.imports).toHaveLength(1);
    expect(service.imports[0].path).toBe('@abpjs/core');
  });

  it('should create with methods', () => {
    const methods = [
      new Method({
        signature: new Signature({ name: 'getUser' }),
        body: new Body({
          method: 'GET',
          responseType: 'UserDto',
          url: '/api/users/{id}',
        }),
      }),
    ];

    const service = new Service({
      apiName: 'default',
      name: 'UserService',
      namespace: 'MyApp.Users',
      methods,
    });

    expect(service.methods).toHaveLength(1);
    expect(service.methods[0].signature.name).toBe('getUser');
  });

  it('should allow adding methods after creation', () => {
    const service = new Service({
      apiName: 'default',
      name: 'TestService',
      namespace: 'MyApp',
    });

    service.methods.push(
      new Method({
        signature: new Signature({ name: 'testMethod' }),
        body: new Body({
          method: 'POST',
          responseType: 'void',
          url: '/api/test',
        }),
      })
    );

    expect(service.methods).toHaveLength(1);
    expect(service.methods[0].signature.name).toBe('testMethod');
  });

  it('should allow adding imports after creation', () => {
    const service = new Service({
      apiName: 'default',
      name: 'TestService',
      namespace: 'MyApp',
    });

    service.imports.push(new Import({ path: './models' }));

    expect(service.imports).toHaveLength(1);
    expect(service.imports[0].path).toBe('./models');
  });
});
