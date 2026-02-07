/**
 * API Generation Command Tests
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { generateApi } from '../../commands/api';
import type { ProxyConfig } from '../../models/proxy-config';

/**
 * Creates a minimal but realistic API definition for testing.
 */
function createMockApiDefinition() {
  return {
    modules: {
      app: {
        rootPath: 'app',
        remoteServiceName: 'default',
        controllers: {
          'MyCompany.MyProduct.Users.UserController': {
            controllerName: 'User',
            controllerGroupName: 'User',
            isRemoteService: true,
            isIntegrationService: false,
            apiVersion: null,
            type: 'MyCompany.MyProduct.Users.Controllers.UserController',
            interfaces: [],
            actions: {
              GetListAsyncByInput: {
                uniqueName: 'GetListAsync',
                name: 'GetListAsync',
                httpMethod: 'GET',
                url: 'api/app/users',
                supportedVersions: [],
                parametersOnMethod: [
                  {
                    name: 'input',
                    typeAsString: 'MyCompany.MyProduct.Users.GetUsersInput',
                    type: 'MyCompany.MyProduct.Users.GetUsersInput',
                    typeSimple: 'MyCompany.MyProduct.Users.GetUsersInput',
                    isOptional: true,
                    defaultValue: null,
                  },
                ],
                parameters: [
                  {
                    nameOnMethod: 'input',
                    name: 'Filter',
                    bindingSourceId: 'Query',
                    type: 'System.String',
                    typeSimple: 'string?',
                    isOptional: true,
                    defaultValue: null,
                    constraintTypes: null,
                    descriptorName: 'input',
                  },
                ],
                returnValue: {
                  type: 'Volo.Abp.Application.Dtos.PagedResultDto<MyCompany.MyProduct.Users.UserDto>',
                  typeSimple:
                    'Volo.Abp.Application.Dtos.PagedResultDto<MyCompany.MyProduct.Users.UserDto>',
                },
                allowAnonymous: null,
                implementFrom: null,
              },
              CreateAsyncByInput: {
                uniqueName: 'CreateAsync',
                name: 'CreateAsync',
                httpMethod: 'POST',
                url: 'api/app/users',
                supportedVersions: [],
                parametersOnMethod: [
                  {
                    name: 'input',
                    typeAsString: 'MyCompany.MyProduct.Users.CreateUserInput',
                    type: 'MyCompany.MyProduct.Users.CreateUserInput',
                    typeSimple: 'MyCompany.MyProduct.Users.CreateUserInput',
                    isOptional: false,
                    defaultValue: null,
                  },
                ],
                parameters: [
                  {
                    nameOnMethod: 'input',
                    name: 'input',
                    bindingSourceId: 'Body',
                    type: 'MyCompany.MyProduct.Users.CreateUserInput',
                    typeSimple: 'MyCompany.MyProduct.Users.CreateUserInput',
                    isOptional: false,
                    defaultValue: null,
                    constraintTypes: null,
                    descriptorName: '',
                  },
                ],
                returnValue: {
                  type: 'MyCompany.MyProduct.Users.UserDto',
                  typeSimple: 'MyCompany.MyProduct.Users.UserDto',
                },
                allowAnonymous: null,
                implementFrom: null,
              },
            },
          },
        },
      },
    },
    types: {
      'MyCompany.MyProduct.Users.UserDto': {
        baseType: null,
        genericArguments: null,
        isEnum: false,
        enumNames: null,
        enumValues: null,
        properties: [
          {
            name: 'Id',
            jsonName: null,
            type: 'System.Guid',
            typeSimple: 'string',
            isRequired: false,
            minLength: null,
            maxLength: null,
            minimum: null,
            maximum: null,
            regex: null,
          },
          {
            name: 'UserName',
            jsonName: null,
            type: 'System.String',
            typeSimple: 'string',
            isRequired: true,
            minLength: null,
            maxLength: 256,
            minimum: null,
            maximum: null,
            regex: null,
          },
          {
            name: 'Email',
            jsonName: null,
            type: 'System.String',
            typeSimple: 'string?',
            isRequired: false,
            minLength: null,
            maxLength: null,
            minimum: null,
            maximum: null,
            regex: null,
          },
        ],
      },
      'MyCompany.MyProduct.Users.GetUsersInput': {
        baseType: null,
        genericArguments: null,
        isEnum: false,
        enumNames: null,
        enumValues: null,
        properties: [
          {
            name: 'Filter',
            jsonName: null,
            type: 'System.String',
            typeSimple: 'string?',
            isRequired: false,
            minLength: null,
            maxLength: null,
            minimum: null,
            maximum: null,
            regex: null,
          },
        ],
      },
      'MyCompany.MyProduct.Users.CreateUserInput': {
        baseType: null,
        genericArguments: null,
        isEnum: false,
        enumNames: null,
        enumValues: null,
        properties: [
          {
            name: 'UserName',
            jsonName: null,
            type: 'System.String',
            typeSimple: 'string',
            isRequired: true,
            minLength: null,
            maxLength: 256,
            minimum: null,
            maximum: null,
            regex: null,
          },
          {
            name: 'Email',
            jsonName: null,
            type: 'System.String',
            typeSimple: 'string',
            isRequired: true,
            minLength: null,
            maxLength: null,
            minimum: null,
            maximum: null,
            regex: null,
          },
          {
            name: 'Password',
            jsonName: null,
            type: 'System.String',
            typeSimple: 'string',
            isRequired: true,
            minLength: null,
            maxLength: null,
            minimum: null,
            maximum: null,
            regex: null,
          },
        ],
      },
    },
  };
}

