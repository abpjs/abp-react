import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { useLocalization, useTranslation } from './useLocalization';
import { createTestStore, defaultConfigState } from '../__tests__/test-utils';

describe('useLocalization', () => {
  const createWrapper = (overrides = {}) => {
    const store = createTestStore({
      config: {
        ...defaultConfigState,
        environment: {
          ...defaultConfigState.environment,
          localization: { defaultResourceName: 'TestResource' },
        },
        localization: {
          values: {
            TestResource: {
              Hello: 'Hello',
              World: 'World',
              Greeting: "Hello '{0}'!",
              DoubleGreeting: "Hello '{0}' and '{1}'!",
            },
            OtherResource: {
              Farewell: 'Goodbye',
            },
          },
          languages: [
            { cultureName: 'en', displayName: 'English', uiCultureName: 'en', flagIcon: '' },
            { cultureName: 'ar', displayName: 'Arabic', uiCultureName: 'ar', flagIcon: '' },
          ],
        },
        ...overrides,
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  describe('useLocalization', () => {
    describe('t function', () => {
      it('should return localized string for ResourceName::Key format', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.t('TestResource::Hello')).toBe('Hello');
      });

      it('should use default resource for ::Key format', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.t('::Hello')).toBe('Hello');
      });

      it('should use default resource for Key format without ::', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        // Without ::, it uses the key as-is but looks in default resource
        expect(result.current.t('Hello')).toBe('Hello');
      });

      it('should interpolate parameters', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.t('TestResource::Greeting', 'World')).toBe('Hello World!');
      });

      it('should interpolate multiple parameters', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.t('TestResource::DoubleGreeting', 'Alice', 'Bob')).toBe(
          'Hello Alice and Bob!'
        );
      });

      it('should return key when translation not found', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.t('NonExistent::Key')).toBe('NonExistent::Key');
      });

      it('should get translation from different resource', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.t('OtherResource::Farewell')).toBe('Goodbye');
      });

      it('should handle empty key', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        // When key is empty, it returns the entire default resource object
        // due to how the reduce works: localization.values['TestResource'] returns the full object
        const translation = result.current.t('');
        expect(typeof translation).toBe('object');
      });

      it('should warn when default resource name not set', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const storeWithoutDefault = createTestStore({
          config: {
            ...defaultConfigState,
            environment: {
              localization: { defaultResourceName: '' },
            },
            localization: {
              values: { TestResource: { Hello: 'Hello' } },
              languages: [],
            },
          },
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store={storeWithoutDefault}>{children}</Provider>
        );

        const { result } = renderHook(() => useLocalization(), { wrapper });

        result.current.t('::Hello');
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('defaultResourceName')
        );

        consoleSpy.mockRestore();
      });
    });

    describe('instant function', () => {
      it('should be an alias for t', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.instant).toBe(result.current.t);
        expect(result.current.instant('TestResource::Hello')).toBe('Hello');
      });
    });

    describe('languages', () => {
      it('should return available languages', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.languages).toHaveLength(2);
        expect(result.current.languages[0].cultureName).toBe('en');
        expect(result.current.languages[1].cultureName).toBe('ar');
      });
    });

    describe('localization', () => {
      it('should return full localization object', () => {
        const { result } = renderHook(() => useLocalization(), {
          wrapper: createWrapper(),
        });

        expect(result.current.localization.values).toBeDefined();
        expect(result.current.localization.languages).toBeDefined();
      });
    });
  });

  describe('useTranslation', () => {
    it('should return translated string', () => {
      const { result } = renderHook(
        () => useTranslation('TestResource::Hello'),
        { wrapper: createWrapper() }
      );

      expect(result.current).toBe('Hello');
    });

    it('should handle interpolation', () => {
      const { result } = renderHook(
        () => useTranslation('TestResource::Greeting', 'World'),
        { wrapper: createWrapper() }
      );

      expect(result.current).toBe('Hello World!');
    });

    it('should return key for non-existent translation', () => {
      const { result } = renderHook(
        () => useTranslation('NonExistent::Key'),
        { wrapper: createWrapper() }
      );

      expect(result.current).toBe('NonExistent::Key');
    });
  });
});
