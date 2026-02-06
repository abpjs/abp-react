import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getShortDateFormat,
  getShortTimeFormat,
  getShortDateShortTimeFormat,
} from './date-utils';
import type { ConfigStateService } from '../services/config-state.service';

describe('date-utils (v3.1.0)', () => {
  let mockConfigStateService: ConfigStateService;

  beforeEach(() => {
    mockConfigStateService = {
      getSetting: vi.fn(),
    } as unknown as ConfigStateService;
  });

  describe('getShortDateFormat', () => {
    it('should return setting value when available', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue('dd/MM/yyyy');

      const result = getShortDateFormat(mockConfigStateService);

      expect(result).toBe('dd/MM/yyyy');
      expect(mockConfigStateService.getSetting).toHaveBeenCalledWith(
        'Abp.Timing.DateTimeFormat.ShortDate'
      );
    });

    it('should return default MM/dd/yyyy when setting is not available', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue(undefined);

      const result = getShortDateFormat(mockConfigStateService);

      expect(result).toBe('MM/dd/yyyy');
    });

    it('should return default when setting is empty string', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue('');

      const result = getShortDateFormat(mockConfigStateService);

      expect(result).toBe('MM/dd/yyyy');
    });

    it('should return custom format from settings', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue('yyyy-MM-dd');

      const result = getShortDateFormat(mockConfigStateService);

      expect(result).toBe('yyyy-MM-dd');
    });
  });

  describe('getShortTimeFormat', () => {
    it('should return setting value when available', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue('hh:mm:ss');

      const result = getShortTimeFormat(mockConfigStateService);

      expect(result).toBe('hh:mm:ss');
      expect(mockConfigStateService.getSetting).toHaveBeenCalledWith(
        'Abp.Timing.DateTimeFormat.ShortTime'
      );
    });

    it('should return default HH:mm when setting is not available', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue(undefined);

      const result = getShortTimeFormat(mockConfigStateService);

      expect(result).toBe('HH:mm');
    });

    it('should return default when setting is empty string', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue('');

      const result = getShortTimeFormat(mockConfigStateService);

      expect(result).toBe('HH:mm');
    });

    it('should return 12-hour format from settings', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue('hh:mm tt');

      const result = getShortTimeFormat(mockConfigStateService);

      expect(result).toBe('hh:mm tt');
    });
  });

  describe('getShortDateShortTimeFormat', () => {
    it('should combine date and time formats', () => {
      vi.mocked(mockConfigStateService.getSetting)
        .mockReturnValueOnce('dd/MM/yyyy')
        .mockReturnValueOnce('HH:mm:ss');

      const result = getShortDateShortTimeFormat(mockConfigStateService);

      expect(result).toBe('dd/MM/yyyy HH:mm:ss');
    });

    it('should use default formats when settings are not available', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue(undefined);

      const result = getShortDateShortTimeFormat(mockConfigStateService);

      expect(result).toBe('MM/dd/yyyy HH:mm');
    });

    it('should use mixed default and custom formats', () => {
      vi.mocked(mockConfigStateService.getSetting)
        .mockReturnValueOnce('yyyy-MM-dd')
        .mockReturnValueOnce(undefined);

      const result = getShortDateShortTimeFormat(mockConfigStateService);

      expect(result).toBe('yyyy-MM-dd HH:mm');
    });

    it('should call getSetting with correct keys', () => {
      vi.mocked(mockConfigStateService.getSetting).mockReturnValue(undefined);

      getShortDateShortTimeFormat(mockConfigStateService);

      expect(mockConfigStateService.getSetting).toHaveBeenCalledWith(
        'Abp.Timing.DateTimeFormat.ShortDate'
      );
      expect(mockConfigStateService.getSetting).toHaveBeenCalledWith(
        'Abp.Timing.DateTimeFormat.ShortTime'
      );
    });

    it('should handle ISO-like format combination', () => {
      vi.mocked(mockConfigStateService.getSetting)
        .mockReturnValueOnce('yyyy-MM-dd')
        .mockReturnValueOnce('HH:mm:ss');

      const result = getShortDateShortTimeFormat(mockConfigStateService);

      expect(result).toBe('yyyy-MM-dd HH:mm:ss');
    });
  });
});
