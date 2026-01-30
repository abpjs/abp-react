import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';

// Create mock functions
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
const mockAxiosPost = vi.fn();
const mockGetConfiguration = vi.fn();

// Mock modules before importing the hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@abpjs/core', () => ({
  useAbp: () => ({
    store: { dispatch: mockDispatch },
    axiosInstance: { post: mockAxiosPost },
    applicationConfigurationService: { getConfiguration: mockGetConfiguration },
    userManager: null,
  }),
  useConfig: () => ({
    environment: {
      oAuthConfig: {
        authority: 'https://auth.example.com',
        client_id: 'test-client',
        scope: 'openid profile',
      },
    },
  }),
  configActions: {
    setApplicationConfiguration: vi.fn((config) => ({ type: 'SET_CONFIG', payload: config })),
  },
}));

vi.mock('../providers', () => ({
  useAccountProOptions: () => ({
    redirectUrl: '/',
    redirectToLogin: true,
    loginUrl: '/account/login',
    registerUrl: '/account/register',
    enableSocialLogins: false,
    enableTwoFactor: false,
  }),
}));

// Import hook after mocks
import { usePasswordFlow } from '../hooks/usePasswordFlow';

describe('usePasswordFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => usePasswordFlow());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should handle successful login', async () => {
    const mockTokenResponse = {
      data: {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token',
        scope: 'openid profile',
      },
    };
    mockAxiosPost.mockResolvedValue(mockTokenResponse);
    mockGetConfiguration.mockResolvedValue({ currentUser: { id: '123' } });

    const { result } = renderHook(() => usePasswordFlow());

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'password123', { remember: false });
    });

    expect(loginResult.success).toBe(true);
    expect(mockAxiosPost).toHaveBeenCalledWith(
      'https://auth.example.com/connect/token',
      expect.any(String),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should handle login with remember me option', async () => {
    const mockTokenResponse = {
      data: {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    };
    mockAxiosPost.mockResolvedValue(mockTokenResponse);
    mockGetConfiguration.mockResolvedValue({ currentUser: { id: '123' } });

    const { result } = renderHook(() => usePasswordFlow());

    await act(async () => {
      await result.current.login('testuser', 'password123', { remember: true });
    });

    // Should store in localStorage when remember is true
    const storedData = localStorage.getItem('oidc.user:https://auth.example.com:test-client');
    expect(storedData).toBeTruthy();
  });

  it('should handle login error with error_description', async () => {
    mockAxiosPost.mockRejectedValue({
      response: {
        data: {
          error_description: 'Invalid credentials',
        },
      },
    });

    const { result } = renderHook(() => usePasswordFlow());

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'wrongpassword');
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Invalid credentials');
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should handle login error with error field', async () => {
    mockAxiosPost.mockRejectedValue({
      response: {
        data: {
          error: 'invalid_grant',
        },
      },
    });

    const { result } = renderHook(() => usePasswordFlow());

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'wrongpassword');
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('invalid_grant');
  });

  it('should handle login error with message', async () => {
    mockAxiosPost.mockRejectedValue({
      message: 'Network error',
    });

    const { result } = renderHook(() => usePasswordFlow());

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'wrongpassword');
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Network error');
  });

  it('should clear error', async () => {
    mockAxiosPost.mockRejectedValue({
      message: 'Test error',
    });

    const { result } = renderHook(() => usePasswordFlow());

    await act(async () => {
      await result.current.login('testuser', 'wrongpassword');
    });

    expect(result.current.error).toBe('Test error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should set isLoading during login', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockAxiosPost.mockReturnValue(promise);

    const { result } = renderHook(() => usePasswordFlow());

    expect(result.current.isLoading).toBe(false);

    let loginPromise: Promise<any>;
    act(() => {
      loginPromise = result.current.login('testuser', 'password123');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!({
        data: {
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      });
      mockGetConfiguration.mockResolvedValue({});
      await loginPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
