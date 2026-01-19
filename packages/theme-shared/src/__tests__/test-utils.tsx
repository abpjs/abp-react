import React, { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { ToasterProvider } from '../contexts/toaster.context';
import { ConfirmationProvider } from '../contexts/confirmation.context';
import { abpSystem } from '../theme';

/**
 * Mock for @abpjs/core's useLocalization hook.
 */
export const mockUseLocalization = vi.fn(() => ({
  t: (key: string, ...params: string[]) => {
    // Simple mock that returns the key or interpolates params
    if (params.length > 0) {
      let result = key;
      params.forEach((param, index) => {
        result = result.replace(`{${index}}`, param);
      });
      return result;
    }
    return key;
  },
  instant: (key: string, ..._params: string[]) => key, // Alias for backward compatibility
  languages: [{ cultureName: 'en', displayName: 'English' }],
  localization: {},
}));

// Mock @abpjs/core module
vi.mock('@abpjs/core', () => ({
  useLocalization: () => mockUseLocalization(),
}));

/**
 * Chakra wrapper for testing with v3.
 */
function ChakraWrapper({ children }: { children: ReactNode }): ReactElement {
  return <ChakraProvider value={abpSystem}>{children}</ChakraProvider>;
}

/**
 * All providers wrapper for testing.
 */
interface AllProvidersProps {
  children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps): ReactElement {
  return (
    <MemoryRouter>
      <ChakraProvider value={abpSystem}>
        <ToasterProvider>
          <ConfirmationProvider>{children}</ConfirmationProvider>
        </ToasterProvider>
      </ChakraProvider>
    </MemoryRouter>
  );
}

/**
 * Custom render function that wraps components with all providers.
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Wrapper for just ToasterProvider with Chakra.
 */
function ToasterWrapper({ children }: { children: ReactNode }): ReactElement {
  return (
    <ChakraProvider value={abpSystem}>
      <ToasterProvider>{children}</ToasterProvider>
    </ChakraProvider>
  );
}

/**
 * Wrapper for just ConfirmationProvider with Chakra.
 */
function ConfirmationWrapper({ children }: { children: ReactNode }): ReactElement {
  return (
    <MemoryRouter>
      <ChakraProvider value={abpSystem}>
        <ConfirmationProvider>{children}</ConfirmationProvider>
      </ChakraProvider>
    </MemoryRouter>
  );
}

/**
 * Wrapper with router only.
 */
function RouterWrapper({ children }: { children: ReactNode }): ReactElement {
  return <MemoryRouter>{children}</MemoryRouter>;
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };

// Export individual wrappers
export { AllProviders, ToasterWrapper, ConfirmationWrapper, RouterWrapper, ChakraWrapper };
