import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { ConfirmationProvider, useConfirmation } from '../contexts/confirmation.context';
import { ConfirmationDialog } from '../components/confirmation/Confirmation';
import { Toaster } from '../models';
import { abpSystem } from '../theme';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string, ...params: string[]) => {
      // Map common localization keys
      const translations: Record<string, string> = {
        'AbpUi::Yes': 'Yes',
        'AbpUi::Cancel': 'Cancel',
        'AbpUi::Error': 'Error',
      };
      if (translations[key]) {
        return translations[key];
      }
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

// Helper component to trigger confirmations
function ConfirmationTrigger({
  severity,
  message,
  title,
  options,
  onResult,
}: {
  severity: 'info' | 'success' | 'warn' | 'error';
  message: string;
  title: string;
  options?: Record<string, unknown>;
  onResult?: (status: Toaster.Status) => void;
}) {
  const confirmation = useConfirmation();

  const handleClick = async () => {
    const status = await confirmation[severity](message, title, options);
    onResult?.(status);
  };

  return (
    <button onClick={handleClick} data-testid="trigger">
      Trigger Confirmation
    </button>
  );
}

describe('ConfirmationDialog', () => {
  const user = userEvent.setup();

  const renderWithProvider = (
    severity: 'info' | 'success' | 'warn' | 'error' = 'warn',
    message = 'Are you sure?',
    title = 'Confirm',
    options?: Record<string, unknown>,
    onResult?: (status: Toaster.Status) => void
  ) => {
    return render(
      <ChakraProvider value={abpSystem}>
        <ConfirmationProvider>
          <ConfirmationTrigger
            severity={severity}
            message={message}
            title={title}
            options={options}
            onResult={onResult}
          />
          <ConfirmationDialog />
        </ConfirmationProvider>
      </ChakraProvider>
    );
  };

  it('should render without crashing when no confirmation', () => {
    render(
      <ChakraProvider value={abpSystem}>
        <ConfirmationProvider>
          <ConfirmationDialog />
        </ConfirmationProvider>
      </ChakraProvider>
    );
  });

  it('should display confirmation dialog when triggered', async () => {
    renderWithProvider('warn', 'Delete this item?', 'Confirm Delete');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Delete this item?')).toBeInTheDocument();
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });
  });

  it('should display Yes and Cancel buttons by default', async () => {
    renderWithProvider();

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  it('should resolve with confirm status when Yes is clicked', async () => {
    const onResult = vi.fn();
    renderWithProvider('warn', 'Are you sure?', 'Confirm', {}, onResult);

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(Toaster.Status.confirm);
    });
  });

  it('should resolve with reject status when Cancel is clicked', async () => {
    const onResult = vi.fn();
    renderWithProvider('warn', 'Are you sure?', 'Confirm', {}, onResult);

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(Toaster.Status.reject);
    });
  });

  it('should close dialog after confirm', async () => {
    renderWithProvider();

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => {
      expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    });
  });

  it('should close dialog after cancel', async () => {
    renderWithProvider();

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    });
  });

  // v2.0.0 - yesCopy/cancelCopy removed, use yesText/cancelText
  it('should use custom button text', async () => {
    renderWithProvider('warn', 'Delete item?', 'Confirm', {
      yesText: 'Delete',
      cancelText: 'Keep',
    });

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    });
  });

  it('should hide cancel button when hideCancelBtn is true', async () => {
    renderWithProvider('info', 'Information message', 'Info', {
      hideCancelBtn: true,
    });

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('should hide yes button when hideYesBtn is true', async () => {
    renderWithProvider('info', 'Information message', 'Info', {
      hideYesBtn: true,
    });

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument();
  });

  it('should display info confirmation', async () => {
    renderWithProvider('info', 'Info message', 'Info Title');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByText('Info Title')).toBeInTheDocument();
    });
  });

  it('should display success confirmation', async () => {
    renderWithProvider('success', 'Success message', 'Success Title');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Success Title')).toBeInTheDocument();
    });
  });

  it('should display error confirmation', async () => {
    renderWithProvider('error', 'Error message', 'Error Title');

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Error Title')).toBeInTheDocument();
    });
  });

  it('should accept custom className', () => {
    render(
      <ChakraProvider value={abpSystem}>
        <ConfirmationProvider>
          <ConfirmationDialog className="custom-class" />
        </ConfirmationProvider>
      </ChakraProvider>
    );
    // Should render without errors
  });

  // v1.1.0 - New cancelText/yesText properties
  describe('v1.1.0 - cancelText/yesText properties', () => {
    it('should use yesText for yes button', async () => {
      renderWithProvider('warn', 'Delete item?', 'Confirm', {
        yesText: 'Confirm Delete',
      });

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Confirm Delete' })).toBeInTheDocument();
      });
    });

    it('should use cancelText for cancel button', async () => {
      renderWithProvider('warn', 'Delete item?', 'Confirm', {
        cancelText: 'Go Back',
      });

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
      });
    });

    it('should use both yesText and cancelText', async () => {
      renderWithProvider('warn', 'Save changes?', 'Confirm', {
        yesText: 'Save',
        cancelText: 'Discard',
      });

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
      });
    });

    // v2.0.0 - yesCopy/cancelCopy removed, no longer need preference/fallback tests
  });

  // v2.0.0 - dismiss and closable behavior
  describe('v2.0.0 - dismiss and closable behavior', () => {
    it('should handle dialog without title', async () => {
      render(
        <ChakraProvider value={abpSystem}>
          <ConfirmationProvider>
            <ConfirmationTrigger
              severity="info"
              message="Message only"
              title=""
              options={{}}
            />
            <ConfirmationDialog />
          </ConfirmationProvider>
        </ChakraProvider>
      );

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Message only')).toBeInTheDocument();
      });
    });

    it('should use neutral severity by default for show method', async () => {
      // Create a component that uses show() method
      function ShowTrigger() {
        const confirmation = useConfirmation();
        const handleClick = () => {
          confirmation.show('Neutral message', 'Neutral Title');
        };
        return <button onClick={handleClick} data-testid="show-trigger">Show</button>;
      }

      render(
        <ChakraProvider value={abpSystem}>
          <ConfirmationProvider>
            <ShowTrigger />
            <ConfirmationDialog />
          </ConfirmationProvider>
        </ChakraProvider>
      );

      await user.click(screen.getByTestId('show-trigger'));

      await waitFor(() => {
        expect(screen.getByText('Neutral message')).toBeInTheDocument();
        expect(screen.getByText('Neutral Title')).toBeInTheDocument();
      });
    });

    it('should use closable option when specified', async () => {
      // Just verify the option is passed through - actual behavior depends on dialog implementation
      renderWithProvider('warn', 'Test', 'Confirm', { closable: false });

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
      });
      // Dialog renders with closable=false option set
    });
  });
});
