import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import {
  HTTP_ERROR_CONFIG,
  HttpErrorConfigContext,
  httpErrorConfigFactory,
  useHttpErrorConfig,
} from '../tokens/http-error.token';
import type { HttpErrorConfig } from '../models/common';

/**
 * Tests for http-error.token.ts - HTTP error configuration tokens
 * @since 2.7.0
 */

describe('http-error.token', () => {
  describe('HTTP_ERROR_CONFIG', () => {
    it('should have correct token name', () => {
      expect(HTTP_ERROR_CONFIG).toBe('HTTP_ERROR_CONFIG');
    });
  });

  describe('httpErrorConfigFactory', () => {
    it('should return default config with empty skipHandledErrorCodes', () => {
      const config = httpErrorConfigFactory();

      expect(config.skipHandledErrorCodes).toEqual([]);
    });

    it('should return default config with undefined errorScreen', () => {
      const config = httpErrorConfigFactory();

      expect(config.errorScreen).toBeUndefined();
    });
  });

  describe('HttpErrorConfigContext', () => {
    it('should provide config to children', () => {
      const customConfig: HttpErrorConfig = {
        skipHandledErrorCodes: [404],
        errorScreen: {
          component: () => <div>Custom Error</div>,
          forWhichErrors: [500],
          hideCloseIcon: true,
        },
      };

      const TestComponent = () => {
        const config = useHttpErrorConfig();
        return (
          <div>
            <span data-testid="skip-codes">{config.skipHandledErrorCodes?.join(',')}</span>
            <span data-testid="for-which">{config.errorScreen?.forWhichErrors?.join(',')}</span>
            <span data-testid="hide-icon">{config.errorScreen?.hideCloseIcon ? 'yes' : 'no'}</span>
          </div>
        );
      };

      render(
        <HttpErrorConfigContext.Provider value={customConfig}>
          <TestComponent />
        </HttpErrorConfigContext.Provider>
      );

      expect(screen.getByTestId('skip-codes')).toHaveTextContent('404');
      expect(screen.getByTestId('for-which')).toHaveTextContent('500');
      expect(screen.getByTestId('hide-icon')).toHaveTextContent('yes');
    });

    it('should allow undefined value (uses default in hook)', () => {
      const TestComponent = () => {
        const config = useHttpErrorConfig();
        return (
          <div data-testid="has-config">{config ? 'yes' : 'no'}</div>
        );
      };

      render(
        <HttpErrorConfigContext.Provider value={undefined}>
          <TestComponent />
        </HttpErrorConfigContext.Provider>
      );

      expect(screen.getByTestId('has-config')).toHaveTextContent('yes');
    });
  });

  describe('useHttpErrorConfig', () => {
    it('should return default config when no provider is present', () => {
      const { result } = renderHook(() => useHttpErrorConfig());

      expect(result.current.skipHandledErrorCodes).toEqual([]);
      expect(result.current.errorScreen).toBeUndefined();
    });

    it('should return provided config when provider is present', () => {
      const customConfig: HttpErrorConfig = {
        skipHandledErrorCodes: [401, 403],
        errorScreen: {
          component: () => <div>Error</div>,
          forWhichErrors: [404, 500],
        },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HttpErrorConfigContext.Provider value={customConfig}>
          {children}
        </HttpErrorConfigContext.Provider>
      );

      const { result } = renderHook(() => useHttpErrorConfig(), { wrapper });

      expect(result.current.skipHandledErrorCodes).toEqual([401, 403]);
      expect(result.current.errorScreen?.forWhichErrors).toEqual([404, 500]);
    });

    it('should handle skipHandledErrorCodes with mixed types', () => {
      const customConfig: HttpErrorConfig = {
        skipHandledErrorCodes: [404, 418, 500],
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HttpErrorConfigContext.Provider value={customConfig}>
          {children}
        </HttpErrorConfigContext.Provider>
      );

      const { result } = renderHook(() => useHttpErrorConfig(), { wrapper });

      expect(result.current.skipHandledErrorCodes).toContain(404);
      expect(result.current.skipHandledErrorCodes).toContain(418);
      expect(result.current.skipHandledErrorCodes).toContain(500);
    });

    it('should handle all error screen error codes', () => {
      const CustomComponent = () => <div>Error</div>;
      const customConfig: HttpErrorConfig = {
        errorScreen: {
          component: CustomComponent,
          forWhichErrors: [401, 403, 404, 500],
          hideCloseIcon: false,
        },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HttpErrorConfigContext.Provider value={customConfig}>
          {children}
        </HttpErrorConfigContext.Provider>
      );

      const { result } = renderHook(() => useHttpErrorConfig(), { wrapper });

      expect(result.current.errorScreen?.forWhichErrors).toHaveLength(4);
      expect(result.current.errorScreen?.forWhichErrors).toContain(401);
      expect(result.current.errorScreen?.forWhichErrors).toContain(403);
      expect(result.current.errorScreen?.forWhichErrors).toContain(404);
      expect(result.current.errorScreen?.forWhichErrors).toContain(500);
    });
  });

  describe('Integration', () => {
    it('should allow components to check if error code should be skipped', () => {
      const customConfig: HttpErrorConfig = {
        skipHandledErrorCodes: [404],
      };

      const TestComponent = () => {
        const config = useHttpErrorConfig();
        const shouldSkip404 = config.skipHandledErrorCodes?.includes(404);
        const shouldSkip500 = config.skipHandledErrorCodes?.includes(500);

        return (
          <div>
            <span data-testid="skip-404">{shouldSkip404 ? 'yes' : 'no'}</span>
            <span data-testid="skip-500">{shouldSkip500 ? 'yes' : 'no'}</span>
          </div>
        );
      };

      render(
        <HttpErrorConfigContext.Provider value={customConfig}>
          <TestComponent />
        </HttpErrorConfigContext.Provider>
      );

      expect(screen.getByTestId('skip-404')).toHaveTextContent('yes');
      expect(screen.getByTestId('skip-500')).toHaveTextContent('no');
    });

    it('should allow components to check if custom error component should be used', () => {
      const CustomErrorComponent = () => <div>Custom</div>;
      const customConfig: HttpErrorConfig = {
        errorScreen: {
          component: CustomErrorComponent,
          forWhichErrors: [500],
        },
      };

      const TestComponent = () => {
        const config = useHttpErrorConfig();
        const useCustomFor500 = config.errorScreen?.forWhichErrors?.includes(500);
        const useCustomFor404 = config.errorScreen?.forWhichErrors?.includes(404);

        return (
          <div>
            <span data-testid="custom-500">{useCustomFor500 ? 'yes' : 'no'}</span>
            <span data-testid="custom-404">{useCustomFor404 ? 'yes' : 'no'}</span>
          </div>
        );
      };

      render(
        <HttpErrorConfigContext.Provider value={customConfig}>
          <TestComponent />
        </HttpErrorConfigContext.Provider>
      );

      expect(screen.getByTestId('custom-500')).toHaveTextContent('yes');
      expect(screen.getByTestId('custom-404')).toHaveTextContent('no');
    });
  });
});
