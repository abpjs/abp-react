/**
 * Tests for proxy/dto/models.ts
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import type {
  CreateLanguageDto,
  CultureInfoDto,
  GetLanguagesTextsInput,
  LanguageDto,
  LanguageResourceDto,
  LanguageTextDto,
  UpdateLanguageDto,
} from '../../../proxy/dto/models';

describe('Proxy DTO Models', () => {
  describe('CreateLanguageDto', () => {
    it('should define all required properties', () => {
      const dto: CreateLanguageDto = {
        displayName: 'English',
        cultureName: 'en-US',
        uiCultureName: 'en-US',
        flagIcon: 'us',
        isEnabled: true,
      };

      expect(dto.displayName).toBe('English');
      expect(dto.cultureName).toBe('en-US');
      expect(dto.uiCultureName).toBe('en-US');
      expect(dto.flagIcon).toBe('us');
      expect(dto.isEnabled).toBe(true);
    });

    it('should support optional extraProperties', () => {
      const dto: CreateLanguageDto = {
        displayName: 'French',
        cultureName: 'fr-FR',
        uiCultureName: 'fr-FR',
        flagIcon: 'fr',
        isEnabled: true,
        extraProperties: { customField: 'value' },
      };

      expect(dto.extraProperties).toEqual({ customField: 'value' });
    });

    it('should allow extraProperties to be undefined', () => {
      const dto: CreateLanguageDto = {
        displayName: 'German',
        cultureName: 'de-DE',
        uiCultureName: 'de-DE',
        flagIcon: 'de',
        isEnabled: false,
      };

      expect(dto.extraProperties).toBeUndefined();
    });
  });

  describe('UpdateLanguageDto', () => {
    it('should define all required properties', () => {
      const dto: UpdateLanguageDto = {
        displayName: 'English (Updated)',
        flagIcon: 'gb',
        isEnabled: true,
      };

      expect(dto.displayName).toBe('English (Updated)');
      expect(dto.flagIcon).toBe('gb');
      expect(dto.isEnabled).toBe(true);
    });

    it('should support optional extraProperties', () => {
      const dto: UpdateLanguageDto = {
        displayName: 'French',
        flagIcon: 'fr',
        isEnabled: false,
        extraProperties: { updatedBy: 'admin' },
      };

      expect(dto.extraProperties).toEqual({ updatedBy: 'admin' });
    });

    it('should allow setting isEnabled to false', () => {
      const dto: UpdateLanguageDto = {
        displayName: 'Disabled Language',
        flagIcon: 'xx',
        isEnabled: false,
      };

      expect(dto.isEnabled).toBe(false);
    });
  });

  describe('LanguageDto', () => {
    it('should define all required properties', () => {
      const dto: LanguageDto = {
        id: 'lang-123',
        cultureName: 'en-US',
        uiCultureName: 'en-US',
        displayName: 'English',
        flagIcon: 'us',
        isEnabled: true,
        isDefaultLanguage: true,
      };

      expect(dto.id).toBe('lang-123');
      expect(dto.cultureName).toBe('en-US');
      expect(dto.uiCultureName).toBe('en-US');
      expect(dto.displayName).toBe('English');
      expect(dto.flagIcon).toBe('us');
      expect(dto.isEnabled).toBe(true);
      expect(dto.isDefaultLanguage).toBe(true);
    });

    it('should support optional creationTime and creatorId', () => {
      const dto: LanguageDto = {
        id: 'lang-456',
        cultureName: 'fr-FR',
        uiCultureName: 'fr-FR',
        displayName: 'French',
        flagIcon: 'fr',
        isEnabled: true,
        isDefaultLanguage: false,
        creationTime: '2024-01-15T10:30:00Z',
        creatorId: 'user-789',
      };

      expect(dto.creationTime).toBe('2024-01-15T10:30:00Z');
      expect(dto.creatorId).toBe('user-789');
    });

    it('should support Date object for creationTime', () => {
      const creationDate = new Date('2024-01-15T10:30:00Z');
      const dto: LanguageDto = {
        id: 'lang-789',
        cultureName: 'de-DE',
        uiCultureName: 'de-DE',
        displayName: 'German',
        flagIcon: 'de',
        isEnabled: true,
        isDefaultLanguage: false,
        creationTime: creationDate,
      };

      expect(dto.creationTime).toEqual(creationDate);
    });

    it('should support optional extraProperties', () => {
      const dto: LanguageDto = {
        id: 'lang-001',
        cultureName: 'es-ES',
        uiCultureName: 'es-ES',
        displayName: 'Spanish',
        flagIcon: 'es',
        isEnabled: true,
        isDefaultLanguage: false,
        extraProperties: { region: 'Europe' },
      };

      expect(dto.extraProperties).toEqual({ region: 'Europe' });
    });

    it('should handle non-default language', () => {
      const dto: LanguageDto = {
        id: 'lang-002',
        cultureName: 'ja-JP',
        uiCultureName: 'ja-JP',
        displayName: 'Japanese',
        flagIcon: 'jp',
        isEnabled: true,
        isDefaultLanguage: false,
      };

      expect(dto.isDefaultLanguage).toBe(false);
    });
  });

  describe('LanguageTextDto', () => {
    it('should define all required properties', () => {
      const dto: LanguageTextDto = {
        resourceName: 'AbpIdentity',
        cultureName: 'fr-FR',
        baseCultureName: 'en-US',
        baseValue: 'Username',
        name: 'UserName',
        value: 'Nom d\'utilisateur',
      };

      expect(dto.resourceName).toBe('AbpIdentity');
      expect(dto.cultureName).toBe('fr-FR');
      expect(dto.baseCultureName).toBe('en-US');
      expect(dto.baseValue).toBe('Username');
      expect(dto.name).toBe('UserName');
      expect(dto.value).toBe('Nom d\'utilisateur');
    });

    it('should handle empty translation value', () => {
      const dto: LanguageTextDto = {
        resourceName: 'AbpAccount',
        cultureName: 'zh-CN',
        baseCultureName: 'en-US',
        baseValue: 'Login',
        name: 'Login',
        value: '',
      };

      expect(dto.value).toBe('');
    });

    it('should handle special characters in values', () => {
      const dto: LanguageTextDto = {
        resourceName: 'MyResource',
        cultureName: 'ko-KR',
        baseCultureName: 'en-US',
        baseValue: 'Hello "World" <script>',
        name: 'Greeting',
        value: '안녕하세요 "세계" <스크립트>',
      };

      expect(dto.baseValue).toBe('Hello "World" <script>');
      expect(dto.value).toBe('안녕하세요 "세계" <스크립트>');
    });
  });

  describe('CultureInfoDto', () => {
    it('should define all required properties', () => {
      const dto: CultureInfoDto = {
        displayName: 'English (United States)',
        name: 'en-US',
      };

      expect(dto.displayName).toBe('English (United States)');
      expect(dto.name).toBe('en-US');
    });

    it('should handle various culture names', () => {
      const cultures: CultureInfoDto[] = [
        { displayName: 'English', name: 'en' },
        { displayName: 'French (France)', name: 'fr-FR' },
        { displayName: 'Chinese (Simplified)', name: 'zh-Hans' },
        { displayName: 'Arabic (Saudi Arabia)', name: 'ar-SA' },
      ];

      expect(cultures).toHaveLength(4);
      expect(cultures[0].name).toBe('en');
      expect(cultures[2].name).toBe('zh-Hans');
    });
  });

  describe('LanguageResourceDto', () => {
    it('should define name property', () => {
      const dto: LanguageResourceDto = {
        name: 'AbpIdentity',
      };

      expect(dto.name).toBe('AbpIdentity');
    });

    it('should handle various resource names', () => {
      const resources: LanguageResourceDto[] = [
        { name: 'AbpIdentity' },
        { name: 'AbpAccount' },
        { name: 'LanguageManagement' },
        { name: 'CustomResource' },
      ];

      expect(resources).toHaveLength(4);
      expect(resources.map((r) => r.name)).toContain('LanguageManagement');
    });
  });

  describe('GetLanguagesTextsInput', () => {
    it('should allow all properties to be optional', () => {
      const input: GetLanguagesTextsInput = {};

      expect(input.filter).toBeUndefined();
      expect(input.resourceName).toBeUndefined();
      expect(input.baseCultureName).toBeUndefined();
      expect(input.targetCultureName).toBeUndefined();
      expect(input.getOnlyEmptyValues).toBeUndefined();
      expect(input.skipCount).toBeUndefined();
      expect(input.maxResultCount).toBeUndefined();
      expect(input.sorting).toBeUndefined();
    });

    it('should support all query parameters', () => {
      const input: GetLanguagesTextsInput = {
        filter: 'search term',
        resourceName: 'AbpIdentity',
        baseCultureName: 'en-US',
        targetCultureName: 'fr-FR',
        getOnlyEmptyValues: true,
        skipCount: 0,
        maxResultCount: 50,
        sorting: 'name asc',
      };

      expect(input.filter).toBe('search term');
      expect(input.resourceName).toBe('AbpIdentity');
      expect(input.baseCultureName).toBe('en-US');
      expect(input.targetCultureName).toBe('fr-FR');
      expect(input.getOnlyEmptyValues).toBe(true);
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(50);
      expect(input.sorting).toBe('name asc');
    });

    it('should support partial parameters', () => {
      const input: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'de',
        maxResultCount: 10,
      };

      expect(input.baseCultureName).toBe('en');
      expect(input.targetCultureName).toBe('de');
      expect(input.maxResultCount).toBe(10);
      expect(input.filter).toBeUndefined();
    });

    it('should handle pagination parameters', () => {
      const input: GetLanguagesTextsInput = {
        skipCount: 20,
        maxResultCount: 10,
      };

      expect(input.skipCount).toBe(20);
      expect(input.maxResultCount).toBe(10);
    });

    it('should handle getOnlyEmptyValues flag', () => {
      const inputTrue: GetLanguagesTextsInput = { getOnlyEmptyValues: true };
      const inputFalse: GetLanguagesTextsInput = { getOnlyEmptyValues: false };

      expect(inputTrue.getOnlyEmptyValues).toBe(true);
      expect(inputFalse.getOnlyEmptyValues).toBe(false);
    });
  });
});
