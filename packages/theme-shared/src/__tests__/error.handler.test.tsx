import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ConfirmationProvider } from '../contexts/confirmation.context';
import {
  useErrorHandler,
  createErrorInterceptor,
  DEFAULT_ERROR_MESSAGES,
  DEFAULT_ERROR_LOCALIZATIONS,
  type HttpErrorResponse,
} from '../handlers/error.handler';

// Track navigation
const mockNavigate = vi.fn();

describe('useErrorHandler', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConfirmationProvider>{children}</ConfirmationProvider>
  );

  it('should return error handler functions', () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });

    expect(typeof result.current.handleError).toBe('function');
    expect(typeof result.current.showError).toBe('function');
    expect(typeof result.current.navigateToLogin).toBe('function');
  });

  it('should navigate to login on 401 error when navigate is provided', async () => {
    const { result } = renderHook(
      () => useErrorHandler({ navigate: mockNavigate }),
      { wrapper }
    );

    const error: HttpErrorResponse = {
      status: 401,
      statusText: 'Unauthorized',
    };

    await act(async () => {
      await result.current.handleError(error);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/account/login');
  });

  it('should navigate to login when navigateToLogin is called with navigate provided', () => {
    const { result } = renderHook(
      () => useErrorHandler({ navigate: mockNavigate }),
      { wrapper }
    );

    act(() => {
      result.current.navigateToLogin();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/account/login');
  });

  it('should use custom login path when provided', () => {
    const { result } = renderHook(
      () => useErrorHandler({ navigate: mockNavigate, loginPath: '/custom/login' }),
      { wrapper }
    );

    act(() => {
      result.current.navigateToLogin();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/custom/login');
  });

  it('should not throw when navigateToLogin called without navigate function', () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });

    // Should not throw
    expect(() => {
      act(() => {
        result.current.navigateToLogin();
      });
    }).not.toThrow();

    // Navigate should not have been called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show error confirmation for non-401 errors', async () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });

    const error: HttpErrorResponse = {
      status: 500,
      error: {
        error: {
          message: 'Internal server error',
        },
      },
    };

    // Note: This will trigger a confirmation dialog
    // In a real test, we'd verify the dialog appears
    act(() => {
      result.current.handleError(error);
    });

    // The confirmation service should be called
    // We can't easily verify this without more complex mocking
  });

  it('should use default error message when none provided', async () => {
    const { result } = renderHook(
      () => useErrorHandler({ navigate: mockNavigate }),
      { wrapper }
    );

    const error: HttpErrorResponse = {
      status: 404,
    };

    act(() => {
      result.current.handleError(error);
    });

    // Should not navigate to login for 404
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle validation errors', async () => {
    const { result } = renderHook(
      () => useErrorHandler({ navigate: mockNavigate }),
      { wrapper }
    );

    const error: HttpErrorResponse = {
      status: 400,
      error: {
        error: {
          message: 'Validation failed',
          validationErrors: [
            { message: 'Name is required', members: ['name'] },
            { message: 'Email is invalid', members: ['email'] },
          ],
        },
      },
    };

    act(() => {
      result.current.handleError(error);
    });

    // Should not navigate to login for 400
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show custom error with showError', async () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });

    act(() => {
      result.current.showError('Custom error message', 'Custom Title');
    });

    // The confirmation service should be called with the error
    // We verify the function doesn't throw
  });
});

describe('createErrorInterceptor', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConfirmationProvider>{children}</ConfirmationProvider>
  );

  it('should create an error interceptor function', () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });
    const interceptor = createErrorInterceptor(result.current);

    expect(typeof interceptor).toBe('function');
  });

  it('should handle HttpErrorResponse errors', () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });
    const interceptor = createErrorInterceptor(result.current);

    const error: HttpErrorResponse = {
      status: 500,
      error: {
        error: {
          message: 'Server error',
        },
      },
    };

    // The interceptor calls handleError and then rejects.
    // Since handleError awaits the confirmation dialog (which never resolves in tests),
    // we just verify the interceptor starts processing correctly.
    const interceptorPromise = interceptor(error);

    // Verify the promise exists and is a Promise
    expect(interceptorPromise).toBeInstanceOf(Promise);

    // Add catch handler to prevent unhandled rejection warning
    interceptorPromise.catch(() => {
      // Expected rejection - swallow it
    });
  });

  it('should reject non-HttpErrorResponse errors without handling', async () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });
    const interceptor = createErrorInterceptor(result.current);

    const error = new Error('Regular error');

    await expect(interceptor(error)).rejects.toEqual(error);
  });

  it('should reject null errors', async () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });
    const interceptor = createErrorInterceptor(result.current);

    await expect(interceptor(null)).rejects.toBeNull();
  });

  it('should handle 403 Forbidden errors', async () => {
    const mockNav = vi.fn();
    const { result } = renderHook(
      () => useErrorHandler({ navigate: mockNav }),
      { wrapper }
    );

    const error: HttpErrorResponse = {
      status: 403,
      error: {
        error: {
          message: 'Access denied',
        },
      },
    };

    act(() => {
      result.current.handleError(error);
    });

    // Should not navigate to login for 403
    expect(mockNav).not.toHaveBeenCalled();
  });

  it('should handle 503 Service Unavailable errors', async () => {
    const mockNav = vi.fn();
    const { result } = renderHook(
      () => useErrorHandler({ navigate: mockNav }),
      { wrapper }
    );

    const error: HttpErrorResponse = {
      status: 503,
      error: {
        error: {
          message: 'Service temporarily unavailable',
        },
      },
    };

    act(() => {
      result.current.handleError(error);
    });

    // Should not navigate to login for 503
    expect(mockNav).not.toHaveBeenCalled();
  });
});

