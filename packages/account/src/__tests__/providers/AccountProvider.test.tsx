import { describe, it, expect, vi } from 'vitest';
import { renderHook, render, screen } from '@testing-library/react';
import React from 'react';
import {
  AccountProvider,
  useAccountContext,
  useAccountOptions,
} from '../../providers/AccountProvider';

describe('AccountProvider', () => {
  describe('AccountProvider component', () => {
    it('should render children', () => {
      render(
        <AccountProvider>
          <div data-testid="child">Child content</div>
        </AccountProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Child content');
    });

    it('should accept custom options', () => {
      const TestComponent = () => {
        const options = useAccountOptions();
        return <div data-testid="redirect">{options.redirectUrl}</div>;
      };

      render(
        <AccountProvider options={{ redirectUrl: '/dashboard' }}>
          <TestComponent />
        </AccountProvider>
      );

      expect(screen.getByTestId('redirect')).toHaveTextContent('/dashboard');
    });
  });

  describe('useAccountContext', () => {
    it('should return context value when inside provider', () => {
      const { result } = renderHook(() => useAccountContext(), {
        wrapper: ({ children }) => <AccountProvider>{children}</AccountProvider>,
      });

      expect(result.current).toBeDefined();
      expect(result.current.options).toBeDefined();
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAccountContext());
      }).toThrow('useAccountContext must be used within an AccountProvider');

      consoleSpy.mockRestore();
    });

    it('should return options with default values', () => {
      const { result } = renderHook(() => useAccountContext(), {
        wrapper: ({ children }) => <AccountProvider>{children}</AccountProvider>,
      });

      expect(result.current.options.redirectUrl).toBe('/');
    });

    it('should return options with custom values', () => {
      const { result } = renderHook(() => useAccountContext(), {
        wrapper: ({ children }) => (
          <AccountProvider options={{ redirectUrl: '/custom' }}>
            {children}
          </AccountProvider>
        ),
      });

      expect(result.current.options.redirectUrl).toBe('/custom');
    });
  });

  describe('useAccountOptions', () => {
    it('should return default options when outside provider', () => {
      const { result } = renderHook(() => useAccountOptions());

      expect(result.current.redirectUrl).toBe('/');
    });

    it('should return provider options when inside provider', () => {
      const { result } = renderHook(() => useAccountOptions(), {
        wrapper: ({ children }) => (
          <AccountProvider options={{ redirectUrl: '/home' }}>
            {children}
          </AccountProvider>
        ),
      });

      expect(result.current.redirectUrl).toBe('/home');
    });

    it('should merge custom options with defaults', () => {
      const { result } = renderHook(() => useAccountOptions(), {
        wrapper: ({ children }) => (
          <AccountProvider options={{ redirectUrl: '/merged' }}>
            {children}
          </AccountProvider>
        ),
      });

      expect(result.current.redirectUrl).toBe('/merged');
    });
  });
});
