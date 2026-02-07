/**
 * Enum Template Rendering Tests
 */

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ejs from 'ejs';
import { camel, pascal, kebab, dir } from '../../utils/text';

function renderEnumTemplate(data: Record<string, unknown>): string {
  const templatePath = path.resolve(__dirname, '../../templates/enum.ts.ejs');
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data);
}

describe('Enum Template', () => {
  const baseData = { camel, pascal, kebab, dir };

  it('should render enum declaration', () => {
    const content = renderEnumTemplate({
      ...baseData,
      name: 'UserStatus',
      members: [
        { key: 'Active', value: 0 },
        { key: 'Inactive', value: 1 },
      ],
    });

    expect(content).toContain('export enum UserStatus {');
    expect(content).toContain('Active = 0,');
    expect(content).toContain('Inactive = 1,');
  });

  it('should render mapEnumToOptions call', () => {
    const content = renderEnumTemplate({
      ...baseData,
      name: 'UserStatus',
      members: [{ key: 'Active', value: 0 }],
    });

    expect(content).toContain("import { mapEnumToOptions } from '@abpjs/core'");
    expect(content).toContain('export const userStatusOptions = mapEnumToOptions(UserStatus)');
  });

  it('should handle non-sequential values', () => {
    const content = renderEnumTemplate({
      ...baseData,
      name: 'Priority',
      members: [
        { key: 'Low', value: 10 },
        { key: 'Medium', value: 20 },
        { key: 'High', value: 30 },
      ],
    });

    expect(content).toContain('Low = 10,');
    expect(content).toContain('Medium = 20,');
    expect(content).toContain('High = 30,');
  });

  it('should use camelCase for options variable name', () => {
    const content = renderEnumTemplate({
      ...baseData,
      name: 'RoleType',
      members: [{ key: 'Admin', value: 1 }],
    });

    expect(content).toContain('export const roleTypeOptions');
  });

  it('should render single member enum', () => {
    const content = renderEnumTemplate({
      ...baseData,
      name: 'SingleValue',
      members: [{ key: 'Only', value: 0 }],
    });

    expect(content).toContain('export enum SingleValue {');
    expect(content).toContain('Only = 0,');
    expect(content).toContain('}');
  });
});