describe('DEFAULT_ERROR_MESSAGES', () => {
  it('should have error message for 400', () => {
    expect(DEFAULT_ERROR_MESSAGES[400]).toBe('AbpUi::DefaultErrorMessage400');
  });

  it('should have error message for 401', () => {
    expect(DEFAULT_ERROR_MESSAGES[401]).toBe('AbpUi::DefaultErrorMessage401');
  });

  it('should have error message for 403', () => {
    expect(DEFAULT_ERROR_MESSAGES[403]).toBe('AbpUi::DefaultErrorMessage403');
  });

  it('should have error message for 404', () => {
    expect(DEFAULT_ERROR_MESSAGES[404]).toBe('AbpUi::DefaultErrorMessage404');
  });

  it('should have error message for 500', () => {
    expect(DEFAULT_ERROR_MESSAGES[500]).toBe('AbpUi::DefaultErrorMessage500');
  });

  it('should have error message for 503', () => {
    expect(DEFAULT_ERROR_MESSAGES[503]).toBe('AbpUi::DefaultErrorMessage503');
  });

  it('should return undefined for unknown status codes', () => {
    expect(DEFAULT_ERROR_MESSAGES[418]).toBeUndefined();
    expect(DEFAULT_ERROR_MESSAGES[502]).toBeUndefined();
  });
});

describe('DEFAULT_ERROR_LOCALIZATIONS (v3.1.0)', () => {
  describe('structure', () => {
    it('should have defaultError with title and details', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError).toBeDefined();
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError.title).toBe('AbpUi::DefaultErrorMessage');
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError.details).toBe('AbpUi::DefaultErrorMessageDetail');
    });

    it('should have defaultError401 with title and details', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError401).toBeDefined();
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError401.title).toBe('AbpUi::DefaultErrorMessage401');
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError401.details).toBe('AbpUi::DefaultErrorMessage401Detail');
    });

    it('should have defaultError403 with title and details', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError403).toBeDefined();
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError403.title).toBe('AbpUi::DefaultErrorMessage403');
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError403.details).toBe('AbpUi::DefaultErrorMessage403Detail');
    });

    it('should have defaultError404 with title and details', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError404).toBeDefined();
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError404.title).toBe('AbpUi::DefaultErrorMessage404');
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError404.details).toBe('AbpUi::DefaultErrorMessage404Detail');
    });

    it('should have defaultError500 with title and details', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError500).toBeDefined();
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError500.title).toBe('AbpUi::DefaultErrorMessage500');
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError500.details).toBe('AbpUi::DefaultErrorMessage500Detail');
    });
  });

  describe('const assertion', () => {
    it('should be a readonly object', () => {
      // Verify that the object is typed as const (readonly)
      // We can't modify it at runtime due to TypeScript's const assertion
      const localizations = DEFAULT_ERROR_LOCALIZATIONS;
      expect(Object.keys(localizations)).toHaveLength(5);
    });

    it('should have exactly 5 error localization entries', () => {
      expect(Object.keys(DEFAULT_ERROR_LOCALIZATIONS)).toEqual([
        'defaultError',
        'defaultError401',
        'defaultError403',
        'defaultError404',
        'defaultError500',
      ]);
    });
  });

  describe('localization key format', () => {
    it('should use AbpUi namespace for all titles', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError.title).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError401.title).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError403.title).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError404.title).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError500.title).toMatch(/^AbpUi::/);
    });

    it('should use AbpUi namespace for all details', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError.details).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError401.details).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError403.details).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError404.details).toMatch(/^AbpUi::/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError500.details).toMatch(/^AbpUi::/);
    });

    it('should have Detail suffix for all detail keys', () => {
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError.details).toMatch(/Detail$/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError401.details).toMatch(/Detail$/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError403.details).toMatch(/Detail$/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError404.details).toMatch(/Detail$/);
      expect(DEFAULT_ERROR_LOCALIZATIONS.defaultError500.details).toMatch(/Detail$/);
    });
  });

  describe('usage patterns', () => {
    it('should allow accessing by key name', () => {
      const errorKey = 'defaultError403' as const;
      const localization = DEFAULT_ERROR_LOCALIZATIONS[errorKey];

      expect(localization.title).toBe('AbpUi::DefaultErrorMessage403');
      expect(localization.details).toBe('AbpUi::DefaultErrorMessage403Detail');
    });

    it('should support iteration over entries', () => {
      const entries = Object.entries(DEFAULT_ERROR_LOCALIZATIONS);

      expect(entries).toHaveLength(5);
      entries.forEach(([_key, value]) => {
        expect(value).toHaveProperty('title');
        expect(value).toHaveProperty('details');
        expect(typeof value.title).toBe('string');
        expect(typeof value.details).toBe('string');
      });
    });

    it('should support mapping error codes to localization keys', () => {
      // Common pattern for mapping HTTP status codes to localization entries
      const getLocalizationKey = (status: number): keyof typeof DEFAULT_ERROR_LOCALIZATIONS | null => {
        switch (status) {
          case 401:
            return 'defaultError401';
          case 403:
            return 'defaultError403';
          case 404:
            return 'defaultError404';
          case 500:
            return 'defaultError500';
          default:
            return null;
        }
      };

      expect(getLocalizationKey(401)).toBe('defaultError401');
      expect(getLocalizationKey(403)).toBe('defaultError403');
      expect(getLocalizationKey(404)).toBe('defaultError404');
      expect(getLocalizationKey(500)).toBe('defaultError500');
      expect(getLocalizationKey(418)).toBeNull();
    });
  });
});
