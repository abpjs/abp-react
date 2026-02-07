/**
 * Hook Template Rendering Tests
 */

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ejs from 'ejs';
import { Import } from '../../models/import';
import { Method, Body, Signature } from '../../models/method';
import { Property } from '../../models/model';
import { eImportKeyword } from '../../enums';
import { camel, pascal, kebab, dir } from '../../utils/text';
import { serializeParameters } from '../../utils/service';

function getQueryKeyType(signature: { name: string }): string {
  const name = signature.name.toLowerCase();
  if (name.includes('list') || name.includes('all') || name.includes('getlist')) {
    return 'list';
  }
  return 'detail';
}

function getMutationVariablesType(
  parameters: { name: string; type: string; optional: string }[]
): string {
  if (parameters.length === 0) return 'void';
  if (parameters.length === 1) return parameters[0].type;
  return (
    '{ ' + parameters.map((p) => `${p.name}${p.optional}: ${p.type}`).join('; ') + ' }'
  );
}

function getMutationFnParams(
  parameters: { name: string; type: string; optional: string }[]
): string {
  if (parameters.length === 0) return '';
  if (parameters.length === 1)
    return `${parameters[0].name}: ${parameters[0].type}`;
  return (
    '{ ' +
    parameters.map((p) => p.name).join(', ') +
    ' }: ' +
    getMutationVariablesType(parameters)
  );
}

function renderHookTemplate(data: Record<string, unknown>): string {
  const templatePath = path.resolve(__dirname, '../../templates/hook.ts.ejs');
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data);
}

describe('Hook Template', () => {
  const baseData = {
    name: 'IdentityUser',
    namespace: 'Identity',
    camel,
    pascal,
    kebab,
    dir,
    serializeParameters,
    getQueryKeyType,
    getMutationVariablesType,
    getMutationFnParams,
    hookImports: [],
  };

  it('should render query key factory', () => {
    const content = renderHookTemplate({ ...baseData, methods: [] });

    expect(content).toContain('export const identityUserQueryKeys');
    expect(content).toContain("all: ['identity-user'] as const");
    expect(content).toContain('lists: ()');
    expect(content).toContain('details: ()');
  });

  it('should render hook function name', () => {
    const content = renderHookTemplate({ ...baseData, methods: [] });

    expect(content).toContain('export function useIdentityUserService()');
  });

  it('should import React Query hooks', () => {
    const content = renderHookTemplate({ ...baseData, methods: [] });

    expect(content).toContain("from '@tanstack/react-query'");
    expect(content).toContain('useQuery');
    expect(content).toContain('useMutation');
    expect(content).toContain('useQueryClient');
  });

  it('should import service class', () => {
    const content = renderHookTemplate({ ...baseData, methods: [] });

    expect(content).toContain("import { IdentityUserService } from './identity-user.service'");
  });

  it('should render GET method as useQuery', () => {
    const body = new Body({
      method: 'GET',
      responseType: 'UserDto',
      url: 'api/identity/users/${id}',
    });

    const signature = new Signature({ name: 'GetById' });
    signature.parameters = [new Property({ name: 'id', type: 'string' })];

    const methods = [new Method({ body, signature })];

    const content = renderHookTemplate({ ...baseData, methods });

    expect(content).toContain('useGetById:');
    expect(content).toContain('useQuery(');
    expect(content).toContain('queryKey: identityUserQueryKeys.detail(id)');
    expect(content).toContain('queryFn: () => service.getById(id)');
  });

  it('should render list method with list query key type', () => {
    const body = new Body({
      method: 'GET',
      responseType: 'PagedResultDto<UserDto>',
      url: 'api/identity/users',
    });

    const signature = new Signature({ name: 'GetList' });
    signature.parameters = [new Property({ name: 'input', type: 'GetListInput' })];

    const methods = [new Method({ body, signature })];

    const content = renderHookTemplate({ ...baseData, methods });

    expect(content).toContain('identityUserQueryKeys.list(input)');
  });

  it('should render POST method as useMutation', () => {
    const body = new Body({
      method: 'POST',
      responseType: 'UserDto',
      url: 'api/identity/users',
    });
    body.requestType = 'CreateUserInput';

    const signature = new Signature({ name: 'Create' });
    signature.parameters = [new Property({ name: 'input', type: 'CreateUserInput' })];

    const methods = [new Method({ body, signature })];

    const content = renderHookTemplate({ ...baseData, methods });

    expect(content).toContain('useCreate:');
    expect(content).toContain('useMutation(');
    expect(content).toContain('mutationFn:');
    expect(content).toContain('service.create(input)');
    expect(content).toContain('invalidateQueries');
  });

  it('should render mutation with void variables for no params', () => {
    const body = new Body({
      method: 'DELETE',
      responseType: 'void',
      url: 'api/identity/users/${id}',
    });

    const signature = new Signature({ name: 'Delete' });
    signature.parameters = [];

    const methods = [new Method({ body, signature })];

    const content = renderHookTemplate({ ...baseData, methods });

    expect(content).toContain('void');
  });

  it('should render hookImports', () => {
    const hookImports = [
      new Import({
        keyword: eImportKeyword.Type,
        path: './models',
        specifiers: ['UserDto', 'CreateUserInput'],
      }),
    ];

    const content = renderHookTemplate({ ...baseData, methods: [], hookImports });

    expect(content).toContain("import type { UserDto, CreateUserInput } from './models'");
  });

  it('should use useRestService from @abpjs/core', () => {
    const content = renderHookTemplate({ ...baseData, methods: [] });

    expect(content).toContain("import { useRestService } from '@abpjs/core'");
  });

  it('should auto-invalidate queries on mutation success', () => {
    const body = new Body({
      method: 'PUT',
      responseType: 'UserDto',
      url: 'api/identity/users/${id}',
    });
    body.requestType = 'UpdateUserInput';

    const signature = new Signature({ name: 'Update' });
    signature.parameters = [
      new Property({ name: 'id', type: 'string' }),
      new Property({ name: 'input', type: 'UpdateUserInput' }),
    ];

    const methods = [new Method({ body, signature })];

    const content = renderHookTemplate({ ...baseData, methods });

    expect(content).toContain('onSuccess: () => {');
    expect(content).toContain('queryClient.invalidateQueries({ queryKey: identityUserQueryKeys.all })');
  });
});
