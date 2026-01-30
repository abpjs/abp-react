import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { PersonalSettings } from '../components/PersonalSettings';

const mockGetProfile = vi.fn();
const mockUpdateProfile = vi.fn();
const mockToasterSuccess = vi.fn();

vi.mock('../hooks/useAccountProService', () => ({
  useAccountProService: () => ({
    getProfile: mockGetProfile,
    updateProfile: mockUpdateProfile,
  }),
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
  useToaster: () => ({ success: mockToasterSuccess, error: vi.fn() }),
}));

describe('PersonalSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProfile.mockResolvedValue({
      userName: 'testuser',
      email: 'test@example.com',
      name: 'Test',
      surname: 'User',
      phoneNumber: '+1234567890',
    });
  });

  it('should render loading state initially', () => {
    mockGetProfile.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<PersonalSettings />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render the form after loading profile', async () => {
    render(<PersonalSettings />);
    await waitFor(() => {
      expect(screen.getByText('AbpAccount::PersonalSettings')).toBeInTheDocument();
    });
  });

  it('should populate form with profile data', async () => {
    render(<PersonalSettings />);
    await waitFor(() => {
      const userNameInput = document.getElementById('userName') as HTMLInputElement;
      expect(userNameInput?.value).toBe('testuser');
    });
  });

  it('should not call updateProfile when form is invalid', async () => {
    render(<PersonalSettings />);
    await waitFor(() => {
      expect(document.getElementById('userName')).toBeInTheDocument();
    });
    const userNameInput = document.getElementById('userName') as HTMLInputElement;
    await userEvent.clear(userNameInput);
    fireEvent.click(screen.getByTestId('submit-btn'));
    // The form validation should prevent API call
    await waitFor(() => {
      expect(mockUpdateProfile).not.toHaveBeenCalled();
    });
  });

  it('should not submit when email is invalid', async () => {
    render(<PersonalSettings />);
    await waitFor(() => {
      expect(document.getElementById('email')).toBeInTheDocument();
    });
    const emailInput = document.getElementById('email') as HTMLInputElement;
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.click(screen.getByTestId('submit-btn'));
    // The form validation should prevent API call
    await waitFor(() => {
      expect(mockUpdateProfile).not.toHaveBeenCalled();
    });
  });

  it('should call updateProfile on valid submission', async () => {
    mockUpdateProfile.mockResolvedValue({ userName: 'testuser', email: 'test@example.com' });
    render(<PersonalSettings />);
    await waitFor(() => {
      expect(document.getElementById('userName')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it('should call onSuccess callback after profile updated', async () => {
    mockUpdateProfile.mockResolvedValue({ userName: 'testuser', email: 'test@example.com' });
    const onSuccess = vi.fn();
    render(<PersonalSettings onSuccess={onSuccess} />);
    await waitFor(() => {
      expect(document.getElementById('userName')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show error on API failure', async () => {
    mockUpdateProfile.mockRejectedValue({ message: 'Update failed' });
    render(<PersonalSettings />);
    await waitFor(() => {
      expect(document.getElementById('userName')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('Update failed');
    });
  });

  it('should call onError callback on failure', async () => {
    mockUpdateProfile.mockRejectedValue({ message: 'Error' });
    const onError = vi.fn();
    render(<PersonalSettings onError={onError} />);
    await waitFor(() => {
      expect(document.getElementById('userName')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Error');
    });
  });

  it('should show error when getProfile fails', async () => {
    mockGetProfile.mockRejectedValue({ message: 'Failed to load profile' });
    render(<PersonalSettings />);
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('Failed to load profile');
    });
  });
});
