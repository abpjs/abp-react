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

// Mock navigate
const mockNavigate = vi.fn();

// Mock toaster
const mockToaster = {
  success: vi.fn(),
  error: vi.fn(),
};

// Mock account service
const mockAccountService = {
  findTenant: vi.fn(),
  register: vi.fn(),
};

// Mock user manager
const mockUserManager = {
  signinResourceOwnerCredentials: vi.fn(),
};

// Mock store
const mockAbpStore = {
  dispatch: vi.fn(),
};

// Mock application configuration service
const mockApplicationConfigurationService = {
  getConfiguration: vi.fn(),
};

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpAccount::Register': 'Register',
        'AbpAccount::UserName': 'Username',
        'AbpAccount::EmailAddress': 'Email address',
        'AbpAccount::Password': 'Password',
        'AbpAccount::AlreadyRegistered': 'Already have an account?',
        'AbpAccount::Login': 'Log in',
        'AbpAccount::SuccessfullyRegistered': 'Successfully registered!',
        'AbpAccount::Success': 'Success',
        'AbpAccount::DefaultErrorMessage': 'An error occurred',
        'AbpUi::Error': 'Error',
      };
      return translations[key] || key;
    },
  }),
  useUserManager: () => mockUserManager,
  useAbp: () => ({
    store: mockAbpStore,
    applicationConfigurationService: mockApplicationConfigurationService,
  }),
  configActions: {
    setApplicationConfiguration: vi.fn((config) => ({
      type: 'config/setApplicationConfiguration',
      payload: config,
    })),
  },
  useDispatch: () => vi.fn(),
  sessionActions: {
    setTenant: vi.fn(),
  },
  selectTenant: () => ({ id: '', name: '' }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Button: ({ children, onClick, loading, type, ...props }: any) => (
    <button type={type} onClick={onClick} disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  useToaster: () => mockToaster,
  Modal: () => null,
}));

// Mock TenantBox
vi.mock('../../components/TenantBox', () => ({
  TenantBox: () => <div data-testid="tenant-box">TenantBox</div>,
}));

// Mock useAccountService
vi.mock('../../hooks/useAccountService', () => ({
  useAccountService: () => mockAccountService,
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuMail: () => <span data-testid="mail-icon" />,
  LuLock: () => <span data-testid="lock-icon" />,
  LuUser: () => <span data-testid="user-icon" />,
}));

import { RegisterForm } from '../../components/RegisterForm/RegisterForm';

// Create mock store
const createMockStore = () => {
  const sessionReducer = (state = { language: 'en', tenant: { id: '', name: '' } }) => state;
  return configureStore({
    reducer: combineReducers({ session: sessionReducer }),
  });
};

describe('RegisterForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccountService.register.mockReset();
    mockUserManager.signinResourceOwnerCredentials.mockReset();
    mockApplicationConfigurationService.getConfiguration.mockReset();
    mockNavigate.mockReset();
  });

  const renderRegisterForm = (props = {}) => {
    const store = createMockStore();
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render register form', () => {
    renderRegisterForm();

    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
  });

  it('should render tenant box by default', () => {
    renderRegisterForm();

    expect(screen.getByTestId('tenant-box')).toBeInTheDocument();
  });

  it('should hide tenant box when showTenantBox is false', () => {
    renderRegisterForm({ showTenantBox: false });

    expect(screen.queryByTestId('tenant-box')).not.toBeInTheDocument();
  });

  it('should render login link by default', () => {
    renderRegisterForm();

    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('should hide login link when showLoginLink is false', () => {
    renderRegisterForm({ showLoginLink: false });

    expect(screen.queryByText('Log in')).not.toBeInTheDocument();
  });

  it('should show validation error for empty username', async () => {
    renderRegisterForm();

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    renderRegisterForm();

    const usernameInput = screen.getByPlaceholderText('johndoe');
    await user.type(usernameInput, 'testuser');

    const emailInput = screen.getByPlaceholderText('me@example.com');
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    renderRegisterForm();

    const usernameInput = screen.getByPlaceholderText('johndoe');
    await user.type(usernameInput, 'testuser');

    const emailInput = screen.getByPlaceholderText('me@example.com');
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByPlaceholderText('••••••••');
    await user.type(passwordInput, 'Ab1!');

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should call register service on form submit', async () => {
    mockAccountService.register.mockResolvedValue({ id: 'user-123' });
    mockUserManager.signinResourceOwnerCredentials.mockResolvedValue({});
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue({});

    renderRegisterForm();

    const usernameInput = screen.getByPlaceholderText('johndoe');
    await user.type(usernameInput, 'testuser');

    const emailInput = screen.getByPlaceholderText('me@example.com');
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByPlaceholderText('••••••••');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAccountService.register).toHaveBeenCalledWith({
        userName: 'testuser',
        emailAddress: 'test@example.com',
        password: 'Password123!',
        appName: 'React',
      });
    });
  });

  it('should auto-login and navigate to home on success', async () => {
    mockAccountService.register.mockResolvedValue({ id: 'user-123' });
    mockUserManager.signinResourceOwnerCredentials.mockResolvedValue({});
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue({});

    renderRegisterForm();

    const usernameInput = screen.getByPlaceholderText('johndoe');
    await user.type(usernameInput, 'testuser');

    const emailInput = screen.getByPlaceholderText('me@example.com');
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByPlaceholderText('••••••••');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should call onRegisterSuccess on success', async () => {
    const onRegisterSuccess = vi.fn();
    mockAccountService.register.mockResolvedValue({ id: 'user-123' });
    mockUserManager.signinResourceOwnerCredentials.mockResolvedValue({});
    mockApplicationConfigurationService.getConfiguration.mockResolvedValue({});

    renderRegisterForm({ onRegisterSuccess });

    const usernameInput = screen.getByPlaceholderText('johndoe');
    await user.type(usernameInput, 'testuser');

    const emailInput = screen.getByPlaceholderText('me@example.com');
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByPlaceholderText('••••••••');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onRegisterSuccess).toHaveBeenCalled();
    });
  });

  it('should show success toast when auto-login fails', async () => {
    mockAccountService.register.mockResolvedValue({ id: 'user-123' });
    mockUserManager.signinResourceOwnerCredentials.mockRejectedValue(new Error('Login failed'));

    renderRegisterForm();

    const usernameInput = screen.getByPlaceholderText('johndoe');
    await user.type(usernameInput, 'testuser');

    const emailInput = screen.getByPlaceholderText('me@example.com');
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByPlaceholderText('••••••••');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToaster.success).toHaveBeenCalled();
    });
  });

  it('should call onRegisterError on registration error', async () => {
    const onRegisterError = vi.fn();
    mockAccountService.register.mockRejectedValue({
      error: { error: { message: 'Username already exists' } },
    });

    renderRegisterForm({ onRegisterError });

    const usernameInput = screen.getByPlaceholderText('johndoe');
    await user.type(usernameInput, 'testuser');

    const emailInput = screen.getByPlaceholderText('me@example.com');
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByPlaceholderText('••••••••');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToaster.error).toHaveBeenCalled();
      expect(onRegisterError).toHaveBeenCalled();
    });
  });
});
