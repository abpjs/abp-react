import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountService } from '../../services/account.service';
import type { RegisterRequest } from '../../models';

describe('AccountService', () => {
  let accountService: AccountService;
  let mockRestService: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRestService = {
      get: vi.fn(),
      post: vi.fn(),
    };
    accountService = new AccountService(mockRestService as any);
  });

  describe('findTenant', () => {
    it('should call rest.get with correct URL', async () => {
      const tenantName = 'test-tenant';
      const expectedResponse = { success: true, tenantId: 'tenant-123' };
      mockRestService.get.mockResolvedValue(expectedResponse);

      const result = await accountService.findTenant(tenantName);

      expect(mockRestService.get).toHaveBeenCalledWith(
        `/api/abp/multi-tenancy/tenants/by-name/${tenantName}`
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle tenant not found', async () => {
      const tenantName = 'non-existent';
      const expectedResponse = { success: false, tenantId: '' };
      mockRestService.get.mockResolvedValue(expectedResponse);

      const result = await accountService.findTenant(tenantName);

      expect(result).toEqual(expectedResponse);
    });

    it('should handle special characters in tenant name', async () => {
      const tenantName = 'test-tenant-123';
      mockRestService.get.mockResolvedValue({ success: true, tenantId: '123' });

      await accountService.findTenant(tenantName);

      expect(mockRestService.get).toHaveBeenCalledWith(
        `/api/abp/multi-tenancy/tenants/by-name/${tenantName}`
      );
    });

    it('should propagate errors from rest service', async () => {
      const error = new Error('Network error');
      mockRestService.get.mockRejectedValue(error);

      await expect(accountService.findTenant('test')).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    const registerData: RegisterRequest = {
      userName: 'testuser',
      emailAddress: 'test@example.com',
      password: 'Password123!',
      appName: 'React',
    };

    it('should call rest.post with correct URL and body', async () => {
      const expectedResponse = {
        id: 'user-123',
        userName: 'testuser',
        email: 'test@example.com',
      };
      mockRestService.post.mockResolvedValue(expectedResponse);

      const result = await accountService.register(registerData);

      expect(mockRestService.post).toHaveBeenCalledWith(
        '/api/account/register',
        registerData,
        { skipHandleError: true }
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should pass skipHandleError option', async () => {
      mockRestService.post.mockResolvedValue({});

      await accountService.register(registerData);

      expect(mockRestService.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { skipHandleError: true }
      );
    });

    it('should propagate registration errors', async () => {
      const error = { error: { message: 'Username already exists' } };
      mockRestService.post.mockRejectedValue(error);

      await expect(accountService.register(registerData)).rejects.toEqual(error);
    });

    it('should handle registration without appName', async () => {
      const dataWithoutApp: RegisterRequest = {
        userName: 'testuser',
        emailAddress: 'test@example.com',
        password: 'Password123!',
      };
      mockRestService.post.mockResolvedValue({ id: 'user-123' });

      await accountService.register(dataWithoutApp);

      expect(mockRestService.post).toHaveBeenCalledWith(
        '/api/account/register',
        dataWithoutApp,
        { skipHandleError: true }
      );
    });
  });
});
