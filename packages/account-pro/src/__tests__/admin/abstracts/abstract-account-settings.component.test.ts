import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAccountSettings } from '../../../admin/abstracts/abstract-account-settings.component';
import type { AbstractAccountSettingsService } from '../../../admin/abstracts/abstract-account-config.service';

interface TestSettings {
  enabled: boolean;
  value: string;
}

function createMockService(): AbstractAccountSettingsService<TestSettings> {
  return {
    apiName: 'default',
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  } as unknown as AbstractAccountSettingsService<TestSettings>;
}

describe('useAccountSettings', () => {
  let mockService: AbstractAccountSettingsService<TestSettings>;

  beforeEach(() => {
    mockService = createMockService();
  });

  describe('initial loading', () => {
    it('should load settings on mount', async () => {
      const mockData: TestSettings = { enabled: true, value: 'test' };
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockData
      );

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockData);
        expect(result.current.loading).toBe(false);
      });

      expect(mockService.getSettings).toHaveBeenCalledTimes(1);
    });

    it('should set error on failed load', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Load failed')
      );

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Load failed');
        expect(result.current.settings).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set generic error for non-Error throws', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        'string error'
      );

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load settings');
      });
    });

    it('should default isTenant to false', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue({
        enabled: true,
        value: 'test',
      });

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      expect(result.current.isTenant).toBe(false);
    });

    it('should reflect isTenant option', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue({
        enabled: true,
        value: 'test',
      });

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService, isTenant: true })
      );

      expect(result.current.isTenant).toBe(true);
    });
  });

  describe('submit', () => {
    it('should call updateSettings and reload on success', async () => {
      const initialData: TestSettings = { enabled: true, value: 'initial' };
      const updatedData: TestSettings = { enabled: false, value: 'updated' };

      (mockService.getSettings as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(updatedData);
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        updatedData
      );

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(initialData);
      });

      await act(async () => {
        await result.current.submit({ value: 'updated' });
      });

      expect(mockService.updateSettings).toHaveBeenCalledWith({ value: 'updated' });
      await waitFor(() => {
        expect(result.current.settings).toEqual(updatedData);
      });
    });

    it('should set error on failed submit', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue({
        enabled: true,
        value: 'test',
      });
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Submit failed')
      );

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit({ value: 'new' });
      });

      expect(result.current.error).toBe('Submit failed');
    });

    it('should set generic error for non-Error throws on submit', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue({
        enabled: true,
        value: 'test',
      });
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockRejectedValue(
        42
      );

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).not.toBeNull();
      });

      await act(async () => {
        await result.current.submit({ value: 'new' });
      });

      expect(result.current.error).toBe('Failed to update settings');
    });
  });

  describe('v4.0.0 - tenant mapping', () => {
    it('should apply mapTenantSettingsForSubmit when isTenant is true', async () => {
      const initialData: TestSettings = { enabled: true, value: 'test' };
      const mapFn = vi.fn((settings: Partial<TestSettings>) => ({
        value: settings.value,
      }));

      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        initialData
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        initialData
      );

      const { result } = renderHook(() =>
        useAccountSettings({
          service: mockService,
          isTenant: true,
          mapTenantSettingsForSubmit: mapFn,
        })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(initialData);
      });

      await act(async () => {
        await result.current.submit({ enabled: false, value: 'new' });
      });

      expect(mapFn).toHaveBeenCalledWith({ enabled: false, value: 'new' });
      expect(mockService.updateSettings).toHaveBeenCalledWith({ value: 'new' });
    });

    it('should NOT apply mapTenantSettingsForSubmit when isTenant is false', async () => {
      const initialData: TestSettings = { enabled: true, value: 'test' };
      const mapFn = vi.fn();

      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        initialData
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        initialData
      );

      const { result } = renderHook(() =>
        useAccountSettings({
          service: mockService,
          isTenant: false,
          mapTenantSettingsForSubmit: mapFn,
        })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(initialData);
      });

      await act(async () => {
        await result.current.submit({ value: 'new' });
      });

      expect(mapFn).not.toHaveBeenCalled();
      expect(mockService.updateSettings).toHaveBeenCalledWith({ value: 'new' });
    });

    it('should NOT apply mapping when mapTenantSettingsForSubmit is undefined even if isTenant', async () => {
      const initialData: TestSettings = { enabled: true, value: 'test' };

      (mockService.getSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        initialData
      );
      (mockService.updateSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
        initialData
      );

      const { result } = renderHook(() =>
        useAccountSettings({
          service: mockService,
          isTenant: true,
        })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(initialData);
      });

      await act(async () => {
        await result.current.submit({ value: 'new' });
      });

      expect(mockService.updateSettings).toHaveBeenCalledWith({ value: 'new' });
    });
  });

  describe('reload', () => {
    it('should reload settings', async () => {
      const initialData: TestSettings = { enabled: true, value: 'initial' };
      const reloadedData: TestSettings = { enabled: false, value: 'reloaded' };

      (mockService.getSettings as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(reloadedData);

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.settings).toEqual(initialData);
      });

      await act(async () => {
        await result.current.reload();
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(reloadedData);
      });
    });

    it('should clear previous error on reload', async () => {
      (mockService.getSettings as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Load failed'))
        .mockResolvedValueOnce({ enabled: true, value: 'recovered' });

      const { result } = renderHook(() =>
        useAccountSettings({ service: mockService })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Load failed');
      });

      await act(async () => {
        await result.current.reload();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.settings).toEqual({
          enabled: true,
          value: 'recovered',
        });
      });
    });
  });
});
