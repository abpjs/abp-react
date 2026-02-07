/**
 * Tests for IdentitySecurityLogService (Proxy)
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentitySecurityLogService } from '../../../proxy/identity/identity-security-log.service';
import type { RestService, PagedResultDto } from '@abpjs/core';
import type {
  GetIdentitySecurityLogListInput,
  IdentitySecurityLogDto,
} from '../../../proxy/identity/models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('IdentitySecurityLogService (Proxy)', () => {
  let service: IdentitySecurityLogService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockSecurityLog: IdentitySecurityLogDto = {
    id: 'log-1',
    tenantId: 'tenant-1',
    applicationName: 'MyApp',
    identity: 'admin',
    action: 'LoginSucceeded',
    userId: 'user-1',
    userName: 'admin',
    tenantName: 'Default',
    clientId: 'client-1',
    correlationId: 'corr-123',
    clientIpAddress: '192.168.1.1',
    browserInfo: 'Mozilla/5.0',
    creationTime: '2024-01-01T12:00:00Z',
    extraProperties: {},
  };

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new IdentitySecurityLogService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(IdentitySecurityLogService);
    });
  });

  describe('get', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockSecurityLog);

      const result = await service.get('log-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/log-1',
      });
      expect(result).toEqual(mockSecurityLog);
    });

    it('should handle not found error', async () => {
      const error = new Error('Not found');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get('non-existent')).rejects.toThrow('Not found');
    });
  });

  describe('getList', () => {
    it('should call REST API with all parameters', async () => {
      const input: GetIdentitySecurityLogListInput = {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-12-31T23:59:59Z',
        applicationName: 'MyApp',
        identity: 'admin',
        action: 'Login',
        userName: 'john',
        clientId: 'client-1',
        correlationId: 'corr-123',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 50,
      };

      const response: PagedResultDto<IdentitySecurityLogDto> = {
        items: [mockSecurityLog],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs',
        params: {
          startTime: '2024-01-01T00:00:00Z',
          endTime: '2024-12-31T23:59:59Z',
          applicationName: 'MyApp',
          identity: 'admin',
          action: 'Login',
          userName: 'john',
          clientId: 'client-1',
          correlationId: 'corr-123',
          sorting: 'creationTime desc',
          skipCount: 0,
          maxResultCount: 50,
        },
      });
      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });

    it('should handle empty filters', async () => {
      const input: GetIdentitySecurityLogListInput = {
        applicationName: '',
        identity: '',
        action: '',
        userName: '',
        clientId: '',
        correlationId: '',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 10,
      };

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 0 });

      const result = await service.getList(input);

      expect(result.items).toHaveLength(0);
    });

    it('should handle pagination', async () => {
      const input: GetIdentitySecurityLogListInput = {
        applicationName: '',
        identity: '',
        action: '',
        userName: '',
        clientId: '',
        correlationId: '',
        sorting: '',
        skipCount: 100,
        maxResultCount: 50,
      };

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 500 });

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            skipCount: 100,
            maxResultCount: 50,
          }),
        })
      );
    });
  });

  describe('getMy', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockSecurityLog);

      const result = await service.getMy('log-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/my/log-1',
      });
      expect(result).toEqual(mockSecurityLog);
    });

    it('should handle unauthorized access', async () => {
      const error = new Error('Unauthorized');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.getMy('other-user-log')).rejects.toThrow('Unauthorized');
    });
  });

  describe('getMyList', () => {
    it('should call REST API with all parameters', async () => {
      const input: GetIdentitySecurityLogListInput = {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-12-31T23:59:59Z',
        applicationName: 'MyApp',
        identity: 'user',
        action: 'PasswordChanged',
        userName: 'current-user',
        clientId: '',
        correlationId: '',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 20,
      };

      const response: PagedResultDto<IdentitySecurityLogDto> = {
        items: [mockSecurityLog],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getMyList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/security-logs/my',
        params: {
          startTime: '2024-01-01T00:00:00Z',
          endTime: '2024-12-31T23:59:59Z',
          applicationName: 'MyApp',
          identity: 'user',
          action: 'PasswordChanged',
          userName: 'current-user',
          clientId: '',
          correlationId: '',
          sorting: 'creationTime desc',
          skipCount: 0,
          maxResultCount: 20,
        },
      });
      expect(result.items).toHaveLength(1);
    });

    it('should handle current user with no logs', async () => {
      const input: GetIdentitySecurityLogListInput = {
        applicationName: '',
        identity: '',
        action: '',
        userName: '',
        clientId: '',
        correlationId: '',
        sorting: '',
        skipCount: 0,
        maxResultCount: 10,
      };

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 0 });

      const result = await service.getMyList(input);

      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get('log-1')).rejects.toThrow('Network error');
    });

    it('should propagate server errors', async () => {
      const error = new Error('Internal server error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.getList({
          applicationName: '',
          identity: '',
          action: '',
          userName: '',
          clientId: '',
          correlationId: '',
          sorting: '',
          skipCount: 0,
          maxResultCount: 10,
        })
      ).rejects.toThrow('Internal server error');
    });
  });
});
