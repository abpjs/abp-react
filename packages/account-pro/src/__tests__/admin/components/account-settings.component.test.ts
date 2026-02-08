import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccountSettingsComponent } from '../../../admin/components/account-settings.component';

describe('useAccountSettingsComponent', () => {
  describe('defaults', () => {
    it('should default all flags to false', () => {
      const { result } = renderHook(() => useAccountSettingsComponent());

      expect(result.current.isLdapSettingsEnabled).toBe(false);
      expect(result.current.isTwoFactorSettingsEnabled).toBe(false);
      expect(result.current.isExternalProviderEnabled).toBe(false);
      expect(result.current.isCaptchaEnabled).toBe(false);
      expect(result.current.isTenant).toBe(false);
    });

    it('should provide an initialize function', () => {
      const { result } = renderHook(() => useAccountSettingsComponent());
      expect(typeof result.current.initialize).toBe('function');
    });
  });

  describe('with options', () => {
    it('should reflect isLdapSettingsEnabled option', () => {
      const { result } = renderHook(() =>
        useAccountSettingsComponent({ isLdapSettingsEnabled: true })
      );
      expect(result.current.isLdapSettingsEnabled).toBe(true);
    });

    it('should reflect isTwoFactorSettingsEnabled option', () => {
      const { result } = renderHook(() =>
        useAccountSettingsComponent({ isTwoFactorSettingsEnabled: true })
      );
      expect(result.current.isTwoFactorSettingsEnabled).toBe(true);
    });

    it('should reflect isExternalProviderEnabled option (v4.0.0)', () => {
      const { result } = renderHook(() =>
        useAccountSettingsComponent({ isExternalProviderEnabled: true })
      );
      expect(result.current.isExternalProviderEnabled).toBe(true);
    });

    it('should reflect isCaptchaEnabled option (v4.0.0)', () => {
      const { result } = renderHook(() =>
        useAccountSettingsComponent({ isCaptchaEnabled: true })
      );
      expect(result.current.isCaptchaEnabled).toBe(true);
    });

    it('should reflect isTenant option (v4.0.0)', () => {
      const { result } = renderHook(() =>
        useAccountSettingsComponent({ isTenant: true })
      );
      expect(result.current.isTenant).toBe(true);
    });

    it('should accept all options at once', () => {
      const { result } = renderHook(() =>
        useAccountSettingsComponent({
          isLdapSettingsEnabled: true,
          isTwoFactorSettingsEnabled: true,
          isExternalProviderEnabled: true,
          isCaptchaEnabled: true,
          isTenant: true,
        })
      );
      expect(result.current.isLdapSettingsEnabled).toBe(true);
      expect(result.current.isTwoFactorSettingsEnabled).toBe(true);
      expect(result.current.isExternalProviderEnabled).toBe(true);
      expect(result.current.isCaptchaEnabled).toBe(true);
      expect(result.current.isTenant).toBe(true);
    });
  });

  describe('initialize', () => {
    it('should reinitialize with current options', () => {
      const { result } = renderHook(() =>
        useAccountSettingsComponent({
          isLdapSettingsEnabled: true,
          isCaptchaEnabled: true,
        })
      );

      act(() => {
        result.current.initialize();
      });

      expect(result.current.isLdapSettingsEnabled).toBe(true);
      expect(result.current.isCaptchaEnabled).toBe(true);
    });
  });
});
