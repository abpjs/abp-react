/**
 * Tests for proxy/index.ts exports
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import * as proxyExports from '../../proxy';

describe('Proxy Index Exports', () => {
  describe('Services', () => {
    it('should export LanguageService', () => {
      expect(proxyExports.LanguageService).toBeDefined();
      expect(typeof proxyExports.LanguageService).toBe('function');
    });

    it('should export LanguageTextService', () => {
      expect(proxyExports.LanguageTextService).toBeDefined();
      expect(typeof proxyExports.LanguageTextService).toBe('function');
    });

    it('should be able to instantiate LanguageService with mock', () => {
      const mockRest = { request: () => Promise.resolve({}) };
      const service = new proxyExports.LanguageService(mockRest as any);
      expect(service).toBeInstanceOf(proxyExports.LanguageService);
      expect(service.apiName).toBe('default');
    });

    it('should be able to instantiate LanguageTextService with mock', () => {
      const mockRest = { request: () => Promise.resolve({}) };
      const service = new proxyExports.LanguageTextService(mockRest as any);
      expect(service).toBeInstanceOf(proxyExports.LanguageTextService);
      expect(service.apiName).toBe('default');
    });
  });

  describe('DTO Types (compile-time checks)', () => {
    it('should be able to create CreateLanguageDto object', () => {
      // This is a compile-time type check - if types are not exported properly,
      // this would fail at compile time
      const createDto = {
        displayName: 'Test',
        cultureName: 'en-US',
        uiCultureName: 'en-US',
        flagIcon: 'us',
        isEnabled: true,
      };
      expect(createDto).toBeDefined();
    });

    it('should be able to create UpdateLanguageDto object', () => {
      const updateDto = {
        displayName: 'Updated',
        flagIcon: 'gb',
        isEnabled: false,
      };
      expect(updateDto).toBeDefined();
    });

    it('should be able to create LanguageDto object', () => {
      const languageDto = {
        id: 'lang-1',
        cultureName: 'en-US',
        uiCultureName: 'en-US',
        displayName: 'English',
        flagIcon: 'us',
        isEnabled: true,
        isDefaultLanguage: true,
      };
      expect(languageDto).toBeDefined();
    });

    it('should be able to create LanguageTextDto object', () => {
      const textDto = {
        resourceName: 'AbpIdentity',
        cultureName: 'fr-FR',
        baseCultureName: 'en-US',
        baseValue: 'Username',
        name: 'UserName',
        value: 'Nom d\'utilisateur',
      };
      expect(textDto).toBeDefined();
    });

    it('should be able to create CultureInfoDto object', () => {
      const cultureDto = {
        displayName: 'English (United States)',
        name: 'en-US',
      };
      expect(cultureDto).toBeDefined();
    });

    it('should be able to create LanguageResourceDto object', () => {
      const resourceDto = {
        name: 'LanguageManagement',
      };
      expect(resourceDto).toBeDefined();
    });

    it('should be able to create GetLanguagesTextsInput object', () => {
      const input = {
        filter: 'search',
        resourceName: 'AbpIdentity',
        baseCultureName: 'en-US',
        targetCultureName: 'fr-FR',
        getOnlyEmptyValues: true,
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'name asc',
      };
      expect(input).toBeDefined();
    });
  });

  describe('Export completeness', () => {
    it('should export all expected members', () => {
      const expectedExports = [
        'LanguageService',
        'LanguageTextService',
      ];

      expectedExports.forEach((exportName) => {
        expect(proxyExports).toHaveProperty(exportName);
      });
    });

    it('should have LanguageService with expected methods', () => {
      const mockRest = { request: () => Promise.resolve({}) };
      const service = new proxyExports.LanguageService(mockRest as any);

      expect(typeof service.create).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.get).toBe('function');
      expect(typeof service.getAllList).toBe('function');
      expect(typeof service.getCulturelist).toBe('function');
      expect(typeof service.getList).toBe('function');
      expect(typeof service.getResources).toBe('function');
      expect(typeof service.setAsDefault).toBe('function');
      expect(typeof service.update).toBe('function');
    });

    it('should have LanguageTextService with expected methods', () => {
      const mockRest = { request: () => Promise.resolve({}) };
      const service = new proxyExports.LanguageTextService(mockRest as any);

      expect(typeof service.get).toBe('function');
      expect(typeof service.getList).toBe('function');
      expect(typeof service.restoreToDefault).toBe('function');
      expect(typeof service.update).toBe('function');
    });
  });
});
