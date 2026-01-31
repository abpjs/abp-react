import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock profile data
const mockProfile = {
  userName: 'testuser',
  email: 'test@example.com',
  name: 'Test',
  surname: 'User',
  phoneNumber: '+1234567890',
};

// Mock profile hook
const mockFetchProfile = vi.fn();
const mockUpdateProfile = vi.fn();
const mockUseProfile = vi.fn(() => ({
  profile: mockProfile,
  loading: false,
  error: null,
  fetchProfile: mockFetchProfile,
  updateProfile: mockUpdateProfile,
  changePassword: vi.fn(),
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
        'AbpAccount::UserName': 'Username',
        'AbpAccount::EmailAddress': 'Email Address',
        'AbpAccount::DisplayName:Name': 'Name',
        'AbpAccount::DisplayName:Surname': 'Surname',
        'AbpAccount::PhoneNumber': 'Phone Number',
        'AbpAccount::Submit': 'Submit',
        'AbpAccount::PersonalSettingsSaved': 'Personal settings have been saved successfully.',
        'AbpAccount::Success': 'Success',
        'AbpAccount::DefaultErrorMessage': 'An error occurred',
        'AbpUi::Error': 'Error',
      };
      return translations[key] || key;
    },
  }),
  useProfile: () => mockUseProfile(),
  Profile: {},
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
  Input: React.forwardRef(({ id, type, ...props }: any, ref: any) => (
    <input ref={ref} id={id} type={type} data-testid={id} {...props} />
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
  InputGroup: ({ children, startElement, width, ...props }: any) => (
    <div data-testid="input-group" {...props}>{children}</div>
  ),
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuUser: () => <span data-testid="user-icon" />,
  LuMail: () => <span data-testid="mail-icon" />,
  LuPhone: () => <span data-testid="phone-icon" />,
}));

import { PersonalSettingsForm } from '../../components/PersonalSettingsForm/PersonalSettingsForm';

describe('PersonalSettingsForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchProfile.mockReset();
    mockUpdateProfile.mockReset();
    mockUseProfile.mockClear();
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      fetchProfile: mockFetchProfile,
      updateProfile: mockUpdateProfile,
      changePassword: vi.fn(),
    });
  });

  it('should render the form with all fields', () => {
    render(<PersonalSettingsForm />);

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Surname')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should call fetchProfile on mount', () => {
    render(<PersonalSettingsForm />);

    expect(mockFetchProfile).toHaveBeenCalled();
  });

  it('should populate form with profile data', async () => {
    render(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
      expect(screen.getByTestId('email')).toHaveValue('test@example.com');
      expect(screen.getByTestId('name')).toHaveValue('Test');
      expect(screen.getByTestId('surname')).toHaveValue('User');
      expect(screen.getByTestId('phone-number')).toHaveValue('+1234567890');
    });
  });

  it('should show validation error for empty username', async () => {
    render(<PersonalSettingsForm />);

    const usernameInput = screen.getByTestId('user-name');
    await user.clear(usernameInput);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for empty email', async () => {
    render(<PersonalSettingsForm />);

    const emailInput = screen.getByTestId('email');
    await user.clear(emailInput);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<PersonalSettingsForm />);

    const emailInput = screen.getByTestId('email');
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should call updateProfile on valid form submission', async () => {
    mockUpdateProfile.mockResolvedValue(mockProfile);

    render(<PersonalSettingsForm />);

    // Wait for form to be populated
    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
      });
    });
  });

  it('should show success toast on successful profile update', async () => {
    mockUpdateProfile.mockResolvedValue(mockProfile);

    render(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToaster.success).toHaveBeenCalledWith(
        'Personal settings have been saved successfully.',
        'Success'
      );
    });
  });

  it('should call onSuccess callback on successful update', async () => {
    mockUpdateProfile.mockResolvedValue(mockProfile);
    const onSuccess = vi.fn();

    render(<PersonalSettingsForm onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show error toast on update failure', async () => {
    mockUpdateProfile.mockRejectedValue({
      error: { error: { message: 'Email already exists' } },
    });

    render(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToaster.error).toHaveBeenCalledWith(
        'Email already exists',
        'Error',
        { life: 7000 }
      );
    });
  });

  it('should call onError callback on update failure', async () => {
    mockUpdateProfile.mockRejectedValue({
      error: { error: { message: 'Email already exists' } },
    });
    const onError = vi.fn();

    render(<PersonalSettingsForm onError={onError} />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Email already exists');
    });
  });

  it('should render nothing while loading with no profile', () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: true,
      error: null,
      fetchProfile: mockFetchProfile,
      updateProfile: mockUpdateProfile,
      changePassword: vi.fn(),
    });

    const { container } = render(<PersonalSettingsForm />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render form when profile is available even if loading', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: true,
      error: null,
      fetchProfile: mockFetchProfile,
      updateProfile: mockUpdateProfile,
      changePassword: vi.fn(),
    });

    render(<PersonalSettingsForm />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should disable submit button while in progress', async () => {
    let resolvePromise: (value: any) => void;
    mockUpdateProfile.mockImplementation(() => new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    render(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
    });

    // Resolve to clean up
    resolvePromise!(mockProfile);
  });

  it('should update form when profile data changes', async () => {
    const { rerender } = render(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    // Simulate profile update
    const updatedProfile = {
      ...mockProfile,
      userName: 'updateduser',
      email: 'updated@example.com',
    };

    mockUseProfile.mockReturnValue({
      profile: updatedProfile,
      loading: false,
      error: null,
      fetchProfile: mockFetchProfile,
      updateProfile: mockUpdateProfile,
      changePassword: vi.fn(),
    });

    rerender(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('updateduser');
      expect(screen.getByTestId('email')).toHaveValue('updated@example.com');
    });
  });

  it('should handle optional fields as empty strings', async () => {
    mockUseProfile.mockReturnValue({
      profile: {
        userName: 'testuser',
        email: 'test@example.com',
        name: '',
        surname: '',
        phoneNumber: '',
      },
      loading: false,
      error: null,
      fetchProfile: mockFetchProfile,
      updateProfile: mockUpdateProfile,
      changePassword: vi.fn(),
    });

    mockUpdateProfile.mockResolvedValue({});

    render(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        userName: 'testuser',
        email: 'test@example.com',
        name: '',
        surname: '',
        phoneNumber: '',
      });
    });
  });

  it('should show default error message when no specific error provided', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('Network error'));

    render(<PersonalSettingsForm />);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveValue('testuser');
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToaster.error).toHaveBeenCalledWith(
        'An error occurred',
        'Error',
        { life: 7000 }
      );
    });
  });
});
