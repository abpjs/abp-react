/**
 * Tests for Identity Extensions Guard
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  identityExtensionsGuard,
  useIdentityExtensionsGuard,
  IdentityExtensionsGuard,
} from '../../guards/extensions.guard';

describe('identityExtensionsGuard', () => {
  it('should return a promise', () => {
    const result = identityExtensionsGuard();
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve to true', async () => {
    const result = await identityExtensionsGuard();
    expect(result).toBe(true);
  });
});

describe('useIdentityExtensionsGuard', () => {
  it('should return an object with isLoaded and loading properties', () => {
    const result = useIdentityExtensionsGuard();
    expect(result).toHaveProperty('isLoaded');
    expect(result).toHaveProperty('loading');
  });

  it('should return isLoaded as true', () => {
    const { isLoaded } = useIdentityExtensionsGuard();
    expect(isLoaded).toBe(true);
  });

  it('should return loading as false', () => {
    const { loading } = useIdentityExtensionsGuard();
    expect(loading).toBe(false);
  });

  it('should be callable as a hook (returns consistent values)', () => {
    const result1 = useIdentityExtensionsGuard();
    const result2 = useIdentityExtensionsGuard();
    expect(result1.isLoaded).toBe(result2.isLoaded);
    expect(result1.loading).toBe(result2.loading);
  });
});

describe('IdentityExtensionsGuard class', () => {
  it('should be a class', () => {
    expect(typeof IdentityExtensionsGuard).toBe('function');
    expect(IdentityExtensionsGuard.prototype).toBeDefined();
  });

  it('should have a canActivate method', () => {
    const guard = new IdentityExtensionsGuard();
    expect(typeof guard.canActivate).toBe('function');
  });

  it('should return a promise from canActivate', () => {
    const guard = new IdentityExtensionsGuard();
    const result = guard.canActivate();
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve canActivate to true', async () => {
    const guard = new IdentityExtensionsGuard();
    const result = await guard.canActivate();
    expect(result).toBe(true);
  });

  it('should delegate to identityExtensionsGuard function', async () => {
    const guard = new IdentityExtensionsGuard();
    const guardResult = await guard.canActivate();
    const fnResult = await identityExtensionsGuard();
    expect(guardResult).toBe(fnResult);
  });
});
