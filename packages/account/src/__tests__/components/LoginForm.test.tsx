import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  Input: React.forwardRef(({ id, ...props }: any, ref: any) => (
    <input id={id} ref={ref} {...props} />
  )),
  Link: ({ children, asChild, ...props }: any) =>
    asChild ? children : <a {...props}>{children}</a>,
  HStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Show: ({ children, when }: any) => (when ? children : null),
  Card: {
    Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Body: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Field: {
    Root: ({ children, invalid, ...props }: any) => (
      <div data-invalid={invalid} {...props}>{children}</div>
    ),
    Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
    ErrorText: ({ children, ...props }: any) => <span role="alert" {...props}>{children}</span>,
  },
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  InputGroup: ({ children, startElement, ...props }: any) => (
    <div {...props}>{startElement}{children}</div>
  ),
  Stack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

// Mock password flow
const mockLogin = vi.fn();
const mockClearError = vi.fn();
let mockIsLoading = false;
let mockError: string | null = null;

vi.mock('../../hooks', () => ({
  usePasswordFlow: () => ({
    login: mockLogin,
    isLoading: mockIsLoading,
    error: mockError,
    clearError: mockClearError,
  }),
  useSelfRegistrationEnabled: () => true,
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpAccount::Login': 'Log in',
        'AbpAccount::UserNameOrEmailAddress': 'Username or email address',
        'AbpAccount::Password': 'Password',
        'AbpAccount::RememberMe': 'Remember me',
        'AbpAccount::ForgotPassword': 'Forgot password?',
        'AbpAccount::AreYouANewUser': "Don't have an account?",
        'AbpAccount::Register': 'Register',
      };
      return translations[key] || key;
    },
  }),
  useDispatch: () => vi.fn(),
  sessionActions: {
    setTenant: vi.fn(),
  },
  selectTenant: () => ({ id: '', name: '' }),
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Alert: ({ children, status }: any) => (
    <div role="alert" data-status={status}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, loading, type, ...props }: any) => (
    <button type={type} onClick={onClick} disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  Checkbox: React.forwardRef(({ children, id, ...props }: any, ref: any) => (
    <label htmlFor={id}>
      <input type="checkbox" id={id} ref={ref} {...props} />
      {children}
    </label>
  )),
  Modal: () => null,
  useToaster: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock TenantBox
vi.mock('../../components/TenantBox', () => ({
  TenantBox: () => <div data-testid="tenant-box">TenantBox</div>,
}));

// Mock useAccountService
vi.mock('../../hooks/useAccountService', () => ({
  useAccountService: () => ({
    findTenant: vi.fn(),
    register: vi.fn(),
  }),
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuMail: () => <span data-testid="mail-icon" />,
  LuLock: () => <span data-testid="lock-icon" />,
}));

import { LoginForm } from '../../components/LoginForm/LoginForm';

// Create mock store
const createMockStore = () => {
  const sessionReducer = (state = { language: 'en', tenant: { id: '', name: '' } }) => state;
  return configureStore({
    reducer: combineReducers({ session: sessionReducer }),
  });
};

describe('LoginForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockReset();
    mockClearError.mockReset();
    mockIsLoading = false;
    mockError = null;
  });

  const renderLoginForm = (props = {}) => {
    const store = createMockStore();
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render login form', () => {
    renderLoginForm();

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  });

  it('should render tenant box by default', () => {
    renderLoginForm();

    expect(screen.getByTestId('tenant-box')).toBeInTheDocument();
  });

  it('should hide tenant box when showTenantBox is false', () => {
    renderLoginForm({ showTenantBox: false });

    expect(screen.queryByTestId('tenant-box')).not.toBeInTheDocument();
  });

  it('should render remember me checkbox', () => {
    renderLoginForm();

    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    renderLoginForm();

    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('should render register link by default', () => {
    renderLoginForm();

    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should hide register link when showRegisterLink is false', () => {
    renderLoginForm({ showRegisterLink: false });

    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('should show validation error for empty username', async () => {
    renderLoginForm();

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for empty password', async () => {
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText('me@example.com');
    await user.type(usernameInput, 'testuser');

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should call login on form submit', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText('me@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123', { remember: false });
    });
  });

  it('should call onLoginSuccess when login succeeds', async () => {
    const onLoginSuccess = vi.fn();
    mockLogin.mockResolvedValue({ success: true });
    renderLoginForm({ onLoginSuccess });

    const usernameInput = screen.getByPlaceholderText('me@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });

  it('should call onLoginError when login fails', async () => {
    const onLoginError = vi.fn();
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    renderLoginForm({ onLoginError });

    const usernameInput = screen.getByPlaceholderText('me@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'wrongpassword');

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onLoginError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('should clear error before login attempt', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText('me@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled();
    });
  });
});
