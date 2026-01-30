import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { usePasswordFlow } from '../../hooks/usePasswordFlow';

// Mock navigate
const mockNavigate = vi.fn();

// Mock useAbp return value
const mockStore = {
  dispatch: vi.fn(),
};
const mockAxiosInstance = {
  post: vi.fn(),
};
const mockApplicationConfigurationService = {
  getConfiguration: vi.fn(),
};
const mockUserManager = {
  getUser: vi.fn(),
  events: {
    load: vi.fn(),
  },
};

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useAbp: vi.fn(() => ({
    store: mockStore,
    axiosInstance: mockAxiosInstance,
    applicationConfigurationService: mockApplicationConfigurationService,
    userManager: mockUserManager,
  })),
  useConfig: vi.fn(() => ({
    environment: {
      oAuthConfig: {
        authority: 'https://auth.test.com',
        client_id: 'test-client',
        scope: 'openid profile',
      },
    },
  })),
  configActions: {
    setApplicationConfiguration: vi.fn((config) => ({
      type: 'config/setApplicationConfiguration',
      payload: config,
    })),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAccountOptions
vi.mock('../../providers', () => ({
  useAccountOptions: vi.fn(() => ({
    redirectUrl: '/dashboard',
  })),
}));

describe('usePasswordFlow', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance.post.mockReset();
    mockApplicationConfigurationService.getConfiguration.mockReset();
    mockUserManager.getUser.mockReset();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should set isLoading to true during login', async () => {
    mockAxiosInstance.post.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    act(() => {
      result.current.login('testuser', 'password123');
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should login successfully', async () => {
    const tokenResponse = {
      data: {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token',
        scope: 'openid profile',
      },
    };

    mockAxiosInstance.post.mockResolvedValue(tokenResponse);
    mockUserManager.getUser.mockResolvedValue({ access_token: 'test-token' });
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue({
      currentUser: { isAuthenticated: true },
    });

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'password123');
    });

    expect(loginResult.success).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle login with remember option', async () => {
    const tokenResponse = {
      data: {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    };

    mockAxiosInstance.post.mockResolvedValue(tokenResponse);
    mockUserManager.getUser.mockResolvedValue({ access_token: 'test-token' });
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue({});

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password123', { remember: true });
    });

    // Verify localStorage was used (remember: true)
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    const errorResponse = {
      response: {
        data: {
          error_description: 'Invalid credentials',
        },
      },
    };

    mockAxiosInstance.post.mockRejectedValue(errorResponse);

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'wrongpassword');
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Invalid credentials');
    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle error with error field', async () => {
    const errorResponse = {
      response: {
        data: {
          error: 'invalid_grant',
        },
      },
    };

    mockAxiosInstance.post.mockRejectedValue(errorResponse);

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'wrongpassword');
    });

    expect(loginResult.error).toBe('invalid_grant');
  });

  it('should handle generic error', async () => {
    const error = new Error('Network error');
    mockAxiosInstance.post.mockRejectedValue(error);

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login('testuser', 'password');
    });

    expect(loginResult.error).toBe('Network error');
  });

  it('should clear error', async () => {
    mockAxiosInstance.post.mockRejectedValue({ message: 'Error' });

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password');
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should send correct form data to token endpoint', async () => {
    mockAxiosInstance.post.mockResolvedValue({
      data: {
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    });
    mockUserManager.getUser.mockResolvedValue(null);
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue({});

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password123');
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      'https://auth.test.com/connect/token',
      expect.stringContaining('grant_type=password'),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
  });

  it('should call userManager.events.load when user is loaded', async () => {
    const mockUser = { access_token: 'test-token' };
    mockAxiosInstance.post.mockResolvedValue({
      data: {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    });
    mockUserManager.getUser.mockResolvedValue(mockUser);
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue({});

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password123');
    });

    expect(mockUserManager.events.load).toHaveBeenCalledWith(mockUser);
  });

  it('should dispatch setApplicationConfiguration action', async () => {
    const appConfig = { currentUser: { isAuthenticated: true, userName: 'testuser' } };
    mockAxiosInstance.post.mockResolvedValue({
      data: {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    });
    mockUserManager.getUser.mockResolvedValue(null);
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue(appConfig);

    const { result } = renderHook(() => usePasswordFlow(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password123');
    });

    expect(mockStore.dispatch).toHaveBeenCalled();
  });
});
