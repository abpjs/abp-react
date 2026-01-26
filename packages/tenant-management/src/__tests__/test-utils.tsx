import React, { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Mock RestService for testing service calls
 */
export interface MockRestService {
  request: ReturnType<typeof vi.fn>;
}

export function createMockRestService(): MockRestService {
  return {
    request: vi.fn(),
  };
}

/**
 * Mock for @abpjs/core's useRestService hook
 */
export const mockRestService = createMockRestService();

/**
 * Mock for @abpjs/core's useLocalization hook
 */
export const mockUseLocalization = vi.fn(() => ({
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
  instant: (key: string) => key,
  languages: [{ cultureName: 'en', displayName: 'English' }],
  localization: {},
}));

// Mock @abpjs/core module
vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
  useLocalization: () => mockUseLocalization(),
  eLayoutType: {
    application: 'application',
    account: 'account',
    empty: 'empty',
  },
}));

/**
 * Basic wrapper for testing
 */
function TestWrapper({ children }: { children: ReactNode }): ReactElement {
  return <>{children}</>;
}

/**
 * Custom render function that wraps components with test providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: TestWrapper, ...options });
}

/**
 * Reset all mocks between tests
 */
export function resetMocks(): void {
  mockRestService.request.mockReset();
  mockUseLocalization.mockClear();
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };
