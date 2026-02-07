/**
 * Tests for LegacyIdentitySecurityLogService
 * @abpjs/identity-pro v3.1.0
 * @updated 3.2.0 - Tests legacy service (new proxy service has different API)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LegacyIdentitySecurityLogService } from '../../services/identity-security-log.service';
import type { RestService, PagedResultDto } from '@abpjs/core';
import type { LegacyIdentitySecurityLogDto } from '../../models/identity-security-log';

describe('LegacyIdentitySecurityLogService', () => {
  let service: LegacyIdentitySecurityLogService;
  let mockRest: RestService;

  const mockSecurityLog: LegacyIdentitySecurityLogDto = {
    id: 'log-123',
    tenantId: 'tenant-1',
    applicationName: 'MyApp',
    identity: 'admin',
    action: 'LoginSucceeded',
    userId: 'user-123',
    userName: 'admin',
    clientIpAddress: '192.168.1.1',
    clientId: 'client-1',
    correlationId: 'corr-123',
    browserInfo: 'Mozilla/5.0',
    creationTime: '2024-01-01T10:00:00Z',
    extraProperties: { key: 'value' },
  };

  const mockPagedResponse: PagedResultDto<LegacyIdentitySecurityLogDto> = {
    items: [mockSecurityLog],
    totalCount: 1,
  };

  beforeEach(() => {
    mockRest = {
      request: vi.fn(),
    } as unknown as RestService;
    service = new LegacyIdentitySecurityLogService(mockRest);
  });

  describe('constructor', () => {
    it('should create instance with RestService', () => {
      expect(service).toBeInstanceOf(LegacyIdentitySecurityLogService);
    });

    it('should have default apiName', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('getListByInput', () => {
    it('should call REST API with correct method and URL', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockPagedResponse);

      await service.getListByInput();

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs',
        params: {},
      });
    });

    it('should pass query parameters', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockPagedResponse);

      const params = {
        filter: 'admin',
        startTime: '2024-01-01',
        endTime: '2024-01-31',
        applicationName: 'MyApp',
        identity: 'admin',
        action: 'LoginSucceeded',
        userId: 'user-123',
        userName: 'admin',
        clientId: 'client-1',
        correlationId: 'corr-123',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 10,
      };

      await service.getListByInput(params);

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs',
        params,
      });
    });

    it('should return paginated security logs', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockPagedResponse);

      const result = await service.getListByInput();

      expect(result).toEqual(mockPagedResponse);
      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });

    it('should handle empty results', async () => {
      const emptyResponse: PagedResultDto<LegacyIdentitySecurityLogDto> = {
        items: [],
        totalCount: 0,
      };
      vi.mocked(mockRest.request).mockResolvedValue(emptyResponse);

      const result = await service.getListByInput();

      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('getById', () => {
    it('should call REST API with correct method and URL', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockSecurityLog);

      await service.getById('log-123');

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/log-123',
      });
    });

    it('should return security log details', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockSecurityLog);

      const result = await service.getById('log-123');

      expect(result).toEqual(mockSecurityLog);
      expect(result.id).toBe('log-123');
      expect(result.action).toBe('LoginSucceeded');
    });

    it('should handle different log IDs', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockSecurityLog);

      await service.getById('different-id');

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/different-id',
      });
    });
  });

  describe('getMyListByInput', () => {
    it('should call REST API with correct method and URL', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockPagedResponse);

      await service.getMyListByInput();

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/my',
        params: {},
      });
    });

    it('should pass query parameters', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockPagedResponse);

      const params = {
        filter: 'login',
        startTime: '2024-01-01',
        endTime: '2024-01-31',
        skipCount: 0,
        maxResultCount: 20,
      };

      await service.getMyListByInput(params);

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/my',
        params,
      });
    });

    it('should return paginated security logs for current user', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockPagedResponse);

      const result = await service.getMyListByInput();

      expect(result).toEqual(mockPagedResponse);
    });
  });

  describe('getMyById', () => {
    it('should call REST API with correct method and URL', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockSecurityLog);

      await service.getMyById('log-123');

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/my/log-123',
      });
    });

    it('should return security log details for current user', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockSecurityLog);

      const result = await service.getMyById('log-123');

      expect(result).toEqual(mockSecurityLog);
    });

    it('should handle different log IDs', async () => {
      vi.mocked(mockRest.request).mockResolvedValue(mockSecurityLog);

      await service.getMyById('my-log-456');

      expect(mockRest.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/my/my-log-456',
      });
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getListByInput', async () => {
      const error = new Error('API Error');
      vi.mocked(mockRest.request).mockRejectedValue(error);

      await expect(service.getListByInput()).rejects.toThrow('API Error');
    });

    it('should propagate errors from getById', async () => {
      const error = new Error('Not found');
      vi.mocked(mockRest.request).mockRejectedValue(error);

      await expect(service.getById('invalid-id')).rejects.toThrow('Not found');
    });

    it('should propagate errors from getMyListByInput', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(mockRest.request).mockRejectedValue(error);

      await expect(service.getMyListByInput()).rejects.toThrow('Unauthorized');
    });

    it('should propagate errors from getMyById', async () => {
      const error = new Error('Forbidden');
      vi.mocked(mockRest.request).mockRejectedValue(error);

      await expect(service.getMyById('log-123')).rejects.toThrow('Forbidden');
    });
  });

  describe('security log actions', () => {
    it('should handle LoginSucceeded action', async () => {
      const loginLog = { ...mockSecurityLog, action: 'LoginSucceeded' };
      vi.mocked(mockRest.request).mockResolvedValue(loginLog);

      const result = await service.getById('log-123');

      expect(result.action).toBe('LoginSucceeded');
    });

    it('should handle LoginFailed action', async () => {
      const loginLog = { ...mockSecurityLog, action: 'LoginFailed' };
      vi.mocked(mockRest.request).mockResolvedValue(loginLog);

      const result = await service.getById('log-123');

      expect(result.action).toBe('LoginFailed');
    });

    it('should handle Logout action', async () => {
      const logoutLog = { ...mockSecurityLog, action: 'Logout' };
      vi.mocked(mockRest.request).mockResolvedValue(logoutLog);

      const result = await service.getById('log-123');

      expect(result.action).toBe('Logout');
    });
  });
});
