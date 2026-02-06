/**
 * Tests for SaaS Guards barrel export
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as guards from '../../guards';

describe('guards barrel export', () => {
  it('should export saasExtensionsGuard function', () => {
    expect(guards.saasExtensionsGuard).toBeDefined();
    expect(typeof guards.saasExtensionsGuard).toBe('function');
  });

  it('should export useSaasExtensionsGuard hook', () => {
    expect(guards.useSaasExtensionsGuard).toBeDefined();
    expect(typeof guards.useSaasExtensionsGuard).toBe('function');
  });

  it('should export SaasExtensionsGuard class', () => {
    expect(guards.SaasExtensionsGuard).toBeDefined();
    expect(typeof guards.SaasExtensionsGuard).toBe('function');
  });

  it('should allow instantiating SaasExtensionsGuard', () => {
    const instance = new guards.SaasExtensionsGuard();
    expect(instance).toBeInstanceOf(guards.SaasExtensionsGuard);
  });

  it('should have saasExtensionsGuard returning a Promise', async () => {
    const result = guards.saasExtensionsGuard();
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toBe(true);
  });
});
