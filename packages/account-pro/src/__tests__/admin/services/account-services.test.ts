import { describe, it, expect, vi } from 'vitest';
import { AccountSettingsService } from '../../../admin/services/account-settings.service';
import { AccountLdapService } from '../../../admin/services/account-ldap-settings.service';
import { AccountTwoFactorSettingService } from '../../../admin/services/account-two-factor-settings.service';
import { AccountCaptchaService } from '../../../admin/services/account-captcha.service';
import { AccountExternalProviderService } from '../../../admin/services/account-external-provider.service';
import type { RestService } from '@abpjs/core';

function createMockRestService(): RestService {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as RestService;
}

describe('Admin Settings Services', () => {
  describe('AccountSettingsService', () => {
    it('should be constructable', () => {
      const restService = createMockRestService();
      const service = new AccountSettingsService(restService);
      expect(service).toBeDefined();
    });

    it('should have apiName "default"', () => {
      const restService = createMockRestService();
      const service = new AccountSettingsService(restService);
      expect(service.apiName).toBe('default');
    });

    it('should call GET /api/account-admin/settings', async () => {
      const restService = createMockRestService();
      const mockData = { isSelfRegistrationEnabled: true, enableLocalLogin: true };
      (restService.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);
      const service = new AccountSettingsService(restService);

      const result = await service.getSettings();

      expect(restService.get).toHaveBeenCalledWith('/api/account-admin/settings');
      expect(result).toEqual(mockData);
    });

    it('should call PUT /api/account-admin/settings', async () => {
      const restService = createMockRestService();
      const body = { isSelfRegistrationEnabled: false };
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue(body);
      const service = new AccountSettingsService(restService);

      const result = await service.updateSettings(body);

      expect(restService.put).toHaveBeenCalledWith(
        '/api/account-admin/settings',
        body
      );
      expect(result).toEqual(body);
    });
  });

  describe('AccountLdapService', () => {
    it('should be constructable', () => {
      const restService = createMockRestService();
      const service = new AccountLdapService(restService);
      expect(service).toBeDefined();
    });

    it('should have apiName "default"', () => {
      const restService = createMockRestService();
      const service = new AccountLdapService(restService);
      expect(service.apiName).toBe('default');
    });

    it('should call GET /api/account-admin/settings/ldap', async () => {
      const restService = createMockRestService();
      const mockData = { enableLdapLogin: true };
      (restService.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);
      const service = new AccountLdapService(restService);

      const result = await service.getSettings();

      expect(restService.get).toHaveBeenCalledWith(
        '/api/account-admin/settings/ldap'
      );
      expect(result).toEqual(mockData);
    });

    it('should call PUT /api/account-admin/settings/ldap', async () => {
      const restService = createMockRestService();
      const body = { enableLdapLogin: false };
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue(body);
      const service = new AccountLdapService(restService);

      const result = await service.updateSettings(body);

      expect(restService.put).toHaveBeenCalledWith(
        '/api/account-admin/settings/ldap',
        body
      );
      expect(result).toEqual(body);
    });
  });

  describe('AccountTwoFactorSettingService', () => {
    it('should be constructable', () => {
      const restService = createMockRestService();
      const service = new AccountTwoFactorSettingService(restService);
      expect(service).toBeDefined();
    });

    it('should have apiName "default"', () => {
      const restService = createMockRestService();
      const service = new AccountTwoFactorSettingService(restService);
      expect(service.apiName).toBe('default');
    });

    it('should call GET /api/account-admin/settings/two-factor', async () => {
      const restService = createMockRestService();
      const mockData = {
        isTwoFactorEnabled: true,
        twoFactorBehaviour: 0,
        isRememberBrowserEnabled: true,
        usersCanChange: false,
      };
      (restService.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);
      const service = new AccountTwoFactorSettingService(restService);

      const result = await service.getSettings();

      expect(restService.get).toHaveBeenCalledWith(
        '/api/account-admin/settings/two-factor'
      );
      expect(result).toEqual(mockData);
    });

    it('should call PUT /api/account-admin/settings/two-factor', async () => {
      const restService = createMockRestService();
      const body = { isTwoFactorEnabled: false };
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue(body);
      const service = new AccountTwoFactorSettingService(restService);

      const result = await service.updateSettings(body);

      expect(restService.put).toHaveBeenCalledWith(
        '/api/account-admin/settings/two-factor',
        body
      );
      expect(result).toEqual(body);
    });
  });

  describe('AccountCaptchaService (v4.0.0)', () => {
    it('should be constructable', () => {
      const restService = createMockRestService();
      const service = new AccountCaptchaService(restService);
      expect(service).toBeDefined();
    });

    it('should have apiName "default"', () => {
      const restService = createMockRestService();
      const service = new AccountCaptchaService(restService);
      expect(service.apiName).toBe('default');
    });

    it('should call GET /api/account-admin/settings/captcha', async () => {
      const restService = createMockRestService();
      const mockData = {
        useCaptchaOnLogin: true,
        useCaptchaOnRegistration: false,
        verifyBaseUrl: 'https://example.com',
        siteKey: 'key',
        siteSecret: 'secret',
        version: 3,
      };
      (restService.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);
      const service = new AccountCaptchaService(restService);

      const result = await service.getSettings();

      expect(restService.get).toHaveBeenCalledWith(
        '/api/account-admin/settings/captcha'
      );
      expect(result).toEqual(mockData);
    });

    it('should call PUT /api/account-admin/settings/captcha', async () => {
      const restService = createMockRestService();
      const body = { siteKey: 'new-key', version: 2 };
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue(body);
      const service = new AccountCaptchaService(restService);

      const result = await service.updateSettings(body);

      expect(restService.put).toHaveBeenCalledWith(
        '/api/account-admin/settings/captcha',
        body
      );
      expect(result).toEqual(body);
    });
  });

  describe('AccountExternalProviderService (v4.0.0)', () => {
    it('should be constructable', () => {
      const restService = createMockRestService();
      const service = new AccountExternalProviderService(restService);
      expect(service).toBeDefined();
    });

    it('should have apiName "default"', () => {
      const restService = createMockRestService();
      const service = new AccountExternalProviderService(restService);
      expect(service.apiName).toBe('default');
    });

    it('should call GET /api/account-admin/settings/external-provider', async () => {
      const restService = createMockRestService();
      const mockData = {
        settings: [
          {
            name: 'Google',
            enabled: true,
            properties: [],
            secretProperties: [],
          },
        ],
      };
      (restService.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);
      const service = new AccountExternalProviderService(restService);

      const result = await service.getSettings();

      expect(restService.get).toHaveBeenCalledWith(
        '/api/account-admin/settings/external-provider'
      );
      expect(result).toEqual(mockData);
    });

    it('should call PUT /api/account-admin/settings/external-provider', async () => {
      const restService = createMockRestService();
      const body = {
        settings: [
          { name: 'Google', enabled: false, properties: [], secretProperties: [] },
        ],
      };
      (restService.put as ReturnType<typeof vi.fn>).mockResolvedValue(body);
      const service = new AccountExternalProviderService(restService);

      const result = await service.updateSettings(body);

      expect(restService.put).toHaveBeenCalledWith(
        '/api/account-admin/settings/external-provider',
        body
      );
      expect(result).toEqual(body);
    });
  });
});
