import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAccountSettingsExternalProvider } from '../../../admin/components/account-settings-external-provider.component';
import type { AccountExternalProviderService } from '../../../admin/services/account-external-provider.service';
import type {
  AccountExternalProviderSettings,
  AccountExternalProviderSetting,
} from '../../../admin/models/account-settings';

function createMockExternalProviderService(): AccountExternalProviderService {
  return {
    apiName: 'default',
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  } as unknown as AccountExternalProviderService;
}

const mockProviderSettings: AccountExternalProviderSettings = {
  settings: [
    {
      name: 'Google',
      enabled: true,
      properties: [{ name: 'ClientId', value: 'google-id' }],
      secretProperties: [{ name: 'ClientSecret', value: 'google-secret' }],
    },
    {
      name: 'Microsoft',
      enabled: false,
      properties: [{ name: 'ClientId', value: 'ms-id' }],
      secretProperties: [{ name: 'ClientSecret', value: 'ms-secret' }],
    },
  ],
};

describe('useAccountSettingsExternalProvider', () => {
  let mockService: AccountExternalProviderService;

  beforeEach(() => {
    mockService = createMockExternalProviderService();
  });

  describe('loading', () => {
    it('should load provider settings on mount', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockProviderSettings);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should default isTenant to false', () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({ service: mockService })
      );

      expect(result.current.isTenant).toBe(false);
    });
  });

  describe('tenant initial settings mapping', () => {
    it('should add useHostSettings=true to settings without it when isTenant', async () => {
      const settingsWithoutHost: AccountExternalProviderSettings = {
        settings: [
          {
            name: 'Google',
            enabled: true,
            properties: [{ name: 'ClientId', value: 'id' }],
            secretProperties: [],
          },
        ],
      };

      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        settingsWithoutHost
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({
          service: mockService,
          isTenant: true,
        })
      );

      await waitFor(() => {
        expect(result.current.settings?.settings[0].useHostSettings).toBe(true);
      });
    });

    it('should preserve existing useHostSettings=false when isTenant', async () => {
      const settingsWithHost: AccountExternalProviderSettings = {
        settings: [
          {
            name: 'Google',
            enabled: true,
            properties: [],
            secretProperties: [],
            useHostSettings: false,
          },
        ],
      };

      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        settingsWithHost
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({
          service: mockService,
          isTenant: true,
        })
      );

      await waitFor(() => {
        expect(result.current.settings?.settings[0].useHostSettings).toBe(false);
      });
    });

    it('should NOT add useHostSettings mapping when host', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({
          service: mockService,
          isTenant: false,
        })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockProviderSettings);
        // Original settings don't have useHostSettings
        expect(
          result.current.settings?.settings[0].useHostSettings
        ).toBeUndefined();
      });
    });
  });

  describe('submit as host', () => {
    it('should submit provider settings directly for host', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({
          service: mockService,
          isTenant: false,
        })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      const updatedSettings: AccountExternalProviderSetting[] = [
        {
          name: 'Google',
          enabled: false,
          properties: [{ name: 'ClientId', value: 'new-id' }],
          secretProperties: [{ name: 'ClientSecret', value: 'new-secret' }],
        },
      ];

      await act(async () => {
        await result.current.submit(updatedSettings);
      });

      // Host wraps in settings object, no mapping
      expect(mockService.updateSettings).toHaveBeenCalledWith({
        settings: updatedSettings,
      });
    });
  });

  describe('submit as tenant (v4.0.0 tenant mapping)', () => {
    it('should clear property values for providers using host settings', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({
          service: mockService,
          isTenant: true,
        })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      const tenantSettings: AccountExternalProviderSetting[] = [
        {
          name: 'Google',
          enabled: true,
          properties: [{ name: 'ClientId', value: 'google-id' }],
          secretProperties: [{ name: 'ClientSecret', value: 'google-secret' }],
          useHostSettings: true,
        },
        {
          name: 'Microsoft',
          enabled: true,
          properties: [{ name: 'ClientId', value: 'ms-id' }],
          secretProperties: [{ name: 'ClientSecret', value: 'ms-secret' }],
          useHostSettings: false,
        },
      ];

      await act(async () => {
        await result.current.submit(tenantSettings);
      });

      // Check that Google (useHostSettings=true) has cleared values
      const submittedArg = (
        mockService.updateSettings as ReturnType<typeof vi.fn>
      ).mock.calls[0][0];

      // Google should have empty values (useHostSettings=true)
      expect(submittedArg.settings[0].name).toBe('Google');
      expect(submittedArg.settings[0].properties[0].value).toBe('');
      expect(submittedArg.settings[0].secretProperties[0].value).toBe('');

      // Microsoft should keep values (useHostSettings=false)
      expect(submittedArg.settings[1].name).toBe('Microsoft');
      expect(submittedArg.settings[1].properties[0].value).toBe('ms-id');
      expect(submittedArg.settings[1].secretProperties[0].value).toBe('ms-secret');
    });

    it('should preserve name and enabled for all providers', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({
          service: mockService,
          isTenant: true,
        })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      const tenantSettings: AccountExternalProviderSetting[] = [
        {
          name: 'Google',
          enabled: false,
          properties: [{ name: 'ClientId', value: 'any' }],
          secretProperties: [],
          useHostSettings: true,
        },
      ];

      await act(async () => {
        await result.current.submit(tenantSettings);
      });

      const submittedArg = (
        mockService.updateSettings as ReturnType<typeof vi.fn>
      ).mock.calls[0][0];

      expect(submittedArg.settings[0].name).toBe('Google');
      expect(submittedArg.settings[0].enabled).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle load errors', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Provider load failed')
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Provider load failed');
        expect(result.current.settings).toBeNull();
      });
    });

    it('should handle non-Error load errors', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        'string error'
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load settings');
      });
    });

    it('should handle submit errors', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Provider update failed')
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit([]);
      });

      expect(result.current.error).toBe('Provider update failed');
    });

    it('should handle non-Error submit errors', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProviderSettings
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        42
      );

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit([]);
      });

      expect(result.current.error).toBe('Failed to update settings');
    });
  });

  describe('reload', () => {
    it('should reload settings', async () => {
      const updatedSettings: AccountExternalProviderSettings = {
        settings: [
          {
            name: 'Twitter',
            enabled: true,
            properties: [],
            secretProperties: [],
          },
        ],
      };

      (mockService.getSettings as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(mockProviderSettings)
        .mockResolvedValueOnce(updatedSettings);

      const { result } = renderHook(() =>
        useAccountSettingsExternalProvider({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockProviderSettings);
      });

      await act(async () => {
        await result.current.reload();
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(updatedSettings);
      });
    });
  });
});
