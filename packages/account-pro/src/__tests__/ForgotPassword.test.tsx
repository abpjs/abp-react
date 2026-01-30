import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ForgotPassword } from '../components/ForgotPassword';

// Mock the hooks
const mockSendPasswordResetCode = vi.fn();
vi.mock('../hooks/useAccountProService', () => ({
  useAccountProService: () => ({
    sendPasswordResetCode: mockSendPasswordResetCode,
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
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the forgot password form', () => {
    renderWithRouter(<ForgotPassword />);

    expect(screen.getByText('AbpAccount::ForgotPassword')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });

  it('should show validation error for empty email', async () => {
    renderWithRouter(<ForgotPassword />);

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
    });
  });

  it('should show validation error for invalid email', async () => {
    renderWithRouter(<ForgotPassword />);

    const emailInput = screen.getByRole('textbox');
    await userEvent.type(emailInput, 'invalid-email');

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
    });
  });

  it('should call sendPasswordResetCode on valid submission', async () => {
    mockSendPasswordResetCode.mockResolvedValue(undefined);
    renderWithRouter(<ForgotPassword />);

    const emailInput = screen.getByRole('textbox');
    await userEvent.type(emailInput, 'test@example.com');

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSendPasswordResetCode).toHaveBeenCalledWith({
        email: 'test@example.com',
        appName: 'Angular',
      });
    });
  });

  it('should show success message after email sent', async () => {
    mockSendPasswordResetCode.mockResolvedValue(undefined);
    renderWithRouter(<ForgotPassword />);

    const emailInput = screen.getByRole('textbox');
    await userEvent.type(emailInput, 'test@example.com');

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('AbpAccount::PasswordResetMailSentMessage')).toBeInTheDocument();
    });
  });

  it('should call onSuccess callback after email sent', async () => {
    mockSendPasswordResetCode.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    renderWithRouter(<ForgotPassword onSuccess={onSuccess} />);

    const emailInput = screen.getByRole('textbox');
    await userEvent.type(emailInput, 'test@example.com');

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show error message on API failure', async () => {
    mockSendPasswordResetCode.mockRejectedValue({
      response: { data: { error: { message: 'User not found' } } },
    });
    renderWithRouter(<ForgotPassword />);

    const emailInput = screen.getByRole('textbox');
    await userEvent.type(emailInput, 'notfound@example.com');

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('User not found');
    });
  });

  it('should call onError callback on API failure', async () => {
    mockSendPasswordResetCode.mockRejectedValue({
      message: 'Network error',
    });
    const onError = vi.fn();
    renderWithRouter(<ForgotPassword onError={onError} />);

    const emailInput = screen.getByRole('textbox');
    await userEvent.type(emailInput, 'test@example.com');

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Network error');
    });
  });

  it('should render back to login link with custom URL', () => {
    renderWithRouter(<ForgotPassword loginUrl="/custom-login" />);

    const backLink = screen.getByText('AbpAccount::BackToLogin');
    expect(backLink.closest('a')).toHaveAttribute('href', '/custom-login');
  });
});
