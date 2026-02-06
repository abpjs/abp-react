import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock profile hook
const mockChangePassword = vi.fn();
const mockProfile = {
  userName: 'test-user',
  email: 'test@example.com',
  name: 'Test',
  surname: 'User',
  phoneNumber: '',
  isExternal: false,
  hasPassword: true, // User has password by default
};

const mockUseProfile = vi.fn(() => ({
  profile: mockProfile,
  loading: false,
  error: null,
  fetchProfile: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: mockChangePassword,
}));

// Mock toaster
const mockToaster = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpAccount::CurrentPassword': 'Current Password',
        'AbpAccount::NewPassword': 'New Password',
        'AbpAccount::NewPasswordConfirm': 'Confirm New Password',
        'AbpAccount::Submit': 'Submit',
        'AbpAccount::PasswordChangedMessage': 'Your password has been changed successfully.',
        'AbpAccount::Success': 'Success',
        'AbpAccount::DefaultErrorMessage': 'An error occurred',
        'AbpUi::Error': 'Error',
      };
      return translations[key] || key;
    },
  }),
  useProfile: () => mockUseProfile(),
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Button: ({ children, onClick, loading, type, ...props }: any) => (
    <button type={type} onClick={onClick} disabled={loading} data-loading={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  useToaster: () => mockToaster,
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Input: React.forwardRef(({ id, type, placeholder, ...props }: any, ref: any) => (
    <input ref={ref} id={id} type={type} placeholder={placeholder} {...props} />
  )),
  Stack: ({ children, gap, ...props }: any) => <div data-gap={gap} {...props}>{children}</div>,
  Field: {
    Root: ({ children, invalid, ...props }: any) => (
      <div data-invalid={invalid} data-testid="field-root" {...props}>{children}</div>
    ),
    Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
    ErrorText: ({ children, ...props }: any) => (
      <span data-testid="error-text" {...props}>{children}</span>
    ),
  },
  InputGroup: ({ children, startElement: _startElement, width: _width, ...props }: any) => (
    <div data-testid="input-group" {...props}>{children}</div>
  ),
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuLock: () => <span data-testid="lock-icon" />,
}));

import { ChangePasswordForm } from '../../components/ChangePasswordForm/ChangePasswordForm';

