import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAccountSettingsCaptcha } from '../../../admin/components/account-settings-captcha.component';
import type { AccountCaptchaService } from '../../../admin/services/account-captcha.service';
import type { AccountCaptchaSettings } from '../../../admin/models/account-settings';

function createMockCaptchaService(): AccountCaptchaService {
  return {
    apiName: 'default',
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  } as unknown as AccountCaptchaService;
}

const mockCaptchaSettings: AccountCaptchaSettings = {
  useCaptchaOnLogin: true,
  useCaptchaOnRegistration: false,
  verifyBaseUrl: 'https://www.google.com/recaptcha/api/siteverify',
  siteKey: 'test-site-key',
  siteSecret: 'test-site-secret',
  version: 3,
};

describe('useAccountSettingsCaptcha', () => {
  let mockService: AccountCaptchaService;

  beforeEach(() => {
    mockService = createMockCaptchaService();
  });

  describe('loading', () => {
    it('should load captcha settings on mount', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsCaptcha({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockCaptchaSettings);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should default isTenant to false', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsCaptcha({ service: mockService })
      );

      expect(result.current.isTenant).toBe(false);
    });
  });

  describe('submit as host', () => {
    it('should submit all settings when not tenant', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsCaptcha({ service: mockService, isTenant: false })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit({
          useCaptchaOnLogin: false,
          version: 2,
          siteKey: 'new-key',
          siteSecret: 'new-secret',
        });
      });

      // Host submits all settings without mapping
      expect(mockService.updateSettings).toHaveBeenCalledWith({
        useCaptchaOnLogin: false,
        version: 2,
        siteKey: 'new-key',
        siteSecret: 'new-secret',
      });
    });
  });

  describe('submit as tenant (v4.0.0 tenant mapping)', () => {
    it('should only submit version, siteKey, siteSecret for tenant', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsCaptcha({ service: mockService, isTenant: true })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit({
          useCaptchaOnLogin: false,
          useCaptchaOnRegistration: true,
          verifyBaseUrl: 'https://changed.com',
          version: 2,
          siteKey: 'tenant-key',
          siteSecret: 'tenant-secret',
        });
      });

      // Tenant mapping should only include version, siteKey, siteSecret
      expect(mockService.updateSettings).toHaveBeenCalledWith({
        version: 2,
        siteKey: 'tenant-key',
        siteSecret: 'tenant-secret',
      });
    });

    it('should set isTenant to true when option is provided', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsCaptcha({ service: mockService, isTenant: true })
      );

      expect(result.current.isTenant).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle load errors', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Captcha load failed')
      );

      const { result } = renderHook(() =>
        useAccountSettingsCaptcha({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Captcha load failed');
        expect(result.current.settings).toBeNull();
      });
    });

    it('should handle submit errors', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCaptchaSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Captcha update failed')
      );

      const { result } = renderHook(() =>
        useAccountSettingsCaptcha({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit({ version: 2 });
      });

      expect(result.current.error).toBe('Captcha update failed');
    });
  });
});
