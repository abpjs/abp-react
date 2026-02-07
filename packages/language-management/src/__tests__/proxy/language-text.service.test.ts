/**
 * Tests for proxy/language-text.service.ts
 * @since 3.2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageTextService } from '../../proxy/language-text.service';
import type {
  LanguageTextDto,
  GetLanguagesTextsInput,
} from '../../proxy/dto/models';
import type { RestService, PagedResultDto } from '@abpjs/core';

describe('LanguageTextService', () => {
  let service: LanguageTextService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  const mockLanguageText: LanguageTextDto = {
    resourceName: 'AbpIdentity',
    cultureName: 'fr-FR',
    baseCultureName: 'en-US',
    baseValue: 'Username',
    name: 'UserName',
    value: 'Nom d\'utilisateur',
  };

  const mockLanguageTextPagedResult: PagedResultDto<LanguageTextDto> = {
    items: [mockLanguageText],
    totalCount: 1,
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new LanguageTextService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should initialize with default apiName', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('get', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockLanguageText);

      const result = await service.get('AbpIdentity', 'fr-FR', 'UserName', 'en-US');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts/AbpIdentity/fr-FR/UserName',
        params: { baseCultureName: 'en-US' },
      });
      expect(result).toEqual(mockLanguageText);
    });

    it('should return text with all properties', async () => {
      const fullText: LanguageTextDto = {
        resourceName: 'AbpAccount',
        cultureName: 'de-DE',
        baseCultureName: 'en-US',
        baseValue: 'Login',
        name: 'LoginButton',
        value: 'Anmelden',
      };

      mockRestService.request.mockResolvedValue(fullText);

      const result = await service.get('AbpAccount', 'de-DE', 'LoginButton', 'en-US');

      expect(result.resourceName).toBe('AbpAccount');
      expect(result.cultureName).toBe('de-DE');
      expect(result.value).toBe('Anmelden');
    });

    it('should handle empty translation value', async () => {
      const emptyText: LanguageTextDto = {
        resourceName: 'TestResource',
        cultureName: 'ja-JP',
        baseCultureName: 'en-US',
        baseValue: 'Hello',
        name: 'Greeting',
        value: '',
      };

      mockRestService.request.mockResolvedValue(emptyText);

      const result = await service.get('TestResource', 'ja-JP', 'Greeting', 'en-US');

      expect(result.value).toBe('');
    });

    it('should propagate errors for non-existent text', async () => {
      const error = new Error('Language text not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.get('InvalidResource', 'xx-XX', 'InvalidKey', 'en-US')
      ).rejects.toThrow('Language text not found');
    });

    it('should handle special characters in resource and key names', async () => {
      mockRestService.request.mockResolvedValue(mockLanguageText);

      await service.get('My.Custom.Resource', 'en-GB', 'My.Key.Name', 'en-US');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts/My.Custom.Resource/en-GB/My.Key.Name',
        params: { baseCultureName: 'en-US' },
      });
    });
  });

  describe('getList', () => {
    it('should call restService.request with all input parameters', async () => {
      const input: GetLanguagesTextsInput = {
        filter: 'user',
        resourceName: 'AbpIdentity',
        baseCultureName: 'en-US',
        targetCultureName: 'fr-FR',
        getOnlyEmptyValues: true,
        skipCount: 0,
        maxResultCount: 50,
        sorting: 'name asc',
      };

      mockRestService.request.mockResolvedValue(mockLanguageTextPagedResult);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts',
        params: input,
      });
      expect(result).toEqual(mockLanguageTextPagedResult);
    });

    it('should handle minimal input parameters', async () => {
      const input: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'de',
      };

      mockRestService.request.mockResolvedValue(mockLanguageTextPagedResult);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts',
        params: input,
      });
    });

    it('should return paged result with items and totalCount', async () => {
      const pagedResult: PagedResultDto<LanguageTextDto> = {
        items: [
          mockLanguageText,
          { ...mockLanguageText, name: 'Password', value: 'Mot de passe' },
          { ...mockLanguageText, name: 'Email', value: 'E-mail' },
        ],
        totalCount: 100,
      };

      mockRestService.request.mockResolvedValue(pagedResult);

      const result = await service.getList({
        baseCultureName: 'en',
        targetCultureName: 'fr',
        maxResultCount: 3,
      });

      expect(result.items).toHaveLength(3);
      expect(result.totalCount).toBe(100);
    });

    it('should handle empty result', async () => {
      mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });

      const result = await service.getList({
        baseCultureName: 'en',
        targetCultureName: 'xx',
      });

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should handle getOnlyEmptyValues flag set to true', async () => {
      const input: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: true,
      };

      const emptyValuesResult: PagedResultDto<LanguageTextDto> = {
        items: [
          { ...mockLanguageText, value: '' },
          { ...mockLanguageText, name: 'OtherKey', value: '' },
        ],
        totalCount: 2,
      };

      mockRestService.request.mockResolvedValue(emptyValuesResult);

      const result = await service.getList(input);

      expect(result.items?.every((item) => item.value === '')).toBe(true);
    });

    it('should handle getOnlyEmptyValues flag set to false', async () => {
      const input: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: false,
      };

      mockRestService.request.mockResolvedValue(mockLanguageTextPagedResult);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts',
        params: expect.objectContaining({ getOnlyEmptyValues: false }),
      });
    });

    it('should handle pagination parameters', async () => {
      const input: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'de',
        skipCount: 20,
        maxResultCount: 10,
      };

      mockRestService.request.mockResolvedValue(mockLanguageTextPagedResult);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts',
        params: expect.objectContaining({
          skipCount: 20,
          maxResultCount: 10,
        }),
      });
    });

    it('should handle sorting parameter', async () => {
      const input: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'ja',
        sorting: 'name desc',
      };

      mockRestService.request.mockResolvedValue(mockLanguageTextPagedResult);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts',
        params: expect.objectContaining({ sorting: 'name desc' }),
      });
    });

    it('should handle filter parameter', async () => {
      const input: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'es',
        filter: 'login',
      };

      mockRestService.request.mockResolvedValue(mockLanguageTextPagedResult);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/language-texts',
        params: expect.objectContaining({ filter: 'login' }),
      });
    });

    it('should propagate errors', async () => {
      const error = new Error('Invalid query parameters');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.getList({ baseCultureName: '', targetCultureName: '' })
      ).rejects.toThrow('Invalid query parameters');
    });
  });

  describe('restoreToDefault', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.restoreToDefault('AbpIdentity', 'fr-FR', 'UserName');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/language-texts/AbpIdentity/fr-FR/UserName/restore',
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.restoreToDefault('AbpIdentity', 'fr-FR', 'UserName');

      expect(result).toBeUndefined();
    });

    it('should propagate errors for non-existent text', async () => {
      const error = new Error('Language text not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.restoreToDefault('InvalidResource', 'xx-XX', 'InvalidKey')
      ).rejects.toThrow('Language text not found');
    });

    it('should propagate permission errors', async () => {
      const error = new Error('Permission denied');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.restoreToDefault('AbpIdentity', 'fr-FR', 'UserName')
      ).rejects.toThrow('Permission denied');
    });

    it('should handle special characters in parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.restoreToDefault('My.Custom.Resource', 'zh-Hans', 'My.Key.Name');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/language-texts/My.Custom.Resource/zh-Hans/My.Key.Name/restore',
      });
    });
  });

  describe('update', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.update('AbpIdentity', 'fr-FR', 'UserName', 'Nom d\'utilisateur');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/language-texts/AbpIdentity/fr-FR/UserName',
        body: { value: 'Nom d\'utilisateur' },
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.update('AbpIdentity', 'de-DE', 'Password', 'Passwort');

      expect(result).toBeUndefined();
    });

    it('should handle empty value', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.update('TestResource', 'ja-JP', 'Greeting', '');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/language-texts/TestResource/ja-JP/Greeting',
        body: { value: '' },
      });
    });

    it('should handle special characters in value', async () => {
      const specialValue = 'Olá "Mundo" <script>alert("test")</script>';
      mockRestService.request.mockResolvedValue(undefined);

      await service.update('TestResource', 'pt-BR', 'Greeting', specialValue);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/language-texts/TestResource/pt-BR/Greeting',
        body: { value: specialValue },
      });
    });

    it('should handle unicode characters in value', async () => {
      const unicodeValue = '你好世界 🌍 مرحبا';
      mockRestService.request.mockResolvedValue(undefined);

      await service.update('TestResource', 'zh-CN', 'Greeting', unicodeValue);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/language-texts/TestResource/zh-CN/Greeting',
        body: { value: unicodeValue },
      });
    });

    it('should propagate errors for non-existent text', async () => {
      const error = new Error('Language text not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.update('InvalidResource', 'xx-XX', 'InvalidKey', 'value')
      ).rejects.toThrow('Language text not found');
    });

    it('should propagate validation errors', async () => {
      const error = new Error('Value exceeds maximum length');
      mockRestService.request.mockRejectedValue(error);

      const longValue = 'a'.repeat(10000);

      await expect(
        service.update('TestResource', 'en-US', 'Key', longValue)
      ).rejects.toThrow('Value exceeds maximum length');
    });

    it('should propagate permission errors', async () => {
      const error = new Error('Permission denied');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.update('AbpIdentity', 'fr-FR', 'UserName', 'Utilisateur')
      ).rejects.toThrow('Permission denied');
    });

    it('should handle special characters in resource and key names', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.update('My.Custom.Resource', 'ko-KR', 'My.Key.Name', '값');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/language-texts/My.Custom.Resource/ko-KR/My.Key.Name',
        body: { value: '값' },
      });
    });
  });

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.getList({ baseCultureName: 'en', targetCultureName: 'fr' })
      ).rejects.toThrow('Network error');
    });

    it('should propagate server errors', async () => {
      const error = new Error('Internal server error');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.get('AbpIdentity', 'fr', 'UserName', 'en')
      ).rejects.toThrow('Internal server error');
    });

    it('should propagate timeout errors', async () => {
      const error = new Error('Request timeout');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.update('Resource', 'culture', 'key', 'value')
      ).rejects.toThrow('Request timeout');
    });
  });
});
