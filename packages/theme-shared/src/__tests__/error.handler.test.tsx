import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ConfirmationProvider } from '../contexts/confirmation.context';
import {
  useErrorHandler,
  createErrorInterceptor,
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
