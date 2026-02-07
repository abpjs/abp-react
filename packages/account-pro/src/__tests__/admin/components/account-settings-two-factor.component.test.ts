import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAccountSettingsTwoFactor } from '../../../admin/components/account-settings-two-factor.component';
import { eTwoFactorBehaviour } from '../../../admin/enums/two-factor-behaviour';
import type { AccountTwoFactorSettingService } from '../../../admin/services/account-two-factor-settings.service';
import type { AccountTwoFactorSettingsDto } from '../../../admin/models/account-settings';

function createMockTwoFactorService(): AccountTwoFactorSettingService {
  return {
    apiName: 'default',
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  } as unknown as AccountTwoFactorSettingService;
}

const mockTwoFactorSettings: AccountTwoFactorSettingsDto = {
  isTwoFactorEnabled: true,
  twoFactorBehaviour: eTwoFactorBehaviour.Optional,
  isRememberBrowserEnabled: true,
  usersCanChange: false,
};

describe('useAccountSettingsTwoFactor', () => {
  let mockService: AccountTwoFactorSettingService;

  beforeEach(() => {
    mockService = createMockTwoFactorService();
  });

  describe('loading', () => {
    it('should load two-factor settings on mount', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockTwoFactorSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsTwoFactor({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockTwoFactorSettings);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should default isTenant to false', () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockTwoFactorSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsTwoFactor({ service: mockService })
      );

      expect(result.current.isTenant).toBe(false);
    });
  });

  describe('eTwoFactorBehaviour exposure', () => {
    it('should expose eTwoFactorBehaviour enum', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockTwoFactorSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsTwoFactor({ service: mockService })
      );

      expect(result.current.eTwoFactorBehaviour).toBe(eTwoFactorBehaviour);
      expect(result.current.eTwoFactorBehaviour.Optional).toBe(0);
      expect(result.current.eTwoFactorBehaviour.Disabled).toBe(1);
      expect(result.current.eTwoFactorBehaviour.Forced).toBe(2);
    });
  });

  describe('submit', () => {
    it('should submit two-factor settings', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockTwoFactorSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockTwoFactorSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsTwoFactor({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit({
          isTwoFactorEnabled: false,
          twoFactorBehaviour: eTwoFactorBehaviour.Disabled,
        });
      });

      expect(mockService.updateSettings).toHaveBeenCalledWith({
        isTwoFactorEnabled: false,
        twoFactorBehaviour: eTwoFactorBehaviour.Disabled,
      });
    });
  });

  describe('with tenant', () => {
    it('should pass isTenant through to base hook', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockTwoFactorSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsTwoFactor({ service: mockService, isTenant: true })
      );

      expect(result.current.isTenant).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle load errors', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Two-factor load failed')
      );

      const { result } = renderHook(() =>
        useAccountSettingsTwoFactor({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Two-factor load failed');
      });
    });
  });
});