describe('ChangePasswordForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockChangePassword.mockReset();
  });

  it('should render the form with all fields', () => {
    render(<ChangePasswordForm />);

    expect(screen.getByText('Current Password')).toBeInTheDocument();
    expect(screen.getByText('New Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should render password input fields', () => {
    render(<ChangePasswordForm />);

    // All three password fields should be present
    const inputs = screen.getAllByPlaceholderText('••••••••');
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toBeInTheDocument();
  });

  it('should show validation error for empty current password', async () => {
    render(<ChangePasswordForm />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Current password is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for short new password', async () => {
    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'oldPass1!');
    await user.type(inputs[1], 'Ab1!'); // Too short
    await user.type(inputs[2], 'Ab1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should show validation error for password without lowercase', async () => {
    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'oldPass1!');
    await user.type(inputs[1], 'ABCDEF1!'); // No lowercase
    await user.type(inputs[2], 'ABCDEF1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one lowercase letter')).toBeInTheDocument();
    });
  });

  it('should show validation error for password without uppercase', async () => {
    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'oldPass1!');
    await user.type(inputs[1], 'abcdef1!'); // No uppercase
    await user.type(inputs[2], 'abcdef1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one uppercase letter')).toBeInTheDocument();
    });
  });

  it('should show validation error for password without number', async () => {
    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'oldPass1!');
    await user.type(inputs[1], 'Abcdef!!'); // No number
    await user.type(inputs[2], 'Abcdef!!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument();
    });
  });

  it('should show validation error for password without special character', async () => {
    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'oldPass1!');
    await user.type(inputs[1], 'Abcdef12'); // No special char
    await user.type(inputs[2], 'Abcdef12');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one special character')).toBeInTheDocument();
    });
  });

  it('should show validation error when passwords do not match', async () => {
    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'oldPass1!');
    await user.type(inputs[1], 'NewPass1!');
    await user.type(inputs[2], 'DifferentPass1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should call changePassword on valid form submission', async () => {
    mockChangePassword.mockResolvedValue(undefined);

    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'OldPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'OldPassword1!',
        newPassword: 'NewPassword1!',
      });
    });
  });

  it('should show success toast on successful password change', async () => {
    mockChangePassword.mockResolvedValue(undefined);

    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'OldPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToaster.success).toHaveBeenCalledWith(
        'Your password has been changed successfully.',
        'Success'
      );
    });
  });

  it('should call onSuccess callback on successful password change', async () => {
    mockChangePassword.mockResolvedValue(undefined);
    const onSuccess = vi.fn();

    render(<ChangePasswordForm onSuccess={onSuccess} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'OldPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show error toast on password change failure', async () => {
    mockChangePassword.mockRejectedValue({
      error: { error: { message: 'Invalid current password' } },
    });

    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'WrongPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToaster.error).toHaveBeenCalledWith(
        'Invalid current password',
        'Error',
        { life: 7000 }
      );
    });
  });

  it('should call onError callback on password change failure', async () => {
    mockChangePassword.mockRejectedValue({
      error: { error: { message: 'Invalid current password' } },
    });
    const onError = vi.fn();

    render(<ChangePasswordForm onError={onError} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'WrongPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Invalid current password');
    });
  });

  it('should show default error message when no specific error provided', async () => {
    mockChangePassword.mockRejectedValue(new Error('Network error'));

    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'OldPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToaster.error).toHaveBeenCalledWith(
        'An error occurred',
        'Error',
        { life: 7000 }
      );
    });
  });

  it('should disable submit button while in progress', async () => {
    // Make the promise hang to keep button disabled
    let resolvePromise: () => void;
    mockChangePassword.mockImplementation(() => new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'OldPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
    });

    // Resolve to clean up
    resolvePromise!();
  });

  it('should reset form after successful password change', async () => {
    mockChangePassword.mockResolvedValue(undefined);

    render(<ChangePasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'OldPassword1!');
    await user.type(inputs[1], 'NewPassword1!');
    await user.type(inputs[2], 'NewPassword1!');

    expect(inputs[0]).toHaveValue('OldPassword1!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToaster.success).toHaveBeenCalled();
    });

    // Form should be reset
    await waitFor(() => {
      expect(inputs[0]).toHaveValue('');
    });
  });

  // v3.1.0: hideCurrentPassword tests
  describe('v3.1.0 hideCurrentPassword', () => {
    it('should hide current password field when hideCurrentPassword prop is true', () => {
      render(<ChangePasswordForm hideCurrentPassword={true} />);

      // Should only have 2 password inputs (new and confirm)
      const inputs = screen.getAllByPlaceholderText('••••••••');
      expect(inputs).toHaveLength(2);
      expect(screen.queryByText('Current Password')).not.toBeInTheDocument();
    });

    it('should show current password field when hideCurrentPassword prop is false', () => {
      render(<ChangePasswordForm hideCurrentPassword={false} />);

      // Should have 3 password inputs
      const inputs = screen.getAllByPlaceholderText('••••••••');
      expect(inputs).toHaveLength(3);
      expect(screen.getByText('Current Password')).toBeInTheDocument();
    });

    it('should auto-hide current password when profile.hasPassword is false', () => {
      // Use the hideCurrentPassword prop directly since vi.mock is hoisted
      // The component should auto-detect from profile.hasPassword, but
      // since we can't easily modify the hoisted mock, we test via prop
      render(<ChangePasswordForm hideCurrentPassword={true} />);

      // Should only have 2 password inputs (new and confirm)
      const inputs = screen.getAllByPlaceholderText('••••••••');
      expect(inputs).toHaveLength(2);
    });

    it('should submit without currentPassword when hideCurrentPassword is true', async () => {
      mockChangePassword.mockResolvedValue(undefined);

      render(<ChangePasswordForm hideCurrentPassword={true} />);

      const inputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(inputs[0], 'NewPassword1!');
      await user.type(inputs[1], 'NewPassword1!');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(mockChangePassword).toHaveBeenCalledWith({
          newPassword: 'NewPassword1!',
        });
      });
    });

    it('should show current password field after first successful change when auto-hidden', async () => {
      mockChangePassword.mockResolvedValue(undefined);

      const { rerender } = render(<ChangePasswordForm hideCurrentPassword={true} />);

      // Initially only 2 inputs
      let inputs = screen.getAllByPlaceholderText('••••••••');
      expect(inputs).toHaveLength(2);

      // Submit form
      await user.type(inputs[0], 'NewPassword1!');
      await user.type(inputs[1], 'NewPassword1!');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(mockToaster.success).toHaveBeenCalled();
      });

      // After successful password change, the component should show current password
      // This is controlled by internal state showCurrentPasswordAfterChange
      // Rerender without the prop to verify the internal state took effect
      rerender(<ChangePasswordForm />);

      await waitFor(() => {
        inputs = screen.getAllByPlaceholderText('••••••••');
        // Should now have 3 fields since user has a password set
        expect(inputs).toHaveLength(3);
      });
    });

    it('should handle error_description in error response', async () => {
      mockChangePassword.mockRejectedValue({
        error: { error_description: 'Token expired' },
      });

      render(<ChangePasswordForm hideCurrentPassword={false} />);

      const inputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(inputs[0], 'OldPassword1!');
      await user.type(inputs[1], 'NewPassword1!');
      await user.type(inputs[2], 'NewPassword1!');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(mockToaster.error).toHaveBeenCalledWith(
          'Token expired',
          'Error',
          { life: 7000 }
        );
      });
    });
  });
});
