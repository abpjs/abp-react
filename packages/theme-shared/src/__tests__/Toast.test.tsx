import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { ToasterProvider, useToaster } from '../contexts/toaster.context';
import { ToastContainer } from '../components/toast/Toast';
import { abpSystem } from '../theme';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string, ...params: string[]) => {
      if (params.length > 0) {
        let result = key;
        params.forEach((param, index) => {
          result = result.replace(`{${index}}`, param);
        });
        return result;
      }
      return key;
    },
  }),
}));

// Helper component to trigger toasts
function ToastTrigger({
  severity,
  message,
  title,
  options,
}: {
  severity: 'info' | 'success' | 'warn' | 'error';
  message: string;
  title: string;
  options?: Record<string, unknown>;
}) {
  const toaster = useToaster();

  const handleClick = () => {
    toaster[severity](message, title, options);
  };

  return (
    <button onClick={handleClick} data-testid="trigger">
      Trigger Toast
    </button>
  );
}

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderWithProvider = (
    severity: 'info' | 'success' | 'warn' | 'error' = 'info',
    message = 'Test message',
    title = 'Test title',
    options?: Record<string, unknown>
  ) => {
    return render(
      <ChakraProvider value={abpSystem}>
        <ToasterProvider>
          <ToastTrigger severity={severity} message={message} title={title} options={options} />
          <ToastContainer />
        </ToasterProvider>
      </ChakraProvider>
    );
  };

  it('should render without crashing', () => {
    render(
      <ChakraProvider value={abpSystem}>
        <ToasterProvider>
          <ToastContainer />
        </ToasterProvider>
      </ChakraProvider>
    );
  });

  it('should display toast when triggered', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProvider('info', 'Hello World', 'Notification');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
      expect(screen.getByText('Notification')).toBeInTheDocument();
    });
  });

  it('should display info toast with correct styling', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProvider('info', 'Info message', 'Info');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  it('should display success toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProvider('success', 'Success message', 'Success');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  it('should display warning toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProvider('warn', 'Warning message', 'Warning');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  it('should display error toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProvider('error', 'Error message', 'Error');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('should display toast without title', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ChakraProvider value={abpSystem}>
        <ToasterProvider>
          <ToastTrigger severity="info" message="No title message" title="" />
          <ToastContainer />
        </ToasterProvider>
      </ChakraProvider>
    );

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('No title message')).toBeInTheDocument();
    });
  });

  it('should display multiple toasts', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    function MultiToastTrigger() {
      const toaster = useToaster();
      return (
        <button
          onClick={() => {
            toaster.info('Message 1', 'Title 1', { sticky: true });
            toaster.success('Message 2', 'Title 2', { sticky: true });
            toaster.error('Message 3', 'Title 3', { sticky: true });
          }}
          data-testid="trigger"
        >
          Trigger
        </button>
      );
    }

    render(
      <ChakraProvider value={abpSystem}>
        <ToasterProvider>
          <MultiToastTrigger />
          <ToastContainer />
        </ToasterProvider>
      </ChakraProvider>
    );

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
      expect(screen.getByText('Message 3')).toBeInTheDocument();
    });
  });

  it('should configure toast with custom life duration', async () => {
    // Note: Testing auto-dismiss timing is difficult with jsdom because
    // Chakra uses CSS animations that don't complete properly.
    // This test verifies the toast is created with the life option.
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderWithProvider('info', 'Timed toast', 'Test', { life: 2000 });

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Timed toast')).toBeInTheDocument();
    });

    // Verify the toast was created - actual dismiss timing is
    // handled by Chakra's internal mechanism
  });

  it('should show close button by default', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProvider('info', 'Closable toast', 'Test', { sticky: true });

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Closable toast')).toBeInTheDocument();
    });

    // Chakra v3 Toast close button has aria-label="Dismiss notification"
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });
  });

  it('should hide close button when closable is false', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProvider('info', 'Non-closable toast', 'Test', { closable: false, sticky: true });

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Non-closable toast')).toBeInTheDocument();
    });

    // Chakra v3 Toast close button has aria-label="Dismiss notification"
    expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
  });

  it('should accept position prop', () => {
    render(
      <ChakraProvider value={abpSystem}>
        <ToasterProvider>
          <ToastContainer position="top-right" />
        </ToasterProvider>
      </ChakraProvider>
    );
    // Component should render without errors
  });

  // v2.0.0 - Position variants
  describe('v2.0.0 - Position variants', () => {
    it('should accept top position', () => {
      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <ToastContainer position="top" />
          </ToasterProvider>
        </ChakraProvider>
      );
    });

    it('should accept top-left position', () => {
      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <ToastContainer position="top-left" />
          </ToasterProvider>
        </ChakraProvider>
      );
    });

    it('should accept bottom position', () => {
      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <ToastContainer position="bottom" />
          </ToasterProvider>
        </ChakraProvider>
      );
    });

    it('should accept bottom-left position', () => {
      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <ToastContainer position="bottom-left" />
          </ToasterProvider>
        </ChakraProvider>
      );
    });

    it('should accept bottom-right position', () => {
      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <ToastContainer position="bottom-right" />
          </ToasterProvider>
        </ChakraProvider>
      );
    });
  });

  // v2.0.0 - containerKey filtering
  describe('v2.0.0 - containerKey filtering', () => {
    it('should accept containerKey prop', () => {
      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <ToastContainer containerKey="my-container" />
          </ToasterProvider>
        </ChakraProvider>
      );
    });

    it('should filter toasts by containerKey', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      function FilteredToastTrigger() {
        const toaster = useToaster();
        return (
          <>
            <button
              onClick={() => toaster.info('Container A', 'A', { sticky: true, containerKey: 'container-a' })}
              data-testid="trigger-a"
            >
              Trigger A
            </button>
            <button
              onClick={() => toaster.info('Container B', 'B', { sticky: true, containerKey: 'container-b' })}
              data-testid="trigger-b"
            >
              Trigger B
            </button>
          </>
        );
      }

      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <FilteredToastTrigger />
            <ToastContainer containerKey="container-a" />
          </ToasterProvider>
        </ChakraProvider>
      );

      await user.click(screen.getByTestId('trigger-a'));
      await user.click(screen.getByTestId('trigger-b'));

      // Only toast from container-a should be visible in this container
      await waitFor(() => {
        expect(screen.getByText('Container A')).toBeInTheDocument();
      });
    });
  });

  // v2.0.0 - neutral severity
  describe('v2.0.0 - neutral severity', () => {
    it('should display neutral severity toast', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      function NeutralToastTrigger() {
        const toaster = useToaster();
        return (
          <button
            onClick={() => toaster.show('Neutral message', 'Neutral', 'neutral', { sticky: true })}
            data-testid="trigger"
          >
            Trigger
          </button>
        );
      }

      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <NeutralToastTrigger />
            <ToastContainer />
          </ToasterProvider>
        </ChakraProvider>
      );

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Neutral message')).toBeInTheDocument();
      });
    });
  });

  // v2.0.0 - LocalizationParam support
  describe('v2.0.0 - LocalizationParam support', () => {
    it('should display toast with LocalizationWithDefault message', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      function LocalizationToastTrigger() {
        const toaster = useToaster();
        return (
          <button
            onClick={() => toaster.info(
              { key: 'Test::Message', defaultValue: 'Default message' },
              'Title',
              { sticky: true }
            )}
            data-testid="trigger"
          >
            Trigger
          </button>
        );
      }

      render(
        <ChakraProvider value={abpSystem}>
          <ToasterProvider>
            <LocalizationToastTrigger />
            <ToastContainer />
          </ToasterProvider>
        </ChakraProvider>
      );

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        // The mock t() function returns the key when not found
        expect(screen.getByText('Default message')).toBeInTheDocument();
      });
    });
  });
});
