/**
 * Generate Proxy Schema Tests
 */

import { describe, expect, it } from 'vitest';
import type { GenerateProxySchema } from '../../models/generate-proxy-schema';

describe('GenerateProxySchema', () => {
  it('should be correctly typed with all options', () => {
    const schema: GenerateProxySchema = {
      module: 'app',
      'api-name': 'default',
      source: 'my-app',
      target: 'proxy-lib',
    };

    expect(schema.module).toBe('app');
    expect(schema['api-name']).toBe('default');
    expect(schema.source).toBe('my-app');
    expect(schema.target).toBe('proxy-lib');
  });

  it('should be correctly typed with no options', () => {
    const schema: GenerateProxySchema = {};

    expect(schema.module).toBeUndefined();
    expect(schema['api-name']).toBeUndefined();
    expect(schema.source).toBeUndefined();
    expect(schema.target).toBeUndefined();
  });

  it('should be correctly typed with partial options', () => {
    const schema: GenerateProxySchema = {
      module: 'identity',
    };

    expect(schema.module).toBe('identity');
    expect(schema['api-name']).toBeUndefined();
  });
});
