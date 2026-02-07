/**
 * Models Template Rendering Tests
 */

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ejs from 'ejs';
import { Import } from '../../models/import';
import { Interface, Property } from '../../models/model';
import { eImportKeyword } from '../../enums';

function renderModelsTemplate(data: Record<string, unknown>): string {
  const templatePath = path.resolve(__dirname, '../../templates/models.ts.ejs');
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data);
}

describe('Models Template', () => {
  it('should render import statements', () => {
    const imports = [
      new Import({
        keyword: eImportKeyword.Type,
        path: '@abpjs/core',
        specifiers: ['PagedResultDto'],
      }),
    ];

    const content = renderModelsTemplate({ imports, interfaces: [] });

    expect(content).toContain("import type { PagedResultDto } from '@abpjs/core'");
  });

  it('should render simple interface', () => {
    const iface = new Interface({
      identifier: 'UserDto',
      base: null,
      namespace: 'Users',
      ref: 'MyApp.Users.UserDto',
    });
    iface.properties = [
      new Property({ name: 'id', type: 'string' }),
      new Property({ name: 'name', type: 'string' }),
    ];

    const content = renderModelsTemplate({ imports: [], interfaces: [iface] });

    expect(content).toContain('export interface UserDto {');
    expect(content).toContain('id: string;');
    expect(content).toContain('name: string;');
  });

  it('should render interface with extends', () => {
    const iface = new Interface({
      identifier: 'CreateUserInput',
      base: 'UserDtoBase',
      namespace: 'Users',
      ref: 'MyApp.Users.CreateUserInput',
    });
    iface.properties = [new Property({ name: 'password', type: 'string' })];

    const content = renderModelsTemplate({ imports: [], interfaces: [iface] });

    expect(content).toContain('export interface CreateUserInput extends UserDtoBase {');
  });

  it('should render optional properties', () => {
    const iface = new Interface({
      identifier: 'GetListInput',
      base: null,
      namespace: 'Users',
      ref: 'MyApp.Users.GetListInput',
    });
    iface.properties = [
      new Property({ name: 'filter', type: 'string', optional: '?' }),
      new Property({ name: 'maxResultCount', type: 'number', optional: '?' }),
    ];

    const content = renderModelsTemplate({ imports: [], interfaces: [iface] });

    expect(content).toContain('filter?: string;');
    expect(content).toContain('maxResultCount?: number;');
  });

  it('should render multiple interfaces', () => {
    const iface1 = new Interface({
      identifier: 'UserDto',
      base: null,
      namespace: 'Users',
      ref: 'MyApp.Users.UserDto',
    });
    const iface2 = new Interface({
      identifier: 'RoleDto',
      base: null,
      namespace: 'Users',
      ref: 'MyApp.Users.RoleDto',
    });

    const content = renderModelsTemplate({ imports: [], interfaces: [iface1, iface2] });

    expect(content).toContain('export interface UserDto');
    expect(content).toContain('export interface RoleDto');
  });

  it('should render interface with no properties', () => {
    const iface = new Interface({
      identifier: 'EmptyDto',
      base: null,
      namespace: 'Users',
      ref: 'MyApp.Users.EmptyDto',
    });

    const content = renderModelsTemplate({ imports: [], interfaces: [iface] });

    expect(content).toContain('export interface EmptyDto {');
    expect(content).toContain('}');
  });
});
