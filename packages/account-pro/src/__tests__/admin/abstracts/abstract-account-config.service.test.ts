import { describe, it, expect, vi } from 'vitest';
import { AbstractAccountSettingsService } from '../../../admin/abstracts/abstract-account-config.service';
import type { RestService } from '@abpjs/core';

// Concrete implementation for testing
class TestSettingsService extends AbstractAccountSettingsService<{ foo: string }> {
  protected url = '/api/test/settings';

  constructor(restService: RestService) {
    super(restService);
  }
}

// Concrete implementation with different SubmitType
class TestSubmitService extends AbstractAccountSettingsService<
  { foo: string; bar: number },
  { foo: string }
> {
  protected url = '/api/test/submit';

  constructor(restService: RestService) {
    super(restService);
  }
}

function createMockRestService(): RestService {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as RestService;
}

describe('AbstractAccountSettingsService', () => {
  describe('class structure', () => {
    it('should have apiName default to "default"', () => {
      const restService = createMockRestService();
      const service = new TestSettingsService(restService);
      expect(service.apiName).toBe('default');
    });

    it('should store restService reference', () => {
      const restService = createMockRestService();
      const service = new TestSettingsService(restService);
      expect(service).toBeDefined();
    });
  });

  describe('getSettings', () => {
    it('should call restService.get with the correct URL', async () => {
      const restService = createMockRestService();
      const mockData = { foo: 'bar' };
      (restService.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);
      const service = new TestSettingsService(restService);

      const result = await service.getSettings();

      expect(restService.get).toHaveBeenCalledWith('/api/test/settings');
      expect(result).toEqual(mockData);
    });

    it('should propagate errors from restService.get', async () => {
      const restService = createMockRestService();
      (restService.get as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error')
      );
      const service = new TestSettingsService(restService);

      await expect(service.getSettings()).rejects.toThrow('Network error');
    });
  });

  describe('updateSettings', () => {
    it('should call restService.put with the correct URL and body', async () => {
      const restService = createMockRestService();
      const updateBody = { foo: 'updated' };
      const responseData = { foo: 'updated' };
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue(responseData);
      const service = new TestSettingsService(restService);

      const result = await service.updateSettings(updateBody);

      expect(restService.put).toHaveBeenCalledWith('/api/test/settings', updateBody);
      expect(result).toEqual(responseData);
    });

    it('should accept partial body', async () => {
      const restService = createMockRestService();
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue({ foo: 'test' });
      const service = new TestSettingsService(restService);

      await service.updateSettings({});

      expect(restService.put).toHaveBeenCalledWith('/api/test/settings', {});
    });

    it('should propagate errors from restService.put', async () => {
      const restService = createMockRestService();
      (restService.put as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Update failed')
      );
      const service = new TestSettingsService(restService);

      await expect(service.updateSettings({ foo: 'x' })).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('v4.0.0 - SubmitType generic', () => {
    it('should support different SubmitType from Type', async () => {
      const restService = createMockRestService();
      const responseData = { foo: 'result' };
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue(responseData);
      const service = new TestSubmitService(restService);

      // SubmitType is { foo: string }, so only foo is accepted
      const result = await service.updateSettings({ foo: 'submitted' });

      expect(restService.put).toHaveBeenCalledWith('/api/test/submit', {
        foo: 'submitted',
      });
      expect(result).toEqual(responseData);
    });

    it('should use different URL for different service', () => {
      const restService = createMockRestService();
      const service = new TestSubmitService(restService);
      expect(service.apiName).toBe('default');
    });
  });
});
