import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ResetPassword } from '../components/ResetPassword';

const mockResetPassword = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('../hooks/useAccountProService', () => ({
  useAccountProService: () => ({
    resetPassword: mockResetPassword,
  }),
}));

vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

vi.mock('@abpjs/theme-shared', () => ({
  Alert: ({ children, status }: any) => <div data-testid="alert" data-status={status}>{children}</div>,
  Button: ({ children, loading, type, ...props }: any) => (
    <button type={type} data-testid="submit-btn" disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('userId');
    mockSearchParams.delete('resetToken');
  });

  it('should show error when userId is missing', () => {
    mockSearchParams.set('resetToken', 'valid-token');
    renderWithRouter(<ResetPassword />);
    expect(screen.getByTestId('alert')).toHaveTextContent('AbpAccount::InvalidResetLink');
  });

  it('should show error when resetToken is missing', () => {
    mockSearchParams.set('userId', 'valid-user-id');
    renderWithRouter(<ResetPassword />);
    expect(screen.getByTestId('alert')).toHaveTextContent('AbpAccount::InvalidResetLink');
  });

  it('should render form when both params present', () => {
    mockSearchParams.set('userId', 'valid-user-id');
    mockSearchParams.set('resetToken', 'valid-token');
    renderWithRouter(<ResetPassword />);
    expect(screen.getByRole('heading')).toHaveTextContent('AbpAccount::ResetPassword');
  });

  it('should call resetPassword on valid submission', async () => {
    mockSearchParams.set('userId', 'user-123');
    mockSearchParams.set('resetToken', 'token-456');
    mockResetPassword.mockResolvedValue(undefined);
    renderWithRouter(<ResetPassword />);
    const passwordInput = document.getElementById('reset-password-new') as HTMLInputElement;
    const confirmInput = document.getElementById('reset-password-confirm') as HTMLInputElement;
    if (passwordInput) await userEvent.type(passwordInput, 'NewPassword1!');
    if (confirmInput) await userEvent.type(confirmInput, 'NewPassword1!');
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        userId: 'user-123',
        resetToken: 'token-456',
        password: 'NewPassword1!',
      });
    });
  });

  it('should show success message after reset', async () => {
    mockSearchParams.set('userId', 'user-123');
    mockSearchParams.set('resetToken', 'token-456');
    mockResetPassword.mockResolvedValue(undefined);
    renderWithRouter(<ResetPassword />);
    const passwordInput = document.getElementById('reset-password-new') as HTMLInputElement;
    const confirmInput = document.getElementById('reset-password-confirm') as HTMLInputElement;
    if (passwordInput) await userEvent.type(passwordInput, 'NewPassword1!');
    if (confirmInput) await userEvent.type(confirmInput, 'NewPassword1!');
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(screen.getByText('AbpAccount::PasswordResetSuccess')).toBeInTheDocument();
    });
  });

  it('should call onSuccess after reset', async () => {
    mockSearchParams.set('userId', 'user-123');
    mockSearchParams.set('resetToken', 'token-456');
    mockResetPassword.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    renderWithRouter(<ResetPassword onSuccess={onSuccess} />);
    const passwordInput = document.getElementById('reset-password-new') as HTMLInputElement;
    const confirmInput = document.getElementById('reset-password-confirm') as HTMLInputElement;
    if (passwordInput) await userEvent.type(passwordInput, 'NewPassword1!');
    if (confirmInput) await userEvent.type(confirmInput, 'NewPassword1!');
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => { expect(onSuccess).toHaveBeenCalled(); });
  });

  it('should show error on API failure', async () => {
    mockSearchParams.set('userId', 'user-123');
    mockSearchParams.set('resetToken', 'token-456');
    mockResetPassword.mockRejectedValue({ message: 'Invalid token' });
    renderWithRouter(<ResetPassword />);
    const passwordInput = document.getElementById('reset-password-new') as HTMLInputElement;
    const confirmInput = document.getElementById('reset-password-confirm') as HTMLInputElement;
    if (passwordInput) await userEvent.type(passwordInput, 'NewPassword1!');
    if (confirmInput) await userEvent.type(confirmInput, 'NewPassword1!');
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => { expect(screen.getByTestId('alert')).toHaveTextContent('Invalid token'); });
  });
});
