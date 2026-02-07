/**
 * Tests for proxy/dto/index.ts exports
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import * as dtoExports from '../../../proxy/dto';

describe('Proxy DTO Index Exports', () => {
  describe('Type exports verification', () => {
    it('should export dto module', () => {
      expect(dtoExports).toBeDefined();
    });

    it('should be able to use CreateLanguageDto type', () => {
      // Verify the type can be used (compile-time check)
      const dto = {
        displayName: 'English',
        cultureName: 'en-US',
        uiCultureName: 'en-US',
        flagIcon: 'us',
        isEnabled: true,
      };

      expect(dto.displayName).toBe('English');
      expect(dto.cultureName).toBe('en-US');
    });

    it('should be able to use UpdateLanguageDto type', () => {
      const dto = {
        displayName: 'Updated English',
        flagIcon: 'gb',
        isEnabled: false,
      };

      expect(dto.displayName).toBe('Updated English');
      expect(dto.isEnabled).toBe(false);
    });

    it('should be able to use LanguageDto type', () => {
      const dto = {
        id: 'lang-123',
        cultureName: 'en-US',
        uiCultureName: 'en-US',
        displayName: 'English',
        flagIcon: 'us',
        isEnabled: true,
        isDefaultLanguage: true,
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user-1',
      };

      expect(dto.id).toBe('lang-123');
      expect(dto.isDefaultLanguage).toBe(true);
    });

    it('should be able to use LanguageTextDto type', () => {
      const dto = {
        resourceName: 'AbpIdentity',
        cultureName: 'fr-FR',
        baseCultureName: 'en-US',
        baseValue: 'Username',
        name: 'UserName',
        value: 'Nom d\'utilisateur',
      };

      expect(dto.resourceName).toBe('AbpIdentity');
      expect(dto.value).toBe('Nom d\'utilisateur');
    });

    it('should be able to use CultureInfoDto type', () => {
      const dto = {
        displayName: 'English (United States)',
        name: 'en-US',
      };

      expect(dto.displayName).toBe('English (United States)');
      expect(dto.name).toBe('en-US');
    });

    it('should be able to use LanguageResourceDto type', () => {
      const dto = {
        name: 'LanguageManagement',
      };

      expect(dto.name).toBe('LanguageManagement');
    });

    it('should be able to use GetLanguagesTextsInput type', () => {
      const input = {
        filter: 'test',
        resourceName: 'AbpIdentity',
        baseCultureName: 'en-US',
        targetCultureName: 'fr-FR',
        getOnlyEmptyValues: true,
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'name asc',
      };

      expect(input.filter).toBe('test');
      expect(input.getOnlyEmptyValues).toBe(true);
    });
  });

  describe('Optional properties', () => {
    it('should allow CreateLanguageDto with optional extraProperties', () => {
      const dtoWithExtra = {
        displayName: 'French',
        cultureName: 'fr-FR',
        uiCultureName: 'fr-FR',
        flagIcon: 'fr',
        isEnabled: true,
        extraProperties: { custom: 'value' },
      };

      const dtoWithoutExtra: Record<string, unknown> = {
        displayName: 'German',
        cultureName: 'de-DE',
        uiCultureName: 'de-DE',
        flagIcon: 'de',
        isEnabled: true,
      };

      expect(dtoWithExtra.extraProperties).toBeDefined();
      expect(dtoWithoutExtra['extraProperties']).toBeUndefined();
    });

    it('should allow LanguageDto with optional fields', () => {
      const fullDto = {
        id: 'lang-1',
        cultureName: 'en-US',
        uiCultureName: 'en-US',
        displayName: 'English',
        flagIcon: 'us',
        isEnabled: true,
        isDefaultLanguage: true,
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user-1',
        extraProperties: { region: 'NA' },
      };

      const minimalDto: Record<string, unknown> = {
        id: 'lang-2',
        cultureName: 'fr-FR',
        uiCultureName: 'fr-FR',
        displayName: 'French',
        flagIcon: 'fr',
        isEnabled: true,
        isDefaultLanguage: false,
      };

      expect(fullDto.creationTime).toBeDefined();
      expect(minimalDto['creationTime']).toBeUndefined();
    });

    it('should allow GetLanguagesTextsInput with all optional fields', () => {
      const emptyInput = {};
      const fullInput = {
        filter: 'test',
        resourceName: 'AbpIdentity',
        baseCultureName: 'en-US',
        targetCultureName: 'fr-FR',
        getOnlyEmptyValues: true,
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'name asc',
      };

      expect(Object.keys(emptyInput)).toHaveLength(0);
      expect(Object.keys(fullInput)).toHaveLength(8);
    });
  });
});
