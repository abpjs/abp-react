import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ChangePassword } from '../components/ChangePassword';

const mockChangePassword = vi.fn();
const mockToasterSuccess = vi.fn();
vi.mock('../hooks/useAccountProService', () => ({
  useAccountProService: () => ({
    changePassword: mockChangePassword,
  }),
}));

vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@abpjs/theme-shared', () => ({
  Alert: ({ children, status }: any) => <div data-testid="alert" data-status={status}>{children}</div>,
  Button: ({ children, loading, type, ...props }: any) => (
    <button type={type} data-testid="submit-btn" disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  useToaster: () => ({
    success: mockToasterSuccess,
    error: vi.fn(),
  }),
}));

describe('ChangePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the change password form', () => {
    render(<ChangePassword />);
    expect(screen.getByText('AbpAccount::ChangePassword')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });

  it('should show validation error for empty current password', async () => {
    render(<ChangePassword />);
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText('Current password is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for short new password', async () => {
    render(<ChangePassword />);
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    if (currentPasswordInput) await userEvent.type(currentPasswordInput, 'oldpassword');
    if (newPasswordInput) await userEvent.type(newPasswordInput, '123');
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should show validation error for password mismatch', async () => {
    render(<ChangePassword />);
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmNewPasswordInput = document.getElementById('confirm-new-password') as HTMLInputElement;
    if (currentPasswordInput) await userEvent.type(currentPasswordInput, 'oldpassword');
    if (newPasswordInput) await userEvent.type(newPasswordInput, 'newpassword1');
    if (confirmNewPasswordInput) await userEvent.type(confirmNewPasswordInput, 'newpassword2');
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should call changePassword on valid submission', async () => {
    mockChangePassword.mockResolvedValue(undefined);
    render(<ChangePassword />);
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmNewPasswordInput = document.getElementById('confirm-new-password') as HTMLInputElement;
    if (currentPasswordInput) await userEvent.type(currentPasswordInput, 'OldPassword1!');
    if (newPasswordInput) await userEvent.type(newPasswordInput, 'NewPassword1!');
    if (confirmNewPasswordInput) await userEvent.type(confirmNewPasswordInput, 'NewPassword1!');
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'OldPassword1!',
        newPassword: 'NewPassword1!',
      });
    });
  });

  it('should call onSuccess callback after password changed', async () => {
    mockChangePassword.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    render(<ChangePassword onSuccess={onSuccess} />);
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmNewPasswordInput = document.getElementById('confirm-new-password') as HTMLInputElement;
    if (currentPasswordInput) await userEvent.type(currentPasswordInput, 'OldPassword1!');
    if (newPasswordInput) await userEvent.type(newPasswordInput, 'NewPassword1!');
    if (confirmNewPasswordInput) await userEvent.type(confirmNewPasswordInput, 'NewPassword1!');
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show error on API failure', async () => {
    mockChangePassword.mockRejectedValue({ message: 'Network error' });
    render(<ChangePassword />);
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmNewPasswordInput = document.getElementById('confirm-new-password') as HTMLInputElement;
    if (currentPasswordInput) await userEvent.type(currentPasswordInput, 'OldPassword1!');
    if (newPasswordInput) await userEvent.type(newPasswordInput, 'NewPassword1!');
    if (confirmNewPasswordInput) await userEvent.type(confirmNewPasswordInput, 'NewPassword1!');
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('Network error');
    });
  });

  it('should call onError callback on failure', async () => {
    mockChangePassword.mockRejectedValue({ message: 'Error' });
    const onError = vi.fn();
    render(<ChangePassword onError={onError} />);
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmNewPasswordInput = document.getElementById('confirm-new-password') as HTMLInputElement;
    if (currentPasswordInput) await userEvent.type(currentPasswordInput, 'OldPassword1!');
    if (newPasswordInput) await userEvent.type(newPasswordInput, 'NewPassword1!');
    if (confirmNewPasswordInput) await userEvent.type(confirmNewPasswordInput, 'NewPassword1!');
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Error');
    });
  });
});
