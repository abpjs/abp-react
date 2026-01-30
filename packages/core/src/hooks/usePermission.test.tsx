import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { usePermission, usePermissions } from './usePermission';
import { createTestStore, defaultConfigState } from '../__tests__/test-utils';

describe('usePermission', () => {
  const createWrapper = (preloadedState = {}) => {
    const store = createTestStore({
      config: {
        ...defaultConfigState,
        auth: {
          policies: {},
          grantedPolicies: {
            'AbpIdentity.Users': true,
            'AbpIdentity.Roles': true,
            'AbpIdentity.Users.Create': false,
            'AbpIdentity.Users.Delete': false,
          },
        },
      },
      ...preloadedState,
    });

    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  describe('usePermission', () => {
    it('should return true for empty condition', () => {
      const { result } = renderHook(() => usePermission(''), {
        wrapper: createWrapper(),
      });
      expect(result.current).toBe(true);
    });

    it('should return true for granted policy', () => {
      const { result } = renderHook(() => usePermission('AbpIdentity.Users'), {
        wrapper: createWrapper(),
      });
      expect(result.current).toBe(true);
    });

    it('should return false for denied policy', () => {
      const { result } = renderHook(() => usePermission('AbpIdentity.Users.Create'), {
        wrapper: createWrapper(),
      });
      expect(result.current).toBe(false);
    });

    it('should evaluate AND conditions', () => {
      const { result: trueResult } = renderHook(
        () => usePermission('AbpIdentity.Users && AbpIdentity.Roles'),
        { wrapper: createWrapper() }
      );
      expect(trueResult.current).toBe(true);

      const { result: falseResult } = renderHook(
        () => usePermission('AbpIdentity.Users && AbpIdentity.Users.Create'),
        { wrapper: createWrapper() }
      );
      expect(falseResult.current).toBe(false);
    });

    it('should evaluate OR conditions', () => {
      const { result: trueResult } = renderHook(
        () => usePermission('AbpIdentity.Users.Create || AbpIdentity.Users'),
        { wrapper: createWrapper() }
      );
      expect(trueResult.current).toBe(true);

      const { result: falseResult } = renderHook(
        () => usePermission('AbpIdentity.Users.Create || AbpIdentity.Users.Delete'),
        { wrapper: createWrapper() }
      );
      expect(falseResult.current).toBe(false);
    });

    it('should evaluate NOT conditions with compound expressions', () => {
      // NOT with compound expressions works via the boolean evaluator
      const { result: trueResult } = renderHook(
        () => usePermission('!AbpIdentity.Users.Create || AbpIdentity.Users'),
        { wrapper: createWrapper() }
      );
      expect(trueResult.current).toBe(true);

      const { result: falseResult } = renderHook(
        () => usePermission('!AbpIdentity.Users && !AbpIdentity.Roles'),
        { wrapper: createWrapper() }
      );
      expect(falseResult.current).toBe(false);
    });

    it('should return false for non-existent policy', () => {
      const { result } = renderHook(() => usePermission('NonExistent.Policy'), {
        wrapper: createWrapper(),
      });
      expect(result.current).toBe(false);
    });
  });

  describe('usePermissions', () => {
    it('should check multiple permissions at once', () => {
      const { result } = renderHook(
        () =>
          usePermissions([
            'AbpIdentity.Users',
            'AbpIdentity.Users.Create',
            'AbpIdentity.Roles',
          ]),
        { wrapper: createWrapper() }
      );

      expect(result.current['AbpIdentity.Users']).toBe(true);
      expect(result.current['AbpIdentity.Users.Create']).toBe(false);
      expect(result.current['AbpIdentity.Roles']).toBe(true);
    });

    it('should return true for empty condition', () => {
      const { result } = renderHook(() => usePermissions(['']), {
        wrapper: createWrapper(),
      });
      expect(result.current['']).toBe(true);
    });

    it('should handle complex conditions', () => {
      const { result } = renderHook(
        () =>
          usePermissions([
            'AbpIdentity.Users && AbpIdentity.Roles',
            '!AbpIdentity.Users.Create || AbpIdentity.Users', // Use compound expression for NOT
            'AbpIdentity.Users.Create || AbpIdentity.Users',
          ]),
        { wrapper: createWrapper() }
      );

      expect(result.current['AbpIdentity.Users && AbpIdentity.Roles']).toBe(true);
      expect(result.current['!AbpIdentity.Users.Create || AbpIdentity.Users']).toBe(true);
      expect(result.current['AbpIdentity.Users.Create || AbpIdentity.Users']).toBe(true);
    });
  });
});
