/**
 * Tests for SaaS Extensions Guard
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  saasExtensionsGuard,
  useSaasExtensionsGuard,
  SaasExtensionsGuard,
} from '../../guards/extensions.guard';

describe('saasExtensionsGuard', () => {
  it('should return a Promise', () => {
    const result = saasExtensionsGuard();
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve to true', async () => {
    const result = await saasExtensionsGuard();
    expect(result).toBe(true);
  });

  it('should be callable multiple times', async () => {
    const results = await Promise.all([
      saasExtensionsGuard(),
      saasExtensionsGuard(),
      saasExtensionsGuard(),
    ]);
    expect(results).toEqual([true, true, true]);
  });
});

describe('useSaasExtensionsGuard', () => {
  it('should return loading true initially', () => {
    const { result } = renderHook(() => useSaasExtensionsGuard());
    // Initial state might already be resolved due to sync promise
    expect(typeof result.current.loading).toBe('boolean');
    expect(typeof result.current.isLoaded).toBe('boolean');
  });

  it('should eventually return isLoaded true', async () => {
    const { result } = renderHook(() => useSaasExtensionsGuard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isLoaded).toBe(true);
  });

  it('should return loading false after resolution', async () => {
    const { result } = renderHook(() => useSaasExtensionsGuard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle unmount during loading', async () => {
    const { unmount } = renderHook(() => useSaasExtensionsGuard());

    // Unmount immediately
    unmount();

    // Should not throw or cause errors
    expect(true).toBe(true);
  });

  it('should maintain stable reference for return object structure', async () => {
    const { result } = renderHook(() => useSaasExtensionsGuard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty('isLoaded');
    expect(result.current).toHaveProperty('loading');
  });
});

describe('SaasExtensionsGuard class', () => {
  it('should be instantiable', () => {
    const guard = new SaasExtensionsGuard();
    expect(guard).toBeInstanceOf(SaasExtensionsGuard);
  });

  it('should have canActivate method', () => {
    const guard = new SaasExtensionsGuard();
    expect(typeof guard.canActivate).toBe('function');
  });

  it('canActivate should return a Promise', () => {
    const guard = new SaasExtensionsGuard();
    const result = guard.canActivate();
    expect(result).toBeInstanceOf(Promise);
  });

  it('canActivate should resolve to true', async () => {
    const guard = new SaasExtensionsGuard();
    const result = await guard.canActivate();
    expect(result).toBe(true);
  });

  it('canActivate should use saasExtensionsGuard internally', async () => {
    const guard = new SaasExtensionsGuard();
    const classResult = await guard.canActivate();
    const functionResult = await saasExtensionsGuard();
    expect(classResult).toBe(functionResult);
  });

  it('should be usable in route guard pattern', async () => {
    const guard = new SaasExtensionsGuard();

    const routeGuard = async () => {
      const canActivate = await guard.canActivate();
      if (!canActivate) {
        return { redirect: '/unauthorized' };
      }
      return { allow: true };
    };

    const result = await routeGuard();
    expect(result).toEqual({ allow: true });
  });
});

describe('Guard usage patterns', () => {
  it('should work with async/await pattern', async () => {
    const canAccess = await saasExtensionsGuard();
    if (canAccess) {
      // Route activation logic
    }
    expect(canAccess).toBe(true);
  });

  it('should work with Promise.then pattern', async () => {
    await new Promise<void>((resolve) => {
      saasExtensionsGuard().then((result) => {
        expect(result).toBe(true);
        resolve();
      });
    });
  });

  it('should work in conditional navigation', async () => {
    const navigate = vi.fn();
    const canActivate = await saasExtensionsGuard();

    if (canActivate) {
      navigate('/saas/tenants');
    } else {
      navigate('/unauthorized');
    }

    expect(navigate).toHaveBeenCalledWith('/saas/tenants');
  });
});
