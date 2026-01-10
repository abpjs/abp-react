import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSharedProvider } from '../providers/ThemeSharedProvider';
import { useToaster } from '../contexts/toaster.context';
import { useConfirmation } from '../contexts/confirmation.context';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    instant: (key: string) => key,
  }),
}));

// Helper components for testing
function ToastTestComponent() {
  const toaster = useToaster();

  return (
    <button onClick={() => toaster.success('Test toast', 'Success')}>
      Show Toast
    </button>
  );
}

function ConfirmationTestComponent() {
  const confirmation = useConfirmation();

  return (
    <button onClick={() => confirmation.warn('Are you sure?', 'Confirm')}>
      Show Confirmation
    </button>
  );
}

describe('ThemeSharedProvider', () => {
  const user = userEvent.setup();

  it('should render children', () => {
    render(
      <ThemeSharedProvider>
        <div>Child content</div>
      </ThemeSharedProvider>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should provide toaster context', () => {
    render(
      <ThemeSharedProvider>
        <ToastTestComponent />
      </ThemeSharedProvider>
    );

    expect(screen.getByRole('button', { name: 'Show Toast' })).toBeInTheDocument();
  });

  it('should provide confirmation context', () => {
    render(
      <ThemeSharedProvider>
        <ConfirmationTestComponent />
      </ThemeSharedProvider>
    );

    expect(screen.getByRole('button', { name: 'Show Confirmation' })).toBeInTheDocument();
  });

  it('should render ToastContainer by default', async () => {
    render(
      <ThemeSharedProvider>
        <ToastTestComponent />
      </ThemeSharedProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Show Toast' }));

    await waitFor(() => {
      expect(screen.getByText('Test toast')).toBeInTheDocument();
    });
  });

  it('should render ConfirmationDialog by default', async () => {
    render(
      <ThemeSharedProvider>
        <ConfirmationTestComponent />
      </ThemeSharedProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Show Confirmation' }));

    await waitFor(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });
  });

  it('should not render ToastContainer when renderToasts is false', async () => {
    render(
      <ThemeSharedProvider renderToasts={false}>
        <ToastTestComponent />
      </ThemeSharedProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Show Toast' }));

    // Toast should be added to state but not rendered
    // since there's no ToastContainer
    expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
  });

  it('should not render ConfirmationDialog when renderConfirmation is false', async () => {
    render(
      <ThemeSharedProvider renderConfirmation={false}>
        <ConfirmationTestComponent />
      </ThemeSharedProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Show Confirmation' }));

    // Confirmation should be set in state but not rendered
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('should work with all features enabled', async () => {
    render(
      <ThemeSharedProvider>
        <ToastTestComponent />
        <ConfirmationTestComponent />
      </ThemeSharedProvider>
    );

    // Test toast
    await user.click(screen.getByRole('button', { name: 'Show Toast' }));
    await waitFor(() => {
      expect(screen.getByText('Test toast')).toBeInTheDocument();
    });

    // Test confirmation
    await user.click(screen.getByRole('button', { name: 'Show Confirmation' }));
    await waitFor(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });
  });

  it('should work with all features disabled', () => {
    render(
      <ThemeSharedProvider
        renderToasts={false}
        renderConfirmation={false}
      >
        <ToastTestComponent />
        <ConfirmationTestComponent />
      </ThemeSharedProvider>
    );

    // Components should still render (contexts are still provided)
    expect(screen.getByRole('button', { name: 'Show Toast' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Confirmation' })).toBeInTheDocument();
  });

  it('should accept theme overrides', () => {
    render(
      <ThemeSharedProvider
        themeOverrides={{
          colors: {
            brand: {
              500: '#ff0000',
            },
          },
        }}
      >
        <div>Content</div>
      </ThemeSharedProvider>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should accept toast position', () => {
    render(
      <ThemeSharedProvider toastPosition="top-right">
        <div>Content</div>
      </ThemeSharedProvider>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
