import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mock('../hooks', () => ({
  usePasswordFlow: () => ({
    login: mockLogin,
    isLoading: false,
    error: null,
    clearError: mockClearError,
  }),
}));

vi.mock('../components/TenantBox', () => ({
  TenantBox: () => <div data-testid="tenant-box">TenantBox</div>,
}));

vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({ t: (key: string) => key }),
}));

vi.mock('@abpjs/theme-shared', () => ({
  Alert: ({ children, status }: any) => <div data-testid="alert" data-status={status}>{children}</div>,
  Button: ({ children, loading, type, ...props }: any) => (
    <button type={type} data-testid="submit-btn" disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  Checkbox: ({ children, ...props }: any) => (
    <label><input type="checkbox" {...props} />{children}</label>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByRole('heading')).toHaveTextContent('AbpAccount::Login');
    expect(screen.getByTestId('tenant-box')).toBeInTheDocument();
  });

  it('should hide tenant box when showTenantBox is false', () => {
    renderWithRouter(<LoginForm showTenantBox={false} />);
    expect(screen.queryByTestId('tenant-box')).not.toBeInTheDocument();
  });

  it('should render username and password fields', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText('AbpAccount::UserNameOrEmailAddress')).toBeInTheDocument();
    expect(screen.getByText('AbpAccount::Password')).toBeInTheDocument();
  });

  it('should render remember me checkbox', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText('AbpAccount::RememberMe')).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText('AbpAccount::ForgotPassword')).toBeInTheDocument();
  });

  it('should hide forgot password link when showForgotPasswordLink is false', () => {
    renderWithRouter(<LoginForm showForgotPasswordLink={false} />);
    expect(screen.queryByText('AbpAccount::ForgotPassword')).not.toBeInTheDocument();
  });

  it('should render register link', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText('AbpAccount::Register')).toBeInTheDocument();
  });

  it('should hide register link when showRegisterLink is false', () => {
    renderWithRouter(<LoginForm showRegisterLink={false} />);
    expect(screen.queryByText('AbpAccount::AreYouANewUser')).not.toBeInTheDocument();
  });

  it('should call login on valid form submission', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderWithRouter(<LoginForm />);

    const usernameInput = document.getElementById('login-input-user-name-or-email-address') as HTMLInputElement;
    const passwordInput = document.getElementById('login-input-password') as HTMLInputElement;

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'Password123!');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'Password123!', { remember: false });
    });
  });

  it('should call onLoginSuccess on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });
    const onLoginSuccess = vi.fn();
    renderWithRouter(<LoginForm onLoginSuccess={onLoginSuccess} />);

    const usernameInput = document.getElementById('login-input-user-name-or-email-address') as HTMLInputElement;
    const passwordInput = document.getElementById('login-input-password') as HTMLInputElement;

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'Password123!');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });

  it('should call onLoginError on failed login', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    const onLoginError = vi.fn();
    renderWithRouter(<LoginForm onLoginError={onLoginError} />);

    const usernameInput = document.getElementById('login-input-user-name-or-email-address') as HTMLInputElement;
    const passwordInput = document.getElementById('login-input-password') as HTMLInputElement;

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'Password123!');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(onLoginError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('should use custom registerUrl', () => {
    renderWithRouter(<LoginForm registerUrl="/custom-register" />);
    const registerLink = screen.getByText('AbpAccount::Register').closest('a');
    expect(registerLink).toHaveAttribute('href', '/custom-register');
  });

  it('should use custom forgotPasswordUrl', () => {
    renderWithRouter(<LoginForm forgotPasswordUrl="/custom-forgot" />);
    const forgotLink = screen.getByText('AbpAccount::ForgotPassword').closest('a');
    expect(forgotLink).toHaveAttribute('href', '/custom-forgot');
  });

  // v2.0.0 - isSelfRegistrationEnabled tests
  describe('isSelfRegistrationEnabled (v2.0.0)', () => {
    it('should show register link when isSelfRegistrationEnabled is true (default)', () => {
      renderWithRouter(<LoginForm />);
      expect(screen.getByText('AbpAccount::Register')).toBeInTheDocument();
      expect(screen.getByText('AbpAccount::AreYouANewUser')).toBeInTheDocument();
    });

    it('should hide register link when isSelfRegistrationEnabled is false', () => {
      renderWithRouter(<LoginForm isSelfRegistrationEnabled={false} />);
      expect(screen.queryByText('AbpAccount::Register')).not.toBeInTheDocument();
      expect(screen.queryByText('AbpAccount::AreYouANewUser')).not.toBeInTheDocument();
    });

    it('should hide register link when showRegisterLink is true but isSelfRegistrationEnabled is false', () => {
      renderWithRouter(<LoginForm showRegisterLink={true} isSelfRegistrationEnabled={false} />);
      expect(screen.queryByText('AbpAccount::Register')).not.toBeInTheDocument();
    });

    it('should hide register link when showRegisterLink is false even if isSelfRegistrationEnabled is true', () => {
      renderWithRouter(<LoginForm showRegisterLink={false} isSelfRegistrationEnabled={true} />);
      expect(screen.queryByText('AbpAccount::Register')).not.toBeInTheDocument();
    });

    it('should show register link only when both showRegisterLink and isSelfRegistrationEnabled are true', () => {
      renderWithRouter(<LoginForm showRegisterLink={true} isSelfRegistrationEnabled={true} />);
      expect(screen.getByText('AbpAccount::Register')).toBeInTheDocument();
    });
  });
});
