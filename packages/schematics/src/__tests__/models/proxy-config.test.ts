/**
 * Proxy Config Tests
 */

import { describe, expect, it } from 'vitest';
import type { ProxyConfig } from '../../models/proxy-config';

describe('ProxyConfig', () => {
  it('should extend ApiDefinition with generated array', () => {
    const proxyConfig: ProxyConfig = {
      modules: {},
      types: {},
      generated: ['src/proxy/users/models.ts', 'src/proxy/users/user.service.ts'],
    };

    expect(proxyConfig.modules).toEqual({});
    expect(proxyConfig.types).toEqual({});
    expect(proxyConfig.generated).toHaveLength(2);
    expect(proxyConfig.generated[0]).toBe('src/proxy/users/models.ts');
  });

  it('should allow empty generated array', () => {
    const proxyConfig: ProxyConfig = {
      modules: {},
      types: {},
      generated: [],
    };

    expect(proxyConfig.generated).toEqual([]);
  });
});
