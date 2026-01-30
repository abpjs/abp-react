import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { AccountProProvider, useAccountProOptions, useAccountProContext } from '../providers';

describe('AccountProProvider', () => {
  describe('useAccountProOptions', () => {
    it('should return default options when not in provider', () => {
      const { result } = renderHook(() => useAccountProOptions());

      expect(result.current.redirectUrl).toBe('/');
      expect(result.current.redirectToLogin).toBe(true);
      expect(result.current.loginUrl).toBe('/account/login');
      expect(result.current.registerUrl).toBe('/account/register');
      expect(result.current.enableSocialLogins).toBe(false);
      expect(result.current.enableTwoFactor).toBe(false);
    });

    it('should return merged options when in provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AccountProProvider options={{ redirectUrl: '/dashboard', enableTwoFactor: true }}>
          {children}
        </AccountProProvider>
      );

      const { result } = renderHook(() => useAccountProOptions(), { wrapper });

      expect(result.current.redirectUrl).toBe('/dashboard');
      expect(result.current.enableTwoFactor).toBe(true);
      expect(result.current.redirectToLogin).toBe(true); // Default preserved
    });
  });

  describe('useAccountProContext', () => {
    it('should throw error when not in provider', () => {
      expect(() => {
        renderHook(() => useAccountProContext());
      }).toThrow('useAccountProContext must be used within an AccountProProvider');
    });

    it('should return context when in provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AccountProProvider options={{ redirectUrl: '/custom' }}>
          {children}
        </AccountProProvider>
      );

      const { result } = renderHook(() => useAccountProContext(), { wrapper });

      expect(result.current.options.redirectUrl).toBe('/custom');
    });
  });
});
