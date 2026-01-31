import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

const mockRegister = vi.fn();
const mockNavigate = vi.fn();
const mockToasterSuccess = vi.fn();
const mockToasterError = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../hooks/useAccountProService', () => ({
  useAccountProService: () => ({
    register: mockRegister,
  }),
}));

vi.mock('../components/TenantBox', () => ({
  TenantBox: () => <div data-testid="tenant-box">TenantBox</div>,
}));

vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({ t: (key: string) => key }),
  useUserManager: () => null,
  useAbp: () => ({
    store: { dispatch: vi.fn() },
    applicationConfigurationService: { getConfiguration: vi.fn() },
  }),
  configActions: { setApplicationConfiguration: vi.fn() },
}));

vi.mock('@abpjs/theme-shared', () => ({
  Button: ({ children, loading, type, ...props }: any) => (
    <button type={type} data-testid="submit-btn" disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  useToaster: () => ({ success: mockToasterSuccess, error: mockToasterError }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the register form', () => {
    renderWithRouter(<RegisterForm />);
    expect(screen.getByRole('heading')).toHaveTextContent('AbpAccount::Register');
    expect(screen.getByTestId('tenant-box')).toBeInTheDocument();
  });

  it('should hide tenant box when showTenantBox is false', () => {
    renderWithRouter(<RegisterForm showTenantBox={false} />);
    expect(screen.queryByTestId('tenant-box')).not.toBeInTheDocument();
  });

  it('should render username, email, and password fields', () => {
    renderWithRouter(<RegisterForm />);
    expect(screen.getByText('AbpAccount::UserName')).toBeInTheDocument();
    expect(screen.getByText('AbpAccount::EmailAddress')).toBeInTheDocument();
    expect(screen.getByText('AbpAccount::Password')).toBeInTheDocument();
  });

  it('should render login link', () => {
    renderWithRouter(<RegisterForm />);
    expect(screen.getByText('AbpAccount::Login')).toBeInTheDocument();
  });

  it('should hide login link when showLoginLink is false', () => {
    renderWithRouter(<RegisterForm showLoginLink={false} />);
    expect(screen.queryByText('AbpAccount::AlreadyRegistered')).not.toBeInTheDocument();
  });

  it('should call register on valid form submission', async () => {
    mockRegister.mockResolvedValue({ id: '123' });
    renderWithRouter(<RegisterForm />);

    const usernameInput = document.getElementById('input-user-name') as HTMLInputElement;
    const emailInput = document.getElementById('input-email-address') as HTMLInputElement;
    const passwordInput = document.getElementById('input-password') as HTMLInputElement;

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        userName: 'testuser',
        emailAddress: 'test@example.com',
        password: 'Password123!',
        appName: 'React',
      });
    });
  });

  it('should navigate to login after successful registration', async () => {
    mockRegister.mockResolvedValue({ id: '123' });
    renderWithRouter(<RegisterForm />);

    const usernameInput = document.getElementById('input-user-name') as HTMLInputElement;
    const emailInput = document.getElementById('input-email-address') as HTMLInputElement;
    const passwordInput = document.getElementById('input-password') as HTMLInputElement;

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockToasterSuccess).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/account/login');
    });
  });

  it('should call onRegisterSuccess on successful registration', async () => {
    mockRegister.mockResolvedValue({ id: '123' });
    const onRegisterSuccess = vi.fn();
    renderWithRouter(<RegisterForm onRegisterSuccess={onRegisterSuccess} />);

    const usernameInput = document.getElementById('input-user-name') as HTMLInputElement;
    const emailInput = document.getElementById('input-email-address') as HTMLInputElement;
    const passwordInput = document.getElementById('input-password') as HTMLInputElement;

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(onRegisterSuccess).toHaveBeenCalled();
    });
  });

  it('should call onRegisterError on registration failure', async () => {
    mockRegister.mockRejectedValue({ error: { error_description: 'Username taken' } });
    const onRegisterError = vi.fn();
    renderWithRouter(<RegisterForm onRegisterError={onRegisterError} />);

    const usernameInput = document.getElementById('input-user-name') as HTMLInputElement;
    const emailInput = document.getElementById('input-email-address') as HTMLInputElement;
    const passwordInput = document.getElementById('input-password') as HTMLInputElement;

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(onRegisterError).toHaveBeenCalledWith('Username taken');
    });
  });

  it('should use custom loginUrl', () => {
    renderWithRouter(<RegisterForm loginUrl="/custom-login" />);
    const loginLink = screen.getByText('AbpAccount::Login').closest('a');
    expect(loginLink).toHaveAttribute('href', '/custom-login');
  });

  // v2.0.0 - isSelfRegistrationEnabled tests
  describe('isSelfRegistrationEnabled (v2.0.0)', () => {
    it('should render the form when isSelfRegistrationEnabled is true (default)', () => {
      renderWithRouter(<RegisterForm />);
      expect(screen.getByRole('heading')).toHaveTextContent('AbpAccount::Register');
      expect(document.getElementById('input-user-name')).toBeInTheDocument();
      expect(document.getElementById('input-email-address')).toBeInTheDocument();
      expect(document.getElementById('input-password')).toBeInTheDocument();
    });

    it('should show disabled message when isSelfRegistrationEnabled is false', () => {
      renderWithRouter(<RegisterForm isSelfRegistrationEnabled={false} />);
      expect(screen.getByRole('heading')).toHaveTextContent('AbpAccount::Register');
      expect(screen.getByText('AbpAccount::SelfRegistrationDisabledMessage')).toBeInTheDocument();
    });

    it('should not show form fields when isSelfRegistrationEnabled is false', () => {
      renderWithRouter(<RegisterForm isSelfRegistrationEnabled={false} />);
      expect(document.getElementById('input-user-name')).not.toBeInTheDocument();
      expect(document.getElementById('input-email-address')).not.toBeInTheDocument();
      expect(document.getElementById('input-password')).not.toBeInTheDocument();
    });

    it('should show login link in disabled state', () => {
      renderWithRouter(<RegisterForm isSelfRegistrationEnabled={false} />);
      expect(screen.getByText('AbpAccount::Login')).toBeInTheDocument();
    });

    it('should use custom loginUrl in disabled state', () => {
      renderWithRouter(<RegisterForm isSelfRegistrationEnabled={false} loginUrl="/custom-login" />);
      const loginLink = screen.getByText('AbpAccount::Login').closest('a');
      expect(loginLink).toHaveAttribute('href', '/custom-login');
    });

    it('should not show tenant box in disabled state', () => {
      renderWithRouter(<RegisterForm isSelfRegistrationEnabled={false} showTenantBox={true} />);
      expect(screen.queryByTestId('tenant-box')).not.toBeInTheDocument();
    });
  });
});
