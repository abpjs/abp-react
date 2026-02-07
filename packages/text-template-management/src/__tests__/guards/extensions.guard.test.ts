/**
 * Tests for extensions.guard.ts
 * @since 3.0.0
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  textTemplateManagementExtensionsGuard,
  useTextTemplateManagementExtensionsGuard,
  TextTemplateManagementExtensionsGuard,
} from '../../guards/extensions.guard';

describe('Extensions Guard', () => {
  describe('textTemplateManagementExtensionsGuard function', () => {
    it('should return a promise', () => {
      const result = textTemplateManagementExtensionsGuard();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to true', async () => {
      const result = await textTemplateManagementExtensionsGuard();
      expect(result).toBe(true);
    });

    it('should be callable multiple times', async () => {
      const results = await Promise.all([
        textTemplateManagementExtensionsGuard(),
        textTemplateManagementExtensionsGuard(),
        textTemplateManagementExtensionsGuard(),
      ]);
      expect(results).toEqual([true, true, true]);
    });
  });

  describe('useTextTemplateManagementExtensionsGuard hook', () => {
    it('should return loading true initially', () => {
      const { result } = renderHook(() =>
        useTextTemplateManagementExtensionsGuard(),
      );
      expect(result.current.loading).toBe(true);
    });

    it('should return isLoaded false initially', () => {
      const { result } = renderHook(() =>
        useTextTemplateManagementExtensionsGuard(),
      );
      expect(result.current.isLoaded).toBe(false);
    });

    it('should set isLoaded to true after checking', async () => {
      const { result } = renderHook(() =>
        useTextTemplateManagementExtensionsGuard(),
      );

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });
    });

    it('should set loading to false after checking', async () => {
      const { result } = renderHook(() =>
        useTextTemplateManagementExtensionsGuard(),
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle cleanup on unmount', async () => {
      const { result, unmount } = renderHook(() =>
        useTextTemplateManagementExtensionsGuard(),
      );

      // Unmount before the async operation completes
      unmount();

      // The hook should have cleaned up properly
      expect(result.current).toBeDefined();
    });

    it('should return correct state object shape', async () => {
      const { result } = renderHook(() =>
        useTextTemplateManagementExtensionsGuard(),
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty('isLoaded');
      expect(result.current).toHaveProperty('loading');
      expect(typeof result.current.isLoaded).toBe('boolean');
      expect(typeof result.current.loading).toBe('boolean');
    });
  });

  describe('TextTemplateManagementExtensionsGuard class', () => {
    let guard: TextTemplateManagementExtensionsGuard;

    beforeEach(() => {
      guard = new TextTemplateManagementExtensionsGuard();
    });

    it('should be instantiable', () => {
      expect(guard).toBeInstanceOf(TextTemplateManagementExtensionsGuard);
    });

    it('should have canActivate method', () => {
      expect(guard.canActivate).toBeDefined();
      expect(typeof guard.canActivate).toBe('function');
    });

    it('should return promise from canActivate', () => {
      const result = guard.canActivate();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to true from canActivate', async () => {
      const result = await guard.canActivate();
      expect(result).toBe(true);
    });

    it('should work with multiple guard instances', async () => {
      const guard1 = new TextTemplateManagementExtensionsGuard();
      const guard2 = new TextTemplateManagementExtensionsGuard();

      const [result1, result2] = await Promise.all([
        guard1.canActivate(),
        guard2.canActivate(),
      ]);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should use same guard logic in function and class', async () => {
      const guard = new TextTemplateManagementExtensionsGuard();

      const [functionResult, classResult] = await Promise.all([
        textTemplateManagementExtensionsGuard(),
        guard.canActivate(),
      ]);

      expect(functionResult).toBe(classResult);
    });

    it('should be usable in route protection scenarios', async () => {
      const canNavigate = async (): Promise<boolean> => {
        return textTemplateManagementExtensionsGuard();
      };

      const result = await canNavigate();
      expect(result).toBe(true);
    });
  });
});
