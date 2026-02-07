/**
 * Service Template Rendering Tests
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

function renderServiceTemplate(data: Record<string, unknown>): string {
  const templatePath = path.resolve(__dirname, '../../templates/service.ts.ejs');
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data);
}

describe('Service Template', () => {
  const baseData = {
    name: 'IdentityUser',
    apiName: 'default',
    namespace: 'Identity',
    camel,
    pascal,
    kebab,
    dir,
    serializeParameters,
  };

  it('should render class name with Service suffix', () => {
    const content = renderServiceTemplate({
      ...baseData,
      imports: [new Import({ path: '@abpjs/core', specifiers: ['RestService'] })],
      methods: [],
    });

    expect(content).toContain('export class IdentityUserService');
    expect(content).toContain("apiName = 'default'");
  });

  it('should render import statements', () => {
    const imports = [
      new Import({
        keyword: eImportKeyword.Default,
        path: '@abpjs/core',
        specifiers: ['RestService'],
      }),
      new Import({
        keyword: eImportKeyword.Type,
        path: './models',
        specifiers: ['UserDto', 'CreateUserInput'],
      }),
    ];

    const content = renderServiceTemplate({ ...baseData, imports, methods: [] });

    expect(content).toContain("import { RestService } from '@abpjs/core'");
    expect(content).toContain("import type { UserDto, CreateUserInput } from './models'");
  });

  it('should render GET method', () => {
    const body = new Body({
      method: 'GET',
      responseType: 'UserDto',
      url: 'api/identity/users/${id}',
    });

    const signature = new Signature({ name: 'GetById' });
    signature.parameters = [new Property({ name: 'id', type: 'string' })];

    const methods = [new Method({ body, signature })];
    const imports = [new Import({ path: '@abpjs/core', specifiers: ['RestService'] })];

    const content = renderServiceTemplate({ ...baseData, imports, methods });

    expect(content).toContain('getById = (id: string): Promise<UserDto>');
    expect(content).toContain("method: 'GET'");
    expect(content).toContain('url: `/api/identity/users/${id}`');
  });

  it('should render method with body param', () => {
    const body = new Body({
      method: 'POST',
      responseType: 'UserDto',
      url: 'api/identity/users',
    });
    body.body = 'input';
    body.requestType = 'CreateUserInput';

    const signature = new Signature({ name: 'Create' });
    signature.parameters = [new Property({ name: 'input', type: 'CreateUserInput' })];

    const methods = [new Method({ body, signature })];
    const imports = [new Import({ path: '@abpjs/core', specifiers: ['RestService'] })];

    const content = renderServiceTemplate({ ...baseData, imports, methods });

    expect(content).toContain("method: 'POST'");
    expect(content).toContain('body: input,');
  });

  it('should render method with query params', () => {
    const body = new Body({
      method: 'GET',
      responseType: 'PagedResultDto<UserDto>',
      url: 'api/identity/users',
    });
    body.params = ['filter: filter', 'maxResultCount: maxResultCount'];

    const signature = new Signature({ name: 'GetList' });
    signature.parameters = [
      new Property({ name: 'filter', type: 'string', optional: '?' }),
      new Property({ name: 'maxResultCount', type: 'number', optional: '?' }),
    ];

    const methods = [new Method({ body, signature })];
    const imports = [new Import({ path: '@abpjs/core', specifiers: ['RestService'] })];

    const content = renderServiceTemplate({ ...baseData, imports, methods });

    expect(content).toContain('params: { filter: filter, maxResultCount: maxResultCount }');
  });

  it('should render constructor with restService', () => {
    const content = renderServiceTemplate({
      ...baseData,
      imports: [new Import({ path: '@abpjs/core', specifiers: ['RestService'] })],
      methods: [],
    });

    expect(content).toContain('constructor(restService: RestService)');
    expect(content).toContain('this.restService = restService;');
  });
});