describe('API Generation', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should generate service file', async () => {
    const apiDefinition = createMockApiDefinition();
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: [],
    };

    await generateApi({
      targetPath: tempDir,
      solution: 'MyCompany.MyProduct',
      moduleName: 'app',
      proxyConfig,
    });

    // Check service file exists
    const serviceFiles = findFiles(tempDir, '.service.ts');
    expect(serviceFiles.length).toBeGreaterThan(0);

    // Read and verify content
    const serviceContent = fs.readFileSync(serviceFiles[0], 'utf-8');
    expect(serviceContent).toContain('UserService');
    expect(serviceContent).toContain('RestService');
  });

  it('should generate hook file', async () => {
    const apiDefinition = createMockApiDefinition();
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: [],
    };

    await generateApi({
      targetPath: tempDir,
      solution: 'MyCompany.MyProduct',
      moduleName: 'app',
      proxyConfig,
    });

    // Check hook file exists
    const hookFiles = findFiles(tempDir, '-service.ts').filter((f) =>
      f.includes('use-')
    );
    expect(hookFiles.length).toBeGreaterThan(0);

    // Read and verify content
    const hookContent = fs.readFileSync(hookFiles[0], 'utf-8');
    expect(hookContent).toContain('useQuery');
    expect(hookContent).toContain('useMutation');
    expect(hookContent).toContain('QueryKeys');
  });

  it('should generate model file', async () => {
    const apiDefinition = createMockApiDefinition();
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: [],
    };

    await generateApi({
      targetPath: tempDir,
      solution: 'MyCompany.MyProduct',
      moduleName: 'app',
      proxyConfig,
    });

    // Check model files exist
    const modelFiles = findFiles(tempDir, 'models.ts');
    expect(modelFiles.length).toBeGreaterThan(0);

    // Read and verify content
    const modelContent = fs.readFileSync(modelFiles[0], 'utf-8');
    expect(modelContent).toContain('export interface');
  });

  it('should add module to generated list', async () => {
    const apiDefinition = createMockApiDefinition();
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: [],
    };

    await generateApi({
      targetPath: tempDir,
      solution: 'MyCompany.MyProduct',
      moduleName: 'app',
      proxyConfig,
    });

    expect(proxyConfig.generated).toContain('app');
  });

  it('should sort generated list', async () => {
    const apiDefinition = createMockApiDefinition();
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: ['zebra'],
    };

    await generateApi({
      targetPath: tempDir,
      solution: 'MyCompany.MyProduct',
      moduleName: 'app',
      proxyConfig,
    });

    expect(proxyConfig.generated).toEqual(['app', 'zebra']);
  });

  it('should throw for invalid module', async () => {
    const apiDefinition = createMockApiDefinition();
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: [],
    };

    await expect(
      generateApi({
        targetPath: tempDir,
        solution: 'MyCompany.MyProduct',
        moduleName: 'nonExistent',
        proxyConfig,
      })
    ).rejects.toThrow();
  });

  it('should throw for missing types/modules', async () => {
    const proxyConfig: ProxyConfig = {
      modules: undefined as any,
      types: undefined as any,
      generated: [],
    };

    await expect(
      generateApi({
        targetPath: tempDir,
        solution: 'MyCompany.MyProduct',
        moduleName: 'app',
        proxyConfig,
      })
    ).rejects.toThrow();
  });

  it('should not duplicate module in generated list', async () => {
    const apiDefinition = createMockApiDefinition();
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: ['app'],
    };

    await generateApi({
      targetPath: tempDir,
      solution: 'MyCompany.MyProduct',
      moduleName: 'app',
      proxyConfig,
    });

    const appCount = proxyConfig.generated.filter((m) => m === 'app').length;
    expect(appCount).toBe(1);
  });
});

/**
 * Recursively find files matching a suffix.
 */
function findFiles(dir: string, suffix: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, suffix));
    } else if (entry.name.endsWith(suffix)) {
      results.push(fullPath);
    }
  }
  return results;
}
